"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Pencil, Trash2, Plus, Key, X } from "lucide-react";

interface Props {
  token: string | null;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string | null;
}

interface Permission {
  id: number;
  code: string;
  display_name: string;
  description?: string | null;
}

export default function RoleList({ token }: Props) {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Record<number, Permission[]>>({});
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [permRole, setPermRole] = useState<Role | null>(null);
  const [availablePerms, setAvailablePerms] = useState<Permission[]>([]);
  const [selectedPermIds, setSelectedPermIds] = useState<number[]>([]);
  const [existingPermIds, setExistingPermIds] = useState<number[]>([]);

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
    fetch("http://localhost:8000/api/v1/role/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((roles: Role[]) => {
        setData(roles);
        roles.forEach((r) => fetchRolePermissions(r.id));
      })
      .finally(() => setLoading(false));
  };

  const fetchRolePermissions = (roleId: number) => {
    if (!token) return;
    fetch(`http://localhost:8000/api/v1/role-permission/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((perms: Permission[]) =>
        setRolePermissions((prev) => ({ ...prev, [roleId]: perms }))
      );
  };

  const openPermissions = (role: Role) => {
    if (!token) return;
    setPermRole(role);
    Promise.all([
      fetch("http://localhost:8000/api/v1/permission/", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`http://localhost:8000/api/v1/role-permission/${role.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ]).then(([all, existing]: [Permission[], Permission[]]) => {
      setAvailablePerms(all);
      const ids = existing.map((p) => p.id);
      setExistingPermIds(ids);
      setSelectedPermIds(ids);
      setPermModalOpen(true);
      setRolePermissions((prev) => ({ ...prev, [role.id]: existing }));
    });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const openCreate = () => {
    setEditRole(null);
    setName("");
    setDisplayName("");
    setDescription("");
    setFormOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditRole(role);
    setName(role.name);
    setDisplayName(role.display_name);
    setDescription(role.description ?? "");
    setFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const url = editRole
      ? `http://localhost:8000/api/v1/role/${editRole.id}`
      : "http://localhost:8000/api/v1/role/";
    const method = editRole ? "PUT" : "POST";
    const body = editRole
      ? { display_name: displayName, description }
      : { name, display_name: displayName, description };

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
        editRole ? "Role updated successfully." : "Role created successfully."
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

  const confirmDelete = (role: Role) => {
    setDeleteRole(role);
  };

  const handleDelete = async () => {
    if (!token || !deleteRole) return;
    const res = await fetch(
      `http://localhost:8000/api/v1/role/${deleteRole.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setSuccessMsg("Role deleted successfully.");
      setErrorMsg(null);
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err.detail || "Delete failed");
      setSuccessMsg(null);
    }
    setDeleteRole(null);
  };

  const togglePerm = (id: number) => {
    setSelectedPermIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handlePermSave = async () => {
    if (!token || !permRole) return;
    const payloadIds = Array.from(new Set([...selectedPermIds, ...existingPermIds]));
    const res = await fetch("http://localhost:8000/api/v1/role-permission/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role_id: permRole.id, permission_ids: payloadIds }),
    });
    if (res.ok) {
      setSuccessMsg("Permissions updated.");
      setErrorMsg(null);
      fetchRolePermissions(permRole.id);
      setPermModalOpen(false);
    } else {
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err.detail || "Operation failed");
      setSuccessMsg(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          {successMsg && (
            <div className="text-green-600 text-sm">{successMsg}</div>
          )}
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
              <th className="px-4 py-2 text-left font-semibold">Display Name</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
              <th className="px-4 py-2 text-left font-semibold">Permissions</th>
              <th className="px-4 py-2 w-20 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((role) => (
              <tr key={role.id} className="border-t">
                <td className="px-4 py-2">{role.name}</td>
                <td className="px-4 py-2">{role.display_name}</td>
                <td className="px-4 py-2">{role.description}</td>
                <td className="px-4 py-2">
                  {rolePermissions[role.id]?.map((p) => p.display_name).join(", ")}
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(role)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(role)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openPermissions(role)}
                  >
                    <Key className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
          {!editRole && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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
            <Button type="submit">{editRole ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={permModalOpen} onClose={() => setPermModalOpen(false)}>
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Assign Permissions</h2>
          <div className="flex flex-wrap gap-2">
            {selectedPermIds.map((id) => {
              const perm = availablePerms.find((p) => p.id === id)
              if (!perm) return null
              return (
                <span
                  key={id}
                  className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-sm flex items-center gap-1"
                >
                  {perm.display_name}
                  <button
                    type="button"
                    className="hover:text-red-600"
                    onClick={() => togglePerm(id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {availablePerms.map((perm) => (
              <label key={perm.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPermIds.includes(perm.id)}
                  onChange={() => togglePerm(perm.id)}
                />
                {perm.display_name}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setPermModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePermSave}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteRole} onClose={() => setDeleteRole(null)}>
        <div className="p-4 space-y-4">
          <p>Are you sure you want to delete this role?</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteRole(null)}>
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
