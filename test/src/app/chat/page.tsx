import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChatWindow from '../../components/ChatWindow';

export default function Chat() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check for auth on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      // Optionally, decode token or fetch user details
      setUser({ email: 'user@example.com' });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white">Real-Time Chat App</header>
      <main className="flex-1">
        {user && <ChatWindow />}
      </main>
    </div>
  );
}
