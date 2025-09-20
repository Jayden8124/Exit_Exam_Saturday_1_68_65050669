import { ProjectModel } from "@/lib/models/ProjectModel";
import { RewardTierModel } from "@/lib/models/RewardTierModel";
import PledgeForm from "./PledgeForm";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const project = await ProjectModel.find(projectId);
  const tiers = await RewardTierModel.byProject(projectId);

  if (!project) {
    return (
      <div className="stack">
        <h2 className="page-title">Project not found</h2>
        <a className="button" href="/">
          Back to Home
        </a>
      </div>
    );
  }

  const progress = Math.min(100, (project.totalRaised / project.goal) * 100);

  return (
    <div className="stack">
      <h2 className="page-title">{project.name}</h2>
      <p className="muted">{project.description}</p>

      <div className="progress">
        <div className="bar" style={{ width: `${progress.toFixed(1)}%` }} />
      </div>
      <div className="meta">
        <span>
          Raised ฿{project.totalRaised.toLocaleString()} / ฿
          {project.goal.toLocaleString()}
        </span>
        <span>Deadline {new Date(project.deadline).toLocaleDateString()}</span>
      </div>

      {/* รายการ Reward บนหน้า (อ่านอย่างเดียว) */}
      {tiers.length > 0 && (
        <div className="card">
          <div className="card-title">
            <span>Rewards</span>
            <span className="pill">{tiers.length} tiers</span>
          </div>
          <ul className="stack" style={{ marginTop: 8 }}>
            {tiers.map((t) => (
              <li
                key={t.id}
                className="row"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div className="muted">
                    Min ฿{t.minAmount.toLocaleString()}
                  </div>
                </div>
                <div className="pill">Quota {t.quota}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ฟอร์มกด Pledge (Client Component แยก) */}
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <PledgeForm projectId={project.id} tiers={tiers} />
      </div>
    </div>
  );
}
