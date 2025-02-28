'use client'
import React ,{useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

function ChatPage() {
  const [user, setUser] = useState<User|null>(null);
  const [users, setUsers] = useState<User[]|null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    router.push("/"); // Redirect to login page
  };

  useEffect(()=>{

    const fetchAllUsersDetails = async () => {
      try{
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/login');
          throw new Error("No token found. Please log in.");
        }

        // Fetch the current user's details from the backend
        const res = await fetch("http://localhost:3000/api/auth/people", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          router.push('/login')
          throw new Error(errData.message || "Failed to fetch user details.");
        }

        const data: User[] = await res.json();
        setUsers(data);
        console.log('logged in user',data)
      } catch (error:any){
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchUserDetails = async () => {
      try{
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/login');
          throw new Error("No token found. Please log in.");
        }

        // Fetch the current user's details from the backend
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          router.push('/login')
          throw new Error(errData.message || "Failed to fetch user details.");
        }

        const data: User = await res.json();
        setUser(data);
        console.log('Online user',data)
      } catch (error:any){
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails();
    fetchAllUsersDetails();
  },[])

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  return (
    <>
    <div>ChatPage</div>
    <br/><hr/><br/>
    <h1>Logged in user</h1>
    {user && <>
      <div>{user.firstname}</div>
      <div>{user.lastname}</div>
      <div>{user._id}</div>
      </>
    }
    <br/><hr/><br/>
    <h1>Online user</h1>
    {users && user && users.filter((onlineUser) => onlineUser._id !== user._id).map((onlineUser:any) => (
      <div key = {onlineUser._id}>
        {onlineUser?.firstname} {onlineUser?.lastname} {onlineUser?._id} 
      </div>
    ))}

    <div className="flex justify-end mt-20">
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
          Logout
        </Button>
      </div>
    </>
  )
}

export default ChatPage