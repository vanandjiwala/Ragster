import { useEffect, useState } from "react";

export function useUserRoles(token: string | null) {
  const [roles, setRoles] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/v1/user/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch roles");
        return res.json();
      })
      .then((data) => {
        setRoles(data);
        setIsAdmin(
          data.some(
            (role: any) =>
              role.role_name && role.role_name.toLowerCase() === "admin"
          )
        );
      })
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, [token]);

  return { roles, isAdmin, loading };
}
