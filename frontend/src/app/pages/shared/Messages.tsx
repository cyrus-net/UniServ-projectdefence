import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Send, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import useAutoDismiss from "../../hooks/useAutoDismiss";

interface Message {
  _id: string;
  sender: { _id: string; fullName: string; email: string };
  receiver: { _id: string; fullName: string; email: string };
  message: string;
  createdAt: string;
}

interface Conversation {
  userId: string;
  userFullName: string;
  lastMessage: string;
  lastMessageTime: string;
}

export function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState("");

  useAutoDismiss(sendError, setSendError, 3000);

  const loadMessages = useCallback(async () => {
    try {
      const result = await api.messages.getAll();
      setMessages(result);
      
      // Build conversations from messages
      const convMap: { [key: string]: Conversation } = {};
      result.forEach((msg: Message) => {
        const otherUser = msg.sender._id === user?._id ? msg.receiver : msg.sender;
        const key = otherUser._id;

        if (!convMap[key] || new Date(msg.createdAt) > new Date(convMap[key].lastMessageTime)) {
          convMap[key] = {
            userId: otherUser._id,
            userFullName: otherUser.fullName,
            lastMessage: msg.message,
            lastMessageTime: msg.createdAt,
          };
        }
      });
      setConversations(Object.values(convMap));
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    loadMessages();
    const intervalId = window.setInterval(loadMessages, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !messageInput.trim()) return;

    setIsLoading(true);
    setSendError("");
    try {
      const result = await api.messages.send({
        receiverId: selectedUserId,
        message: messageInput.trim(),
      });

      if (result._id) {
        setMessages([...messages, result]);
        setMessageInput("");
        // Update conversation
        await loadMessages();
      } else {
        setSendError(result.message || "Failed to send message");
      }
    } catch (error) {
      setSendError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedConversation = selectedUserId 
    ? conversations.find(c => c.userId === selectedUserId)
    : null;

  const selectedMessages = selectedUserId
    ? messages.filter(
        m =>
          (m.sender._id === user?._id && m.receiver._id === selectedUserId) ||
          (m.sender._id === selectedUserId && m.receiver._id === user?._id)
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Conversations</h2>
              </div>

              {conversations.length === 0 ? (
                <div className="p-8 text-center text-foreground/50">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border max-h-96 overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={`w-full text-left p-4 hover:bg-accent transition-colors ${
                        selectedUserId === conv.userId ? "bg-accent" : ""
                      }`}
                    >
                      <p className="font-medium text-sm">{conv.userFullName}</p>
                      <p className="text-xs text-foreground/60 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-foreground/40 mt-1">
                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2">
            {selectedUserId && selectedConversation ? (
              <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-96">
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">{selectedConversation.userFullName}</h3>
                  <p className="text-xs text-foreground/60">
                    {selectedMessages.length} messages
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-foreground/50">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    selectedMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.sender._id === user?._id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender._id === user?._id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border space-y-2">
                  {sendError && (
                    <div className="text-red-500 text-xs">{sendError}</div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !messageInput.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center text-foreground/50">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
