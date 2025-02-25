import { Server, IncomingMessage } from 'http';
import WebSocket, { WebSocketServer } from "ws";
import User from './models/user.model';
//import jwt from "jsonwebtoken";
import Message from './models/message.model';
import cookie from "cookie";
import { verifyAuthToken } from './utils/jwt.utils';

interface ExtendedWebSocket extends WebSocket {
    userId?: string;
    username?: string;
    isAlive?: boolean;
    timer?: NodeJS.Timeout;
    deathTimer?: NodeJS.Timeout;
}

// Creating the WebSocket Server
export const createWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });

    // 🔰 Handling Client Connection
    wss.on("connection", (connection: ExtendedWebSocket, req: IncomingMessage) => {
        // 👾 Extracting & Verifying JWT Token
        const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
        const token = cookies.authorization; // 🔴 troubleshootif issue (cookies.authToken)
        if (!token) {
            connection.close(1008, "Unauthorized");
            throw new Error("Unauthorized: No token in cookies");
        }
        // 👤 user details
        const userData: any = verifyAuthToken(token);
        connection.userId = userData._id;
        connection.username = `${userData.firstName} ${userData.lastName}`;

        console.log(`WebSocket connected: ${connection.username}`);

        // 👥 Retrieves a list of all connected users.
        const notifyAboutOnlinePeople = async () => {
            // 🔰 retrieve online users
            const onlineUsers = await Promise.all(
                Array.from(wss.clients).map(async (client) => {
                    const extendedClient = client as ExtendedWebSocket;
                    if (!extendedClient.userId) return null;

                    const user = await User.findById(extendedClient.userId);
                    return {
                        userId: extendedClient.userId,
                        username: extendedClient.username,
                        avatarLink: user ? user.avatarLink : null,
                    };
                })
            );
            //🔲 filter out null values
            const filteredUsers = onlineUsers.filter((user) => user !== null);
            // 🔈 broadcast online user list
            wss.clients.forEach((client) => {
                client.send(
                    JSON.stringify({
                        online: filteredUsers,
                    })
                );
            });
        };

        // Notify other users about online status
        notifyAboutOnlinePeople();

        // 🔻 Heartbeat Mechanism (Detecting Disconnected Clients)
        connection.isAlive = true;
        // ping every 5 sec and mark disconnecteed if marked and remove.
        connection.timer = setInterval(() => {
            connection.ping();
            connection.deathTimer = setTimeout(() => {
                connection.isAlive = false;
                clearInterval(connection.timer!);
                connection.terminate();
                notifyAboutOnlinePeople();
                console.log("dead");
            }, 1000);
        }, 5000);
        //The pong event resets the timer, indicating that the client is still alive.
        connection.on("pong", () => {
            clearTimeout(connection.deathTimer!);
        });

        // 🔻 Handling Incoming Messages
        connection.on("message", async (message: WebSocket.RawData) => {
            try {
                const messageData = JSON.parse(message.toString());
                const { recipient, text } = messageData;
                if (!connection.userId || !recipient || !text) return;

                const msgDoc = await Message.create({
                    sender: connection.userId,
                    recipient,
                    text,
                });

                wss.clients.forEach((client) => {
                    const extendedClient = client as ExtendedWebSocket;
                    if (extendedClient.userId === recipient) {
                        client.send(
                            JSON.stringify({
                                sender: connection.username,
                                text,
                                id: msgDoc._id,
                            })
                        );
                    }
                });
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    });
};