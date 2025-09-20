// app/stats/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Pledge = {
  id: string;
  userId: string;
  username?: string;
  projectId: string;
  amount: number;
  rewardTierId?: string;
  rewardTierName?: string;
  time: string;
  status: "SUCCESS" | "REJECTED";
  rejectReason?: string;
};

type StatsResponse = {
  success: number;
  rejected: number;
  pledges: Pledge[];
};

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse>({
    success: 0,
    rejected: 0,
    pledges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: StatsResponse) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const successList = useMemo(
    () => stats.pledges.filter((p) => p.status === "SUCCESS"),
    [stats.pledges]
  );
  const rejectedList = useMemo(
    () => stats.pledges.filter((p) => p.status === "REJECTED"),
    [stats.pledges]
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="stack">
      <h2 className="page-title">Summary Stats</h2>

      {/* แสดงสรุปจำนวน */}
      <div className="grid">
        <div className="card">
          <div className="muted">Success</div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{stats.success}</div>
        </div>
        <div className="card">
          <div className="muted">Rejected</div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{stats.rejected}</div>
        </div>
      </div>

      {/* รายการ Success */}
      <div className="card">
        <div className="card-title">
          <span>Success Pledges</span>
          <span className="pill">{successList.length}</span>
        </div>

        {successList.length === 0 ? (
          <div className="muted" style={{ marginTop: 8 }}>
            Not Found
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>Time</th>
                  <th style={th}>Project</th>
                  <th style={th}>Amount (฿)</th>
                  <th style={th}>Reward Tier</th>
                  <th style={th}>Username</th>
                </tr>
              </thead>
              <tbody>
                {successList.map((p) => (
                  <tr key={p.id}>
                    <td style={td}>{formatTime(p.time)}</td>
                    <td style={td}>
                      <a
                        className="button secondary"
                        href={`/projects/${p.projectId}`}
                        style={{ padding: "4px 8px" }}
                      >
                        {p.projectId}
                      </a>
                    </td>
                    <td style={td}>{p.amount.toLocaleString()}</td>
                    <td style={td}>{p.rewardTierName || "-"}</td>
                    <td style={td}>{p.username || p.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* รายการ Rejected */}
      <div className="card">
        <div className="card-title">
          <span>Rejected Pledges</span>
          <span className="pill">{rejectedList.length}</span>
        </div>

        {rejectedList.length === 0 ? (
          <div className="muted" style={{ marginTop: 8 }}>
            Not Found
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>Time</th>
                  <th style={th}>Project</th>
                  <th style={th}>Amount (฿)</th>
                  <th style={th}>Reason</th>
                  <th style={th}>Reward Tier</th>
                  <th style={th}>Username</th>
                </tr>
              </thead>
              <tbody>
                {rejectedList.map((p) => (
                  <tr key={p.id}>
                    <td style={td}>{formatTime(p.time)}</td>
                    <td style={td}>
                      <a
                        className="button secondary"
                        href={`/projects/${p.projectId}`}
                        style={{ padding: "4px 8px" }}
                      >
                        {p.projectId}
                      </a>
                    </td>
                    <td style={td}>{p.amount.toLocaleString()}</td>
                    <td style={td}>{p.rejectReason || "-"}</td>
                    <td style={td}>{p.rewardTierName || "-"}</td>
                    <td style={td}>{p.username || p.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/** สไตล์สำหรับตาราง */
const th: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  padding: "8px 10px",
  borderBottom: "1px solid #e5e7eb",
};
const td: React.CSSProperties = {
  fontSize: 14,
  padding: "10px",
  borderBottom: "1px solid #f1f5f9",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
