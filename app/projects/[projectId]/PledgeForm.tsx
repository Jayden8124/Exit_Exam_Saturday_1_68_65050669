"use client";

import { useState } from "react";

type Tier = {
  id: string;
  name: string;
  minAmount: number;
  quota: number;
  projectId: string;
};

export default function PledgeForm({
  projectId,
  tiers,
}: {
  projectId: string;
  tiers: Tier[];
}) {
  const [rewardTierId, setRewardTierId] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [msg, setMsg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(undefined);
    setLoading(true);
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          amount: Number(amount),
          rewardTierId: rewardTierId || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("Pledge success!");
        location.reload();
      } else {
        setMsg("Rejected: " + (data.reason || data.error || "UNKNOWN"));
      }
    } catch (e: any) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <label className="muted" style={{ fontWeight: 600 }}>
        Choose reward (optional)
      </label>
      <select
        value={rewardTierId}
        onChange={(e) => setRewardTierId(e.target.value)}
        className="select"
      >
        <option value="">No reward</option>
        {tiers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} — min ฿{t.minAmount} — quota {t.quota}
          </option>
        ))}
      </select>

      <label className="muted" style={{ fontWeight: 600 }}>
        Amount
      </label>
      <input
        type="number"
        className="input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="e.g. 500"
        min={0}
      />

      <button onClick={submit} className="button" disabled={loading}>
        {loading ? "Processing…" : "Pledge"}
      </button>

      {msg && <div className="muted">{msg}</div>}
    </>
  );
}
