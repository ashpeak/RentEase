"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { PaperclipIcon, SendHorizontal, Smile } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Mock data - would come from API in a real application
const conversations = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    unread: true,
    lastMessage: {
      text: "Hi, is the mountain bike still available for next weekend?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    },
    product: {
      id: 201,
      name: "Mountain Bike",
      image: "/placeholder.svg?height=48&width=48",
    },
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    unread: false,
    lastMessage: {
      text: "Thanks for the quick response. I'd like to rent your camera for my upcoming trip.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    product: {
      id: 202,
      name: "DSLR Camera",
      image: "/placeholder.svg?height=48&width=48",
    },
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ER",
    },
    unread: false,
    lastMessage: {
      text: "I've approved your rental request. Let me know when you'd like to pick it up.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    product: {
      id: 203,
      name: "DJ Equipment",
      image: "/placeholder.svg?height=48&width=48",
    },
  },
  {
    id: 4,
    user: {
      id: 104,
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DW",
    },
    unread: false,
    lastMessage: {
      text: "I've just dropped off the tent. Thanks for renting it!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    },
    product: {
      id: 204,
      name: "Luxury Tent",
      image: "/placeholder.svg?height=48&width=48",
    },
  },
]

// Mock messages for the first conversation
const mockMessages = [
  {
    id: 1,
    senderId: 101, // Sarah Johnson
    text: "Hi! I'm interested in renting your mountain bike for next weekend (Aug 20-22). Is it still available?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: 2,
    senderId: "me",
    text: "Hello Sarah! Yes, the mountain bike is available for that weekend. It's a Trek Fuel EX 8 29er in great condition.",
    timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
  },
  {
    id: 3,
    senderId: 101, // Sarah Johnson
    text: "Great! Could you tell me more about it? I'm planning to do some trail riding at Redwood Park.",
    timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
  },
  {
    id: 4,
    senderId: "me",
    text: "It's perfect for trail riding. Full suspension, hydraulic disc brakes, and it comes with a helmet. I've used it at Redwood several times and it handles the trails there really well.",
    timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
  },
  {
    id: 5,
    senderId: 101, // Sarah Johnson
    text: "Sounds perfect! And how much would it be for the 3 days?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 6,
    senderId: "me",
    text: "It's $45 per day, so $135 for the 3 days. There's also a refundable security deposit of $300.",
    timestamp: new Date(Date.now() - 1000 * 60 * 28), // 28 minutes ago
  },
  {
    id: 7,
    senderId: 101, // Sarah Johnson
    text: "Hi, is the mountain bike still available for next weekend?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to an API
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">Communicate with renters and owners</p>
          </div>

          <div className="grid h-[600px] overflow-hidden rounded-lg border md:grid-cols-[350px_1fr]">
            {/* Conversation List */}
            <div className="border-r">
              <div className="p-4 border-b">
                <Input placeholder="Search messages..." />
              </div>
              <ScrollArea className="h-[552px]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation.id === conversation.id ? "bg-muted" : ""
                    } ${conversation.unread ? "font-medium" : ""}`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                      <AvatarFallback>{conversation.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {conversation.user.name}
                          {conversation.unread && (
                            <span className="ml-2 inline-block w-2 h-2 bg-teal-600 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-sm">
                          <Image
                            src={conversation.product.image || "/placeholder.svg"}
                            alt={conversation.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate text-sm text-muted-foreground">{conversation.lastMessage.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Message Window */}
            <div className="flex flex-col">
              {/* Conversation Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={selectedConversation.user.avatar || "/placeholder.svg"}
                      alt={selectedConversation.user.name}
                    />
                    <AvatarFallback>{selectedConversation.user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedConversation.user.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-sm mr-1">
                        <Image
                          src={selectedConversation.product.image || "/placeholder.svg"}
                          alt={selectedConversation.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {selectedConversation.product.name}
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    View Rental
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      {message.senderId !== "me" && (
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage
                            src={selectedConversation.user.avatar || "/placeholder.svg"}
                            alt={selectedConversation.user.name}
                          />
                          <AvatarFallback>{selectedConversation.user.initials}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === "me" ? "bg-teal-600 text-white" : "bg-muted text-foreground"
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div
                          className={`text-xs mt-1 ${message.senderId === "me" ? "text-white/80" : "text-muted-foreground"}`}
                        >
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <PaperclipIcon className="h-5 w-5" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-10 flex-1 resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Smile className="h-5 w-5" />
                    <span className="sr-only">Add emoji</span>
                  </Button>
                  <Button
                    className="h-8 w-8 shrink-0 bg-teal-600 hover:bg-teal-700"
                    size="icon"
                    onClick={handleSendMessage}
                  >
                    <SendHorizontal className="h-5 w-5" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
