export type ActivityStatus = 'idle' | 'active' | 'ready' | 'locked' | 'resting';
export type ActivityType = 'wood' | 'food' | 'coins' | 'energy' | 'special';

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  type: ActivityType;
  status: ActivityStatus;
  durationSeconds: number;
  startedAt: number | null;
  endsAt: number | null;
  restDurationSeconds: number;
  restEndsAt: number | null;
  reward: Partial<Resources>;
  xpReward: number;
  unlockLevel: number;
  level: number;
  upgradeCost: Partial<Resources>;
  collectionCount: number;
}

export interface Resources {
  coins: number;
  wood: number;
  food: number;
  gems: number;
}

export interface Badge {
  id: string;
  name: string;
  progress: number;
  type: 'locked' | 'in-progress' | 'earned';
  unlockLevel: number;
  linkedActivityIds: string[];
  passiveEffect: string;
  description: string;
}

export interface Mission {
  id: string;
  title: string;
  icon: string;
  type: 'daily' | 'trail' | 'badge';
  reward: Partial<Resources> & { campXP?: number };
  current: number;
  target: number;
  status: 'locked' | 'go' | 'claim' | 'done';
  linkedActivityId?: string;
  expiresAt?: null | number;
}

export interface Scout {
  id: string;
  name: string;
  role: string;
  level: number;
  xp: number;
  xpToNext: number;
  energy: number;
  maxEnergy: number;
  emoji: string;
  assignedTo: string[];
  ability: string;
  preferredActivities: ActivityType[];
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
}

export interface UpgradeCondition {
  coins?: number;
  wood?: number;
  food?: number;
  campXP?: number;
  badges?: string[]; // IDs of earned badges
  missions?: string[]; // IDs of completed missions
  scoutsLvl2?: number; // count of scouts at least level 2
}

export interface CampUpgrade {
  level: number;
  requirements: UpgradeCondition;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'permanent' | 'consumable';
  price: number;
  prevPrice?: number;
  emoji: string;
  color: string;
  desc: string;
  locked: boolean;
}

export interface GameState {
  resources: Resources;
  campLvl: number;
  campXP: number;
  campXPToNext: number;
  totalCollections: number;
  currentDay: number;
  dailyChestClaimed: boolean;
  lastDailyResetAt: number;
  activities: Activity[];
  badges: Badge[];
  missions: Mission[];
  scouts: Scout[];
  ownedUpgrades: string[];
  notifications: Notification[];
  lastTickAt: number;
  offlineReport?: {
    timeOfflineMs: number;
    coins: number;
    wood: number;
    food: number;
    gems: number;
    xp: number;
  } | null;
}
