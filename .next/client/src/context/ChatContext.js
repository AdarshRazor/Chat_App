import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)

    //state for messages
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)

    console.log("messages herererereer", messages)

    // get all the available users
    useEffect(() => {
        const getUsers = async () => {

            //here we get all the users from the DB
            const response = await getRequest(`${baseUrl}/users`)

            if(response.error){
                return console.log("Error fetching users", response) // addd response.error if not working properly
            }

            // pchat is the array of users whom we can chat with
            const pChats = response.filter((u) => { 
                //check if chat is already created with that user
                let isChatCreated = false

                if(user?._id === u._id) return false // users wont be added to chats


                // the following condition is hardcoded. change in future versions
                if(userChats){
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }
                    return !isChatCreated
            })

            console.log('Potential Chats (filtered):', pChats); // Debugging
            setPotentialChats(pChats)
        }
        getUsers()
    }, [userChats])

    // perform http request and get the user from backend api (useeffect hook)
    useEffect(() => {
        const getUserChats = async () => {
            if(user?._id){

                setIsUserChatsLoading(true)
                // reset the error every time we send a message
                setUserChatsError(null)

                // this response can have error or success
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

                setIsUserChatsLoading(false)

                if(response.error){
                    // remove .error if ut throw error or add .error in response
                    return setUserChatsError(response)
                }
                setUserChats(response)
            }
        }
        getUserChats()
    }, [user])

    // create a chat when clicked on user
    const createChat = useCallback( async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`,JSON.stringify({
            firstId, secondId
        })   
    );
    if(response.error){
        return console.log("Error creating chat", response.error)
    }

        setUserChats((prev)=> [...prev, response]);
    }, [])



    // when click start a new chat
    const updateCurrentChat = useCallback((chat) => {
        try {
            setCurrentChat(chat);
        } catch (error) {
            console.error('Error updating current chat:', error);
        }
    }, []);






    useEffect(() => {
        const getMessages = async () => {

                setIsMessagesLoading(true)
                setMessagesError(null)

                // this response can have error or success
                const response = await getRequest(
                    `${baseUrl}/messages/${currentChat?._id}`
                )

                setIsMessagesLoading(false)

                if(response.error){
                    // remove .error if ut throw error or add .error in response
                    return setMessagesError(response)
                }
                setMessages(response)
        }
        getMessages()
    }, [currentChat])


    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError
        }}>
            {children}
        </ChatContext.Provider>
    )
}