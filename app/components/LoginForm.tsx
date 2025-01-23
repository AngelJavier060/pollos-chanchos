"use client";

import { useState } from "react";

export default function LoginForm({ onSubmit }: { onSubmit: (username: string, password: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
        Ingresar
      </button>
    </form>
  );
}
