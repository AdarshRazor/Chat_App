import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Import Link from Next.js

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Chat App</h1>
      <div className="flex space-x-4">
        <Link href="/login">
          <Button variant="default">Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Register</Button>
        </Link>
      </div>
    </div>
  );
}