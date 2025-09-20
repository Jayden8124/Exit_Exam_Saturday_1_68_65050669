export type Project = {
  id: string; // 8-digit, first digit != '0'
  name: string;
  category: string; // e.g., Education, Health, Tech
  goal: number; // > 0
  deadline: string; // ISO date
  totalRaised: number; // current sum
  description: string;
};

export type RewardTier = {
  id: string;
  projectId: string;
  name: string;
  minAmount: number;
  quota: number; // remaining
};

export type Pledge = {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  rewardTierId?: string;
  time: string; // ISO datetime
  status: "SUCCESS" | "REJECTED";
  rejectReason?: string;
};

export type User = {
  id: string;
  username: string;
  password: string; // plain for demo only
};
