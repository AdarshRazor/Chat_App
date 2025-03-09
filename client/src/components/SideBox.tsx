
'use client';
import React, { useMemo } from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SideBoxProps {
  userDetails: User | null;
  allUsers: User[] | null;
}

function SideBox({ userDetails, allUsers }: SideBoxProps) {
  const generateAvatarUrl = (seed: string | undefined) => {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
  };

  const filteredUsers = useMemo(() => {
    if (!userDetails || !allUsers) return [];
    return allUsers.filter(user => String(user._id) !== String(userDetails._id));
  }, [userDetails, allUsers]);

  return (
    <div className="w-64 border-r p-4 flex flex-col">
      <div className="flex flex-row items-center">
        <Avatar>
          <AvatarImage src={generateAvatarUrl(userDetails?.firstname)} alt={userDetails?.firstname} />
        </Avatar>
        <p className="m-2">{userDetails?.firstname}</p>
      </div>
      <hr className="my" />
      <div className="flex-grow overflow-y-auto">
        <Table className="h-full">
          <TableHeader>
            <TableRow>
              <TableHead>Chats as as</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((onlineUser) => (
                <TableRow key={onlineUser._id}>
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
  );
}

export default SideBox;