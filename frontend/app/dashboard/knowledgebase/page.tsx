"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LogOut,
  FileUp,
  MessageCircle,
  Blend,
  Book,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRoles } from "@/lib/useUserRoles";

export default function KnowledgeBaseList() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { isAdmin } = useUserRoles(token);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("ragster_token");
    document.cookie = "ragster_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  useEffect(() => {
    const stored = localStorage.getItem("ragster_token");
    if (!stored) {
      router.push("/");
    } else {
      setToken(stored);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/api/v1/knowledgebase/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [token]);

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
              <Blend className={clsx(sidebarOpen ? "w-6 h-6" : "w-5 h-5", "text-white")} />
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

        {/* Main actions */}
        <nav className="flex flex-col gap-2 mt-2 px-2">
          <Button
            variant="secondary"
            size="lg"
            className={clsx(
              "justify-start gap-3 w-full transition-all",
              !sidebarOpen && "justify-center"
            )}
            onClick={() => router.push("/dashboard")}
          >
            <MessageCircle className="w-5 h-5" />
            {sidebarOpen && "Chat"}
          </Button>
          {isAdmin && (
            <Button
              variant="secondary"
              size="lg"
              className={clsx(
                "justify-start gap-3 w-full transition-all",
                !sidebarOpen && "justify-center",
                "!bg-blue-200"
              )}
              onClick={() => router.push("/dashboard/knowledgebase")}
            >
              <Book className="w-5 h-5" />
              {sidebarOpen && "Knowledge Base"}
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            className={clsx(
              "justify-start gap-3 w-full transition-all",
              !sidebarOpen && "justify-center"
            )}
            onClick={() => router.push("/dashboard")}
          >
            <FileUp className="w-5 h-5" />
            {sidebarOpen && "Upload Document"}
          </Button>
        </nav>

        {/* Logout */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen bg-gradient-to-br from-white to-blue-50 transition-all">
        {/* Header */}
        <div className="flex items-center px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 flex-1">Knowledge Bases</h1>
          <Button size="sm" onClick={() => router.push("/dashboard/knowledgebase/create")}
            className="gap-1">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="min-w-full text-sm border border-gray-200 bg-white rounded-lg">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                  <th className="px-4 py-2 w-20 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((kb) => (
                  <tr key={kb.id} className="border-t">
                    <td className="px-4 py-2">{kb.name}</td>
                    <td className="px-4 py-2">{kb.description}</td>
                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
