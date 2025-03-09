import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSocketStore } from "@/store/socketStore"
import { useChatStore } from "@/store/chatStore"

export default function MessageInput() {
  const [text, setText] = useState("")
  const { socket } = useSocketStore()
  const { selectedUser } = useChatStore()

  const handleSendMessage = () => {
    if (!text.trim() || !socket || !selectedUser) return

    socket.emit("private_message", {
      receiverId: selectedUser._id,
      message: text.trim()
    })

    setText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="border-t p-4 flex items-center">
      <Input
        type="text"
        placeholder="Type your message..."
        className="flex-1 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button 
        variant="default"
        onClick={handleSendMessage}
        disabled={!selectedUser}
      >
        Send
      </Button>
    </div>
  )
}
