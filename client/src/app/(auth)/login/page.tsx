'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data)

      // Extract the access token from the response header
      const authHeader = res.headers.get("authorization");
      const accessToken = authHeader?.split(" ")[1];
      if (!accessToken) {
        setError("Login failed: No access token received.");
        console.log("Login Failed");
        return;
      }

      // Store the token in localStorage for later use (if needed)
      localStorage.setItem("token", accessToken);

      router.push('/chat');

    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
        <p className="mt-4 text-center">
          Not registered?{' '}
          <Link href="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}