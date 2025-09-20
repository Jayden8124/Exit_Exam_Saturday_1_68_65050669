// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { PledgeModel } from "@/lib/models/PledgeModel";
import { RewardTierModel } from "@/lib/models/RewardTierModel";
import { UserModel } from "@/lib/models/UserModel";

export async function GET() {
  const s = await PledgeModel.stats();
  const all = await PledgeModel.all();
  const tiers = await RewardTierModel.all();
  const users = await UserModel.all();

  // map สำหรับ lookup
  const tierNameMap: Record<string, string> = {};
  tiers.forEach((t) => {
    tierNameMap[t.id] = t.name;
  });

  const userNameMap: Record<string, string> = {};
  users.forEach((u) => {
    userNameMap[u.id] = u.username;
  });

  // enrich pledges
  const pledgesWithInfo = all.map((p) => ({
    ...p,
    rewardTierName: p.rewardTierId
      ? tierNameMap[p.rewardTierId] || p.rewardTierId
      : "",
    username: userNameMap[p.userId] || p.userId,
  }));

  return NextResponse.json({
    ...s,
    pledges: pledgesWithInfo,
  });
}
