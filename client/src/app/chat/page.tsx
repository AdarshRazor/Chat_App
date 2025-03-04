'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

function ChatPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { checkAuth, logout } = useAuthStore();
  const {fetchUserDetails, fetchAllUsersDetail, userDetails, isLoading, error, allUsers, needsRedirected, resetRedirectFlag} = useProfileStore()
  

  const handleLogout = () => {
    logout();
    router.push('/');
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div>ChatPage</div>
      <br />
      <hr />
      <br />
      <h1>Logged in user</h1>
      {userDetails && (
        <>
          <div>{userDetails.firstname}</div>
          <div>{userDetails.lastname}</div>
          <div>{userDetails._id}</div>
        </>
      )}
      <br />
      <hr />
      <br />
      <h1>Online user</h1>
      {filteredUsers.map((onlineUser) => (
        <div key={onlineUser._id}>
          {onlineUser?.firstname} {onlineUser?.lastname} {onlineUser?._id}
        </div>
      ))}
      <div className="flex justify-end mt-20">
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
          Logout
        </Button>
      </div>
    </>
  );
}

export default ChatPage;