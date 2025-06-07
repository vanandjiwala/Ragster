"use client";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  FileUp,
  MessageCircle,
  Blend,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

// Placeholder chat threads data
const THREADS = [
  { id: 1, title: "Quarterly Report Q1" },
  { id: 2, title: "HR Policy Questions" },
  { id: 3, title: "Marketing Plan Ideas" },
  { id: 4, title: "Data Compliance Chat" },
  { id: 5, title: "Finance - Budget Review" },
];

// Placeholder chat messages
const MESSAGES = [
  { id: 1, user: "You", content: "Hello, Ragster!", self: true },
  {
    id: 2,
    user: "Ragster",
    content: "Hi! How can I assist you today?",
    self: false,
  },
  { id: 3, user: "You", content: "Summarize the Q1 report.", self: true },
  {
    id: 4,
    user: "Ragster",
    content:
      "Sure! Q1 saw a 15% growth in revenue with significant improvements in the pharma division...",
    self: false,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [canUpload, setCanUpload] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<"chat" | "upload">("chat");

  const handleLogout = () => {
    localStorage.removeItem("ragster_token");
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("ragster_token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-blue-50 to-purple-100">
      {/* Sidebar */}
      <aside
        className={clsx(
          "h-screen sticky top-0 flex flex-col border-r border-gray-200 bg-white/80 shadow-xl transition-all duration-200 ease-in-out",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Expand/collapse button */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center",
                sidebarOpen ? "w-10 h-10" : "w-8 h-8"
              )}
            >
              <Blend
                className={clsx(
                  sidebarOpen ? "w-6 h-6" : "w-5 h-5",
                  "text-white"
                )}
              />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900 tracking-tight transition-all">
                Ragster
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-2"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        {/* Part 1: Main actions */}
        <nav className="flex flex-col gap-2 mt-2 px-2">
          <Button
            variant="secondary"
            size="lg"
            className={clsx(
              "justify-start gap-3 w-full transition-all",
              !sidebarOpen && "justify-center"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            {sidebarOpen && "Chat"}
          </Button>
          {canUpload && (
            <Button
              variant="secondary"
              size="lg"
              className={clsx(
                "justify-start gap-3 w-full transition-all",
                !sidebarOpen && "justify-center"
              )}
            >
              <FileUp className="w-5 h-5" />
              {sidebarOpen && "Upload Document"}
            </Button>
          )}
        </nav>

        {/* Part 2: Top X chat threads */}
        <div className="flex-1 overflow-y-auto mt-6 px-2">
          <div
            className={clsx(
              "text-xs font-semibold text-gray-400 uppercase mb-2",
              !sidebarOpen && "hidden"
            )}
          >
            Recent Chats
          </div>
          <ul className="space-y-1">
            {THREADS.slice(0, 5).map((thread) => (
              <li key={thread.id}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={clsx(
                    "w-full justify-start gap-2 px-2",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                  {sidebarOpen && (
                    <span className="truncate">{thread.title}</span>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Part 3: Logout button at the bottom */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <Button
            variant="destructive"
            size="lg"
            className={clsx("w-full gap-3", !sidebarOpen && "justify-center")}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Log Out"}
          </Button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col h-screen bg-gradient-to-br from-white to-blue-50 transition-all">
        {/* Header */}
        <div className="flex items-center px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            Chat with Ragster
          </h1>
        </div>
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-0 sm:px-8 py-8 flex flex-col gap-6">
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
            {MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "flex",
                  msg.self ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "rounded-xl px-5 py-3 max-w-[85%] shadow-sm text-base",
                    msg.self
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat input placeholder */}
        <div className="w-full max-w-2xl mx-auto px-4 py-6 flex gap-3">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-base shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            disabled
          />
          <Button disabled>Send</Button>
        </div>
      </main>
    </div>
  );
}
