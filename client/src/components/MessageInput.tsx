import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function MessageInput() {
  const [text, setText] = useState("")

  return (
    <div className="border-t p-4 flex items-center">
      <Input
        type="text"
        placeholder="Type your message..."
        className="flex-1 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="default">
        Send
      </Button>
    </div>
  )
}
