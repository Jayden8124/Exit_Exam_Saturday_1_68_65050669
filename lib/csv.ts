import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function parseCSV(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      // naive split (no quoted commas). Good enough for the exam.
      return line.split(",").map((v) => v.trim());
    });
}

function toCSV(rows: (string | number | undefined | null)[][]): string {
  return rows
    .map((r) =>
      r.map((c) => (c ?? "").toString().replace(/\n/g, " ")).join(",")
    )
    .join("\n");
}

export async function readCSV<T>(
  file: string,
  headers: string[]
): Promise<T[]> {
  const filePath = path.join(DATA_DIR, file);
  const text = await fs.readFile(filePath, "utf8");
  const rows = parseCSV(text);
  const out: any[] = [];
  for (const row of rows.slice(1)) {
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = row[i]));
    out.push(obj);
  }
  return out as T[];
}

export async function writeCSV(
  file: string,
  headers: string[],
  records: any[]
) {
  const rows: (string | number)[][] = [headers];
  for (const rec of records) {
    rows.push(headers.map((h) => (rec[h] ?? "").toString()));
  }
  const csv = toCSV(rows);
  const filePath = path.join(DATA_DIR, file);
  await fs.writeFile(filePath, csv, "utf8");
}
