import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react"
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/login">
        <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white"><MailOpen />Login here</Button>
      </Link>
      <Link href="/register">
        <Button variant="secondary"><MailOpen />Register here</Button>
      </Link>
    </div>
  );
}