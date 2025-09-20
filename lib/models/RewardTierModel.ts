import { readCSV, writeCSV } from "../csv";
import { RewardTier } from "../types";

const FILE = "reward_tiers.csv";
const HEADERS = ["id", "projectId", "name", "minAmount", "quota"];

export const RewardTierModel = {
  async all(): Promise<RewardTier[]> {
    const rows = await readCSV<any>(FILE, HEADERS);
    return rows.map((r) => ({
      id: r.id,
      projectId: r.projectId,
      name: r.name,
      minAmount: Number(r.minAmount),
      quota: Number(r.quota),
    }));
  },
  async byProject(projectId: string) {
    const all = await this.all();
    return all.filter((t) => t.projectId === projectId);
  },
  async saveAll(records: RewardTier[]) {
    await writeCSV(FILE, HEADERS, records);
  },
  async decQuota(tierId: string) {
    const all = await this.all();
    const idx = all.findIndex((t) => t.id === tierId);
    if (idx === -1) return false;
    if (all[idx].quota <= 0) return false;
    all[idx].quota -= 1;
    await this.saveAll(all);
    return true;
  },
};
