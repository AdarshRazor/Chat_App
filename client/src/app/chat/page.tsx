'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useProfileStore } from '@/store/profileStore';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { useSocketStore } from '@/store/socketStore';
import ChatBox from '@/components/ChatBox'
import { useChatStore } from '@/store/chatStore';

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

interface ChatPartner {
  _id: string;
  username: string;
  avatar?: string;
  unreadCount: number;
}

function ChatPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { checkAuth, logout } = useAuthStore();
  const {fetchUserDetails, fetchAllUsersDetail, userDetails, isLoading, error, allUsers, needsRedirected, resetRedirectFlag} = useProfileStore()
  const { setSelectedUser } = useChatStore(); // chatstore





  //implementing socket.io 
  const {socket, onlineUsers} = useSocketStore()
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = checkAuth();

        if (!token) {
          router.push('/login');
          return;
        }

        // const fetchUser = await fetchUserDetails();
        // const fetchAllUser = await fetchAllUsersDetail();
        await Promise.all([fetchUserDetails(), fetchAllUsersDetail()]);

      // Log all users
      } catch (error: any) {
        console.log('[chatPage]fetchData Error: ',error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [checkAuth, router, fetchUserDetails, fetchAllUsersDetail]);

  useEffect(() => {
    if (needsRedirected) {
      router.push('/login');
      resetRedirectFlag();
    }
  }, [needsRedirected, router, resetRedirectFlag]);

  const filteredUsers = useMemo(() => {
    if (!userDetails || !allUsers) return [];
    return allUsers.filter(user => String(user._id) !== String(userDetails._id));
  }, [userDetails, allUsers]);

  const generateAvatarUrl = (seed: string | undefined) => {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
  };

  // implemting socket.io here 📩 -----------------------------------------------

  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Card className="flex h-[98vh]"> {/*h-screen*/}
      <div className="w-64 border-r p-4 flex flex-col">
        <div className="flex flex-row items-center">
          <Avatar>
            <AvatarImage src={generateAvatarUrl(userDetails?.firstname)} alt={userDetails?.firstname} />
          </Avatar>
          <p className="m-2">{userDetails?.firstname} ({userDetails?._id})</p>
        </div>
        <hr className="my" />
        <div className="flex-grow overflow-y-auto">
          <Table className="h-full">
            <TableHeader>
              <TableRow>
                <TableHead>Chats</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((onlineUser) => (
                  <TableRow key={String(onlineUser._id)} onClick={() => handleUserSelect({ ...onlineUser, _id: String(onlineUser._id) })}>
                      <TableCell className="flex flex-row items-center">
                        <Avatar>
                          <AvatarImage src={generateAvatarUrl(onlineUser.firstname)} alt={onlineUser.firstname} />
                        </Avatar>
                        <div className="m-2">
                        {onlineUser.firstname}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell>Loading ...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ChatBox />
      </Card>
      <div className="flex justify-start mt-[-50] ml-5">
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
          Logout
        </Button>
      </div>
    </>
  );
}

export default ChatPage;