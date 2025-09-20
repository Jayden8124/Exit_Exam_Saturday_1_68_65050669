import { readCSV, writeCSV } from "../csv";
import { Project } from "../types";

const FILE = "projects.csv";
const HEADERS = [
  "id",
  "name",
  "category",
  "goal",
  "deadline",
  "totalRaised",
  "description",
];

export const ProjectModel = {
  async all(): Promise<Project[]> {
    const rows = await readCSV<any>(FILE, HEADERS);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      goal: Number(r.goal),
      deadline: r.deadline,
      totalRaised: Number(r.totalRaised),
      description: r.description,
    }));
  },
  async find(id: string) {
    const all = await this.all();
    return all.find((p) => p.id === id) || null;
  },
  async saveAll(records: Project[]) {
    await writeCSV(FILE, HEADERS, records);
  },
  async updateTotals(projectId: string, delta: number) {
    const all = await this.all();
    const idx = all.findIndex((p) => p.id === projectId);
    if (idx === -1) return false;
    all[idx].totalRaised = Math.max(0, all[idx].totalRaised + delta);
    await this.saveAll(all);
    return true;
  },
};
