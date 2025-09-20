import { readCSV, writeCSV } from "../csv";
import { Pledge } from "../types";
import { ProjectModel } from "./ProjectModel";
import { RewardTierModel } from "./RewardTierModel";

const FILE = "pledges.csv";
const HEADERS = [
  "id",
  "userId",
  "projectId",
  "amount",
  "rewardTierId",
  "time",
  "status",
  "rejectReason",
];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export const PledgeModel = {
  async all(): Promise<Pledge[]> {
    const rows = await readCSV<any>(FILE, HEADERS);
    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      projectId: r.projectId,
      amount: Number(r.amount),
      rewardTierId: r.rewardTierId || undefined,
      time: r.time,
      status: r.status as "SUCCESS" | "REJECTED",
      rejectReason: r.rejectReason || undefined,
    }));
  },
  async saveAll(records: Pledge[]) {
    await writeCSV(FILE, HEADERS, records);
  },

  async create(
    userId: string,
    projectId: string,
    amount: number,
    rewardTierId?: string
  ) {
    const pledges = await this.all();
    const project = await ProjectModel.find(projectId);
    if (!project) {
      const rec: Pledge = {
        id: newId(),
        userId,
        projectId,
        amount,
        rewardTierId,
        time: new Date().toISOString(),
        status: "REJECTED",
        rejectReason: "PROJECT_NOT_FOUND",
      };
      pledges.push(rec);
      await this.saveAll(pledges);
      return { ok: false, rec, reason: rec.rejectReason };
    }

    // Business rules
    const now = new Date();
    const deadlineOk = new Date(project.deadline) > now;
    if (!deadlineOk) {
      const rec: Pledge = {
        id: newId(),
        userId,
        projectId,
        amount,
        rewardTierId,
        time: now.toISOString(),
        status: "REJECTED",
        rejectReason: "DEADLINE_PASSED",
      };
      pledges.push(rec);
      await this.saveAll(pledges);
      return { ok: false, rec, reason: rec.rejectReason };
    }

    if (rewardTierId) {
      const tiers = await RewardTierModel.all();
      const tier = tiers.find(
        (t) => t.id === rewardTierId && t.projectId === projectId
      );
      if (!tier) {
        const rec: Pledge = {
          id: newId(),
          userId,
          projectId,
          amount,
          rewardTierId,
          time: now.toISOString(),
          status: "REJECTED",
          rejectReason: "TIER_NOT_FOUND",
        };
        pledges.push(rec);
        await this.saveAll(pledges);
        return { ok: false, rec, reason: rec.rejectReason };
      }
      if (tier.quota <= 0) {
        const rec: Pledge = {
          id: newId(),
          userId,
          projectId,
          amount,
          rewardTierId,
          time: now.toISOString(),
          status: "REJECTED",
          rejectReason: "TIER_OUT_OF_STOCK",
        };
        pledges.push(rec);
        await this.saveAll(pledges);
        return { ok: false, rec, reason: rec.rejectReason };
      }
      if (amount < tier.minAmount) {
        const rec: Pledge = {
          id: newId(),
          userId,
          projectId,
          amount,
          rewardTierId,
          time: now.toISOString(),
          status: "REJECTED",
          rejectReason: "BELOW_MIN_AMOUNT",
        };
        pledges.push(rec);
        await this.saveAll(pledges);
        return { ok: false, rec, reason: rec.rejectReason };
      }
    }

    // Success path
    const rec: Pledge = {
      id: newId(),
      userId,
      projectId,
      amount,
      rewardTierId,
      time: new Date().toISOString(),
      status: "SUCCESS",
    };
    pledges.push(rec);
    await this.saveAll(pledges);
    await ProjectModel.updateTotals(projectId, amount);
    if (rewardTierId) await RewardTierModel.decQuota(rewardTierId);

    return { ok: true, rec };
  },

  async stats() {
    const pledges = await this.all();
    const success = pledges.filter((p) => p.status === "SUCCESS").length;
    const rejected = pledges.filter((p) => p.status === "REJECTED").length;
    return { success, rejected };
  },
};
