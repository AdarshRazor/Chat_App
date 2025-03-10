"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MessageInput from "./MessageInput";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BellRing } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useChatStore } from '@/store/chatStore';
import { useSocketStore } from '@/store/socketStore';
import { useAuthStore } from '@/store/authStore';

interface Message {
    _id: string;
    sender: string;
    receiver: string;
    message: string;
    createdAt: string;
    read: boolean;
}

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ChatMessageProps {
    message: Message;
    loggedin: User | null;
}

export default function ChatBox() {
    const [loading, setLoading] = useState(true);
    const [loggedin, setLoggedin] = useState<User | null>(null);
    const [conversation, setConversation] = useState<Message[]>([]);
    const router = useRouter();
    const { selectedUser } = useChatStore();
    const { socket } = useSocketStore();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const token = checkAuth();
        if (!token) {
            router.push('/login');
            return;
        }

        if (socket) {
            socket.on('private_message', (message: Message) => {
                setConversation(prev => [...prev, message]);
            });

            return () => {
                socket.off('private_message');
            };
        }
    }, [socket, router, checkAuth]);

    const generateAvatarUrl = (seed: string | undefined) => {
        return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
    };

    return (
        <Card className="m-2 flex-grow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-semibold flex items-center">
                    {
                      selectedUser ? (
                        <>
                        <Avatar className="mx-2">
                            <AvatarImage
                                src={generateAvatarUrl(selectedUser?.firstname)}
                            />
                        </Avatar>
                        {selectedUser?.firstname} ({selectedUser?._id})
                        </>
                      ) : (
                        <p>
                          Select a user to start the chat
                        </p>                        
                      )
                    }
                </CardTitle>
                <BellRing />
            </CardHeader>
            <hr />
            <CardContent className="my-4 flex-grow overflow-y-auto">
                <TooltipProvider>
                    {loading ? (
                        <div className="space-y-4">
                        <div className="flex">
                          <RecieveSkeleton />
                        </div>
                        <div className="flex justify-end">
                          <RecieveSkeleton />
                        </div>
                        <div className="flex">
                          <RecieveSkeleton />
                        </div>
                        <div className="flex justify-end">
                          <RecieveSkeleton />
                        </div>
                      </div>
                    ) : (
                        <div className="space-y-4">
                            {conversation.map((message) => (
                                <ChatMessage
                                    key={message._id}
                                    message={message}
                                    loggedin={loggedin}
                                />
                            ))}
                        </div>
                    )}
                </TooltipProvider>
            </CardContent>
            <MessageInput/>
        </Card>
    );
}

function ChatMessage({ message, loggedin }: ChatMessageProps) {
  const isLoggedInUser = loggedin ? message.sender === loggedin._id : false;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`p-2 rounded-lg max-w-md ${
            isLoggedInUser
              ? "bg-blue-500 text-white self-end ml-auto"
              : "bg-gray-200 text-black"
          }`}
        >
          {message.message}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="text-xs text-white">{message.createdAt}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function RecieveSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}