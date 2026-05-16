"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const SECRET_KEY = "formatit:admin:secret:v1";

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(31);
  const [subscribers, setSubscribers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SECRET_KEY) || "";
      if (stored) {
        setSecret(stored);
        setAuthed(true);
      }
    } catch {}
  }, []);

  const fetchList = useCallback(
    async (token) => {
      const t = token ?? secret;
      if (!t) return;
      setStatus("loading");
      try {
        const res = await fetch("/api/admin/pro", {
          headers: { Authorization: `Bearer ${t}` },
          cache: "no-store",
        });
        if (res.status === 401) {
          setAuthed(false);
          setMessage({ kind: "error", text: "Invalid secret." });
          try {
            sessionStorage.removeItem(SECRET_KEY);
          } catch {}
          return;
        }
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setAuthed(true);
        try {
          sessionStorage.setItem(SECRET_KEY, t);
        } catch {}
      } catch (err) {
        setMessage({ kind: "error", text: err.message });
      } finally {
        setStatus("idle");
      }
    },
    [secret],
  );

  useEffect(() => {
    if (authed) fetchList();
  }, [authed, fetchList]);

  const submitAction = async (action) => {
    if (!email.trim()) {
      setMessage({ kind: "error", text: "Email required." });
      return;
    }
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/pro", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          email: email.trim(),
          days: Number(days) || 31,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ kind: "error", text: data.error || "Failed" });
      } else {
        setMessage({
          kind: "success",
          text:
            action === "grant"
              ? `Granted Pro to ${data.email} until ${formatDate(data.expiresAt)}`
              : `Revoked Pro from ${data.email}`,
        });
        setEmail("");
        await fetchList();
      }
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
    } finally {
      setStatus("idle");
    }
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-sm rounded-3 border border-rule bg-paper p-8 shadow-2">
          <h1 className="mb-1 text-[20px] font-semibold tracking-[-0.02em] text-ink">
            Admin
          </h1>
          <p className="mb-5 text-[12.5px] text-ink-2">
            Enter the admin secret to manage Pro subscribers.
          </p>
          <div className="space-y-2">
            <Label htmlFor="admin-secret">Admin secret</Label>
            <Input
              id="admin-secret"
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </div>
          {message?.kind === "error" && (
            <p className="mt-3 text-[12px] text-danger">{message.text}</p>
          )}
          <div className="mt-5 flex justify-end">
            <Button
              variant="primary"
              onClick={() => fetchList(secret)}
              disabled={!secret || status === "loading"}
            >
              {status === "loading" ? "Checking…" : "Sign in"}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
              Pro admin
            </h1>
            <p className="text-[12.5px] text-ink-2">
              Activate or revoke Pro access manually after dLocal Go payment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.removeItem(SECRET_KEY);
              } catch {}
              setSecret("");
              setAuthed(false);
            }}
            className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-3 hover:text-ink"
          >
            Sign out
          </button>
        </header>

        <section className="rounded-3 border border-rule bg-paper p-6 shadow-1">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">
            Activate / revoke
          </h2>
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <Label htmlFor="grant-email">Customer email</Label>
              <Input
                id="grant-email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-days">Days</Label>
              <Input
                id="grant-days"
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
          </div>
          {message && (
            <p
              className={`mt-3 text-[12.5px] ${
                message.kind === "error" ? "text-danger" : "text-success"
              }`}
            >
              {message.text}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="danger"
              onClick={() => submitAction("revoke")}
              disabled={status === "loading"}
            >
              Revoke
            </Button>
            <Button
              variant="primary"
              onClick={() => submitAction("grant")}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Working…" : "Grant Pro"}
            </Button>
          </div>
        </section>

        <section className="rounded-3 border border-rule bg-paper p-6 shadow-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">
              Active subscribers ({subscribers.length})
            </h2>
            <Button variant="ghost" onClick={() => fetchList()}>
              Refresh
            </Button>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-[12.5px] text-ink-3">No active subscribers.</p>
          ) : (
            <ul className="divide-y divide-rule">
              {subscribers.map((s) => (
                <li
                  key={s.email}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-[13px] text-ink">{s.email}</span>
                  <span className="font-mono text-[11px] text-ink-3">
                    expires {formatDate(s.expiresAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
