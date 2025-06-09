"use client";
import { useEffect, useState } from "react";

export default function KnowledgeBaseList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ragster_token");
    fetch("http://localhost:8000/api/v1/knowledgebase/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Knowledge Bases</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {data.map((kb: any) => (
            <li key={kb.id} className="border p-4 rounded shadow">
              <div className="font-semibold">{kb.name}</div>
              <div className="text-gray-600 text-sm">{kb.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
