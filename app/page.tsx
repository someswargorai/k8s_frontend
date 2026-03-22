"use client";
import { useState, useEffect } from "react";

type User = {
  _id: string;
  name: string;
};

export default function Home() {
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const createUser = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      const data: User = await res.json();
      setUser(data);
      setName("");
    } catch (err) {
      setError("Failed to create user. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    setFetchingUsers(true);
    setError(null);
    try {
      console.log(process.env.NEXT_PUBLIC_BASE_URL);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users. Is the backend running?");
      console.error(err);
    } finally {
      setFetchingUsers(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white relative overflow-x-hidden 
    ">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blob */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-lime-400/5 blur-3xl pointer-events-none z-0" />

      <div
        className={`relative z-10 flex flex-col items-center px-4 py-16 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="w-full max-w-[520px] flex flex-col gap-4">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-lime-400">
                k8s_backend · live
              </span>
            </div>
            <h1 className="font-black text-5xl tracking-tighter leading-none">
              User{" "}
              <span className="text-lime-400">Registry</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-500 font-mono">
              MongoDB + Redis + Prometheus
            </p>
          </div>

          {/* Create user card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
            <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-600 mb-4">
              create user
            </p>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createUser()}
                placeholder="enter name..."
                autoComplete="off"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-600 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/10 transition-all"
              />
              <button
                onClick={createUser}
                disabled={loading || !name.trim()}
                className="bg-lime-400 text-black font-bold text-sm rounded-xl px-5 py-3 hover:bg-lime-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime-400/20 active:translate-y-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Add →</>
                )}
              </button>
            </div>

            <button
              onClick={getUsers}
              disabled={fetchingUsers}
              className="mt-3 w-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-semibold text-sm rounded-xl px-5 py-3 hover:border-zinc-600 hover:text-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {fetchingUsers ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                  Fetching...
                </>
              ) : (
                "Load All Users"
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 font-mono">
              <span className="text-base">⚠</span>
              {error}
            </div>
          )}

          {/* Created user */}
          {user && (
            <div className="bg-lime-400/5 border border-lime-400/15 rounded-2xl px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lime-400 text-sm">✓</span>
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-lime-400 font-semibold">
                  User Created
                </span>
              </div>
              <div className="flex flex-col gap-0">
                <div className="flex justify-between items-center py-2.5 border-b border-lime-400/8">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Name</span>
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">ID</span>
                  <span className="text-[11px] font-mono text-zinc-400">{user._id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Users list */}
          {users.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 ">
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-sm text-white">All Users</span>
                <span className="bg-lime-400/10 text-lime-400 border border-lime-400/20 rounded-full px-3 py-0.5 text-[11px] font-mono">
                  {users.length}
                </span>
              </div>
              <div className="flex flex-col">
                {users.map((u, i) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-none [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-zinc-800
  [&::-webkit-scrollbar-thumb]:bg-zinc-600
  [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/15 flex items-center justify-center text-lime-400 font-bold text-sm flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                      <p className="text-[10px] font-mono text-zinc-600 truncate mt-0.5">{u._id}</p>
                    </div>
                    {/* Index */}
                    <span className="text-[10px] font-mono text-zinc-700 flex-shrink-0">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}