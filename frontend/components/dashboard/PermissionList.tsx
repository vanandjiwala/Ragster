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

interface Permission {
  id: number;
  code: string;
  display_name: string;
  description?: string | null;
}

export default function PermissionList({ token }: Props) {
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editPerm, setEditPerm] = useState<Permission | null>(null);
  const [deletePerm, setDeletePerm] = useState<Permission | null>(null);
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
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

  const fetchData = () => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:8000/api/v1/permission/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const openCreate = () => {
    setEditPerm(null);
    setCode("");
    setDisplayName("");
    setDescription("");
    setFormOpen(true);
  };

  const openEdit = (perm: Permission) => {
    setEditPerm(perm);
    setDisplayName(perm.display_name);
    setDescription(perm.description ?? "");
    setFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const url = editPerm
      ? `http://localhost:8000/api/v1/permission/${editPerm.id}`
      : "http://localhost:8000/api/v1/permission/";
    const method = editPerm ? "PUT" : "POST";
    const body = editPerm
      ? { display_name: displayName, description }
      : { code, display_name: displayName, description };

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
        editPerm ? "Permission updated successfully." : "Permission created successfully."
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

  const confirmDelete = (perm: Permission) => {
    setDeletePerm(perm);
  };

  const handleDelete = async () => {
    if (!token || !deletePerm) return;
    const res = await fetch(
      `http://localhost:8000/api/v1/permission/${deletePerm.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setSuccessMsg("Permission deleted successfully.");
      setErrorMsg(null);
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err.detail || "Delete failed");
      setSuccessMsg(null);
    }
    setDeletePerm(null);
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
              <th className="px-4 py-2 text-left font-semibold">Code</th>
              <th className="px-4 py-2 text-left font-semibold">Display Name</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
              <th className="px-4 py-2 w-20 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((perm) => (
              <tr key={perm.id} className="border-t">
                <td className="px-4 py-2">{perm.code}</td>
                <td className="px-4 py-2">{perm.display_name}</td>
                <td className="px-4 py-2">{perm.description}</td>
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(perm)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(perm)}>
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
          {!editPerm && (
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="display">Display Name</Label>
            <Input id="display" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editPerm ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deletePerm} onClose={() => setDeletePerm(null)}>
        <div className="p-4 space-y-4">
          <p>Are you sure you want to delete this permission?</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeletePerm(null)}>
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

