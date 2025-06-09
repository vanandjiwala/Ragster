"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoleCreatePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("ragster_token");
    if (!stored) {
      router.push("/");
    } else {
      setToken(stored);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await fetch("http://localhost:8000/api/v1/role/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        display_name: displayName,
        description,
      }),
    });
    router.push("/dashboard/roles");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Role</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
