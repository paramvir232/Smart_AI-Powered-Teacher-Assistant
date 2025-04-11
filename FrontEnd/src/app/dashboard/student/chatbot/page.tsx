"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please type something.");
      return;
    }

    const newUserMsg: ChatMessage = { role: "user", text: message };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "https://ai-teacher-api-xnd1.onrender.com/student/chatbot",
        {
          query_text: message,
        }
      );

      const reply = data.FeedBack || "No response from AI.";
      const botMsg: ChatMessage = { role: "bot", text: reply };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get a response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[89vh] flex flex-col bg-[#0f172a] text-white rounded-xl shadow-md overflow-hidden">
      {/* Welcome Header */}
      <div className="w-full bg-[#1e293b] text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold">EduFlow AI Chat Assistant</h1>
        <p className="text-sm text-gray-300">
          Ask anything related to college life, academics, or exams.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-line break-words ${
              msg.role === "user"
                ? "bg-[#334155] text-white ml-auto text-right w-auto"
                : "bg-[#334155] text-white mr-auto"
            }`}
          >
            {msg.role === "user" ? "🧑‍🎓 You:" : "🤖 AI:"} {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#1e293b] border-t border-gray-700 px-6 py-4 flex items-center gap-4">
        <textarea
          className="flex-1 bg-[#0f172a] border border-gray-600 rounded-md p-3 resize-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Type your message..."
          value={message}
          rows={2}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <Button
          className="bg-white text-black hover:bg-gray-300 px-6 py-2 font-semibold"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
