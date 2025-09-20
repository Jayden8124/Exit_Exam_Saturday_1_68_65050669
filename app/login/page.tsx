// app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | undefined>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(undefined);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // ⭐ ถ้า login สำเร็จ ให้ redirect ไปหน้า Home
        window.location.href = "/";
      } else {
        setMsg("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong, please try again.");
    }
  }

  return (
    <div className="stack" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2 className="page-title">Login</h2>

      <form onSubmit={submit} className="stack">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>

      {msg && (
        <div className="muted" style={{ marginTop: 8 }}>
          {msg}
        </div>
      )}
    </div>
  );
}
