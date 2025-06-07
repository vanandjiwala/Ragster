import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns: {token, error}
  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
          grant_type: "password",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail?.[0]?.msg || "Login failed");
        setLoading(false);
        return { token: null, error: data.detail?.[0]?.msg || "Login failed" };
      }
      const data = await res.json();
      setLoading(false);
      return { token: data.access_token, error: null };
    } catch (e) {
      setError("Network error");
      setLoading(false);
      return { token: null, error: "Network error" };
    }
  };

  return { login, loading, error, setError };
}
