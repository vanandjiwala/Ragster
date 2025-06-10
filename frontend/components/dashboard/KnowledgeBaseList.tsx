"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Props {
  token: string | null;
}

export default function KnowledgeBaseList({ token }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editKb, setEditKb] = useState<any | null>(null);
  const [deleteKb, setDeleteKb] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!successMsg && !errorMsg) return;
    const t = setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
    return () => clearTimeout(t);
  }, [successMsg, errorMsg]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:8000/api/v1/knowledgebase/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  const openCreate = () => {
    setEditKb(null);
    setName("");
    setDescription("");
    setFormOpen(true);
  };

  const openEdit = (kb: any) => {
    setEditKb(kb);
    setName(kb.name);
    setDescription(kb.description ?? "");
    setFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const url = editKb
      ? `http://localhost:8000/api/v1/knowledgebase/${editKb.id}`
      : "http://localhost:8000/api/v1/knowledgebase/";
    const method = editKb ? "PUT" : "POST";
    const body = editKb ? { name, description } : { name, description };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSuccessMsg(
        editKb ? "Knowledge base updated successfully." : "Knowledge base created successfully."
      );
      setErrorMsg(null);
      setFormOpen(false);
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err.detail || "Operation failed");
      setSuccessMsg(null);
    }
  };

  const confirmDelete = (kb: any) => {
    setDeleteKb(kb);
  };

  const handleDelete = async () => {
    if (!token || !deleteKb) return;
    const res = await fetch(
      `http://localhost:8000/api/v1/knowledgebase/${deleteKb.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setSuccessMsg("Knowledge base deleted successfully.");
      setErrorMsg(null);
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err.detail || "Delete failed");
      setSuccessMsg(null);
    }
    setDeleteKb(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}
          {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
        </div>
        <Button size="sm" className="gap-1" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
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
                  <Button variant="ghost" size="icon" onClick={() => openEdit(kb)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(kb)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editKb ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteKb} onClose={() => setDeleteKb(null)}>
        <div className="p-4 space-y-4">
          <p>Are you sure you want to delete this knowledge base?</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteKb(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
