import { NextResponse } from "next/server";
import { ProjectModel } from "@/lib/models/ProjectModel";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest"; // newest | ending | top

  let items = await ProjectModel.all();
  if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
  if (category) items = items.filter((p) => p.category === category);

  if (sort === "newest") {
    items.sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    );
  } else if (sort === "ending") {
    items.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  } else if (sort === "top") {
    items.sort((a, b) => b.totalRaised - a.totalRaised);
  }

  return NextResponse.json(items);
}
