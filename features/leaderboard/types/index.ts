export interface LeaderboardUser {
  rank: number;
  username: string;
  handle: string;
  avatar: string;
  pixels: number;
  volume: number; // in SOL
  area: number; // percentage
  change?: "up" | "down" | "same";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: "purple" | "emerald" | "blue" | "orange";
  unlocked: boolean;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target?: string;
  time: string;
  color: "emerald" | "purple" | "zinc";
}
