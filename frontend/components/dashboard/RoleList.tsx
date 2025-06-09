"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  token: string | null;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string | null;
}

export default function RoleList({ token }: Props) {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:8000/api/v1/role/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleEdit = async (role: Role) => {
    if (!token) return;
    const display_name = prompt("Display Name", role.display_name);
    if (display_name === null) return;
    const description = prompt("Description", role.description ?? "") ?? "";
    await fetch(`http://localhost:8000/api/v1/role/${role.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ display_name, description }),
    });
    fetchData();
  };

  const handleDelete = async (role: Role) => {
    if (!token) return;
    if (!confirm("Delete this role?")) return;
    await fetch(`http://localhost:8000/api/v1/role/${role.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm border border-gray-200 bg-white rounded-lg">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Display Name</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
              <th className="px-4 py-2 w-20 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((role) => (
              <tr key={role.id} className="border-t">
                <td className="px-4 py-2">{role.name}</td>
                <td className="px-4 py-2">{role.display_name}</td>
                <td className="px-4 py-2">{role.description}</td>
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(role)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(role)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
