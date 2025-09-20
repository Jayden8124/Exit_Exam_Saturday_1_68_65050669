"use client";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  name: string;
  category: string;
  goal: number;
  deadline: string;
  totalRaised: number;
  description: string;
};

export default function HomePage() {
  const [items, setItems] = useState<Project[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const params = new URLSearchParams({ q, category, sort });
    fetch(`/api/projects?${params.toString()}`)
      .then((r) => r.json())
      .then(setItems);
  }, [q, category, sort]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects"
          className="border p-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="newest">Newest</option>
          <option value="ending">Ending Soon</option>
          <option value="top">Top Raised</option>
        </select>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((p) => (
          <li key={p.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <span className="text-xs rounded bg-gray-100 px-2 py-1">
                {p.category}
              </span>
            </div>
            <p className="text-sm mt-1 line-clamp-2">{p.description}</p>
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{
                    width: `${Math.min(
                      100,
                      (p.totalRaised / p.goal) * 100
                    ).toFixed(1)}%`,
                  }}
                />
              </div>
              <div className="text-xs mt-1 flex justify-between">
                <span>
                  Raised ฿{p.totalRaised.toLocaleString()} / ฿
                  {p.goal.toLocaleString()}
                </span>
                <span>
                  Deadline {new Date(p.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <a
              href={`/projects/${p.id}`}
              className="mt-3 inline-block text-blue-600 underline"
            >
              View details
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
