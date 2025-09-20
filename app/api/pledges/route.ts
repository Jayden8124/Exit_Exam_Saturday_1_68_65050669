import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PledgeModel } from "@/lib/models/PledgeModel";

export async function POST(req: Request) {
  const body = await req.json();
  const { projectId, amount, rewardTierId } = body;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId)
    return NextResponse.json(
      { ok: false, error: "NOT_AUTHENTICATED" },
      { status: 401 }
    );

  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return NextResponse.json(
      { ok: false, error: "INVALID_AMOUNT" },
      { status: 400 }
    );
  }

  const result = await PledgeModel.create(userId, projectId, amt, rewardTierId);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
