"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI assistant. Ask me about sales, inventory, orders, or trends. For example: 'How is business today?' or 'What are the top selling items?'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response (replace with actual API call later)
  const getMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("business") || input.includes("today") || input.includes("revenue")) {
      return "Business is doing well today! 📊\n\n- Total Revenue: ₹2,961.80\n- Orders: 4 orders\n- Average Order Value: ₹740.45\n- Trending Item: Butter Chicken (2 orders)\n\nRevenue is up 12.5% compared to last week!";
    }

    if (input.includes("top") || input.includes("selling") || input.includes("popular")) {
      return "Here are your top-selling items today:\n\n1. 🍗 Butter Chicken - 2 orders (₹700)\n2. 🧀 Paneer Tikka Masala - 2 orders (₹560)\n3. 🍋 Fresh Lime Soda - 3 orders (₹240)\n\nButter Chicken is trending 20% higher than usual!";
    }

    if (input.includes("order") && (input.includes("pending") || input.includes("active"))) {
      return "Current order status:\n\n- Pending: 1 order\n- Cooking: 1 order\n- Ready: 2 orders\n- Completed: 0 orders\n\nOrder #44 (Table 3) has been pending for 2 minutes.";
    }

    if (input.includes("stock") || input.includes("inventory")) {
      return "Inventory status:\n\n✅ All items in stock\n⚠️ No low stock alerts\n\nTop consumed items today:\n- Chicken: 4 portions\n- Paneer: 2 portions\n- Fresh Lime: 3 glasses";
    }

    if (input.includes("staff") || input.includes("waiter") || input.includes("performance")) {
      return "Staff performance today:\n\n1. Sarah (Waiter) - 3 orders, ₹2,014.80\n2. John (Manager) - 1 order, ₹590.00\n\nAverage prep time: 18 minutes (-2m from yesterday)";
    }

    if (input.includes("delivery")) {
      return "Delivery status:\n\n- Active deliveries: 1\n- Completed today: 1\n- Average delivery time: 25 minutes\n\nAll deliveries are on time! 🚚";
    }

    if (input.includes("table")) {
      return "Table status:\n\n- Occupied: 3 tables (T1, T3, T5)\n- Available: 2 tables (T2, T4)\n- Capacity utilization: 60%";
    }

    return "I can help you with:\n\n📊 Sales & Revenue\n🍽️ Orders & Menu\n📦 Inventory & Stock\n👥 Staff Performance\n🚚 Delivery Status\n🪑 Table Management\n\nTry asking: 'Show me today's revenue' or 'What's trending?'";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getMockResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden border-2 shadow-2xl transition-all",
            isMinimized
              ? "h-16 w-80"
              : "h-[600px] w-96 max-h-[90vh] max-w-[calc(100vw-3rem)]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">
                  {isLoading ? "Thinking..." : "Online"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1 transition-colors hover:bg-white/20"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-zinc-50 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "mb-4 flex gap-3",
                      message.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                        message.role === "assistant"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-zinc-900 text-white"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-4 py-2 text-sm",
                        message.role === "assistant"
                          ? "bg-white text-zinc-900"
                          : "bg-zinc-900 text-white"
                      )}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          message.role === "assistant"
                            ? "text-zinc-400"
                            : "text-white/60"
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="mb-4 flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg bg-white px-4 py-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about sales, orders, inventory..."
                    className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:outline-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  AI responses are based on your restaurant data
                </p>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
