import { GameState, Activity, Badge, Mission, Scout, ShopItem, CampUpgrade } from '../types/game';

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'campfire', name: 'Campfire', emoji: '🔥', type: 'coins', status: 'idle', durationSeconds: 5, startedAt: null, endsAt: null, restDurationSeconds: 2, restEndsAt: null, reward: { coins: 5 }, xpReward: 10, unlockLevel: 1, level: 1, upgradeCost: { wood: 5 }, collectionCount: 0 },
  { id: 'wood_pile', name: 'Wood Pile', emoji: '🪵', type: 'wood', status: 'locked', durationSeconds: 15, startedAt: null, endsAt: null, restDurationSeconds: 5, restEndsAt: null, reward: { wood: 10 }, xpReward: 15, unlockLevel: 2, level: 1, upgradeCost: { coins: 20 }, collectionCount: 0 },
  { id: 'foraging_bush', name: 'Foraging Bush', emoji: '🍒', type: 'food', status: 'locked', durationSeconds: 30, startedAt: null, endsAt: null, restDurationSeconds: 10, restEndsAt: null, reward: { food: 15 }, xpReward: 20, unlockLevel: 3, level: 1, upgradeCost: { coins: 30 }, collectionCount: 0 },
  { id: 'tent_area', name: 'Tent Area', emoji: '⛺', type: 'energy', status: 'locked', durationSeconds: 60, startedAt: null, endsAt: null, restDurationSeconds: 5, restEndsAt: null, reward: {}, xpReward: 10, unlockLevel: 4, level: 1, upgradeCost: { wood: 50 }, collectionCount: 0 },
  { id: 'cooking_pot', name: 'Cooking Pot', emoji: '🥘', type: 'special', status: 'locked', durationSeconds: 90, startedAt: null, endsAt: null, restDurationSeconds: 15, restEndsAt: null, reward: { coins: 25 }, xpReward: 40, unlockLevel: 5, level: 1, upgradeCost: { wood: 100 }, collectionCount: 0 },
  { id: 'fishing_pond', name: 'Fishing Pond', emoji: '🎣', type: 'food', status: 'locked', durationSeconds: 120, startedAt: null, endsAt: null, restDurationSeconds: 20, restEndsAt: null, reward: { food: 40, coins: 15 }, xpReward: 50, unlockLevel: 6, level: 1, upgradeCost: { wood: 200 }, collectionCount: 0 },
  { id: 'mushroom_patch', name: 'Mushroom Patch', emoji: '🍄', type: 'special', status: 'locked', durationSeconds: 180, startedAt: null, endsAt: null, restDurationSeconds: 30, restEndsAt: null, reward: { food: 20, gems: 1 }, xpReward: 60, unlockLevel: 7, level: 1, upgradeCost: { coins: 300 }, collectionCount: 0 },
  { id: 'lookout_tower', name: 'Lookout Tower', emoji: '🔭', type: 'special', status: 'locked', durationSeconds: 300, startedAt: null, endsAt: null, restDurationSeconds: 60, restEndsAt: null, reward: { coins: 100 }, xpReward: 100, unlockLevel: 8, level: 1, upgradeCost: { wood: 400 }, collectionCount: 0 },
  { id: 'honey_bear', name: 'Honey Bear', emoji: '🍯', type: 'special', status: 'locked', durationSeconds: 600, startedAt: null, endsAt: null, restDurationSeconds: 120, restEndsAt: null, reward: { food: 100, coins: 50 }, xpReward: 200, unlockLevel: 9, level: 1, upgradeCost: { food: 500 }, collectionCount: 0 },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'fire', name: 'Fire Maker', progress: 0, type: 'in-progress', unlockLevel: 1, linkedActivityIds: ['campfire'], passiveEffect: 'Campfire +20% coins', description: 'Collect from the Campfire.' },
  { id: 'wood', name: 'Wood Crafter', progress: 0, type: 'locked', unlockLevel: 2, linkedActivityIds: ['wood_pile'], passiveEffect: 'Wood Pile +20% wood', description: 'Gather wood from the Wood Pile.' },
  { id: 'forage', name: 'Forager', progress: 0, type: 'locked', unlockLevel: 3, linkedActivityIds: ['foraging_bush'], passiveEffect: 'Food finds +10% rare chance', description: 'Forage for food.' },
  { id: 'trail', name: 'Trail Explorer', progress: 0, type: 'locked', unlockLevel: 4, linkedActivityIds: ['lookout_tower'], passiveEffect: 'Offline cap +1 hour', description: 'Complete trail missions.' },
  { id: 'cook', name: 'Camp Cook', progress: 0, type: 'locked', unlockLevel: 5, linkedActivityIds: ['cooking_pot'], passiveEffect: 'Tent restores 25% more energy', description: 'Cook meals.' },
  { id: 'fish', name: 'Master Fisher', progress: 0, type: 'locked', unlockLevel: 6, linkedActivityIds: ['fishing_pond'], passiveEffect: 'Fishing finds golden fish', description: 'Catch fish.' },
  { id: 'nature', name: 'Nature Guide', progress: 0, type: 'locked', unlockLevel: 7, linkedActivityIds: ['mushroom_patch'], passiveEffect: 'All food rewards +10%', description: 'Collect mushrooms.' },
];

export const INITIAL_SCOUTS: Scout[] = [
  { id: 's1', name: 'Oliver', role: 'Camp Leader', level: 1, xp: 0, xpToNext: 100, energy: 100, maxEnergy: 100, emoji: '🦊', assignedTo: [], ability: 'Speed (Time -20%)', preferredActivities: ['coins', 'special'] },
  { id: 's2', name: 'Mia', role: 'Forager', level: 1, xp: 0, xpToNext: 100, energy: 100, maxEnergy: 100, emoji: '🦌', assignedTo: [], ability: 'Eagle Eye (+50% Food)', preferredActivities: ['food'] },
  { id: 's3', name: 'Leo', role: 'Builder', level: 1, xp: 0, xpToNext: 100, energy: 100, maxEnergy: 100, emoji: '🐻', assignedTo: [], ability: 'Strong (+50% Wood)', preferredActivities: ['wood'] },
  { id: 's4', name: 'Zoe', role: 'Cook', level: 1, xp: 0, xpToNext: 100, energy: 100, maxEnergy: 100, emoji: '🐰', assignedTo: [], ability: 'Master Chef (Wait -30%)', preferredActivities: ['energy'] },
  { id: 's5', name: 'Sam', role: 'Fisher', level: 1, xp: 0, xpToNext: 100, energy: 100, maxEnergy: 100, emoji: '🦦', assignedTo: [], ability: 'Patience (+50% Coins)', preferredActivities: ['special'] },
];

export const DAILY_MISSIONS: Mission[] = [
  { id: 'd1', title: 'Start Activities', icon: '🔥', type: 'daily', reward: { coins: 50, campXP: 20 }, current: 0, target: 5, status: 'go' },
  { id: 'd2', title: 'Gather Wood', icon: '🪵', type: 'daily', reward: { wood: 30, campXP: 20 }, current: 0, target: 30, status: 'go' },
  { id: 'd3', title: 'Assign Scouts', icon: '⛺', type: 'daily', reward: { gems: 1, campXP: 30 }, current: 0, target: 3, status: 'go' },
];

export const TRAIL_MISSIONS: Mission[] = [
  { id: 't1', title: 'First Spark', icon: '🔥', type: 'trail', reward: { coins: 100, campXP: 50 }, current: 0, target: 3, status: 'go', linkedActivityId: 'campfire' },
  { id: 't2', title: 'Upgrade Camp', icon: '🏕️', type: 'trail', reward: { wood: 50, gems: 2 }, current: 0, target: 2, status: 'go' }, // Target camp level 2
  { id: 't3', title: 'Wood Gatherer', icon: '🪵', type: 'trail', reward: { coins: 150, campXP: 100 }, current: 0, target: 50, status: 'locked' },
  { id: 't4', title: 'First Badge', icon: '🏅', type: 'trail', reward: { gems: 5, campXP: 200 }, current: 0, target: 1, status: 'locked' },
];

export const ACTIVITIES_ENERGY_COST: Record<string, number> = {
  campfire: 5,
  wood_pile: 10,
  foraging_bush: 15,
  cooking_pot: 20,
  fishing_pond: 25,
  mushroom_patch: 25,
  lookout_tower: 30,
  honey_bear: 40,
};

// Positive value means it restores energy
export const TENT_ENERGY_RESTORE = 40;

export const CAMP_UPGRADES: CampUpgrade[] = [
  { level: 2, requirements: { coins: 50, campXP: 50 } },
  { level: 3, requirements: { coins: 150, wood: 80, campXP: 150, badges: ['fire'] } },
  { level: 4, requirements: { coins: 300, wood: 200, food: 100, campXP: 400, badges: ['wood'] } },
  { level: 5, requirements: { coins: 600, wood: 400, food: 250, campXP: 1000, scoutsLvl2: 2 } },
  { level: 6, requirements: { coins: 1200, wood: 800, food: 600, campXP: 2500, badges: ['forage', 'trail'] } },
  { level: 7, requirements: { coins: 3000, wood: 2000, food: 1500, campXP: 5000, badges: ['cook'] } },
  { level: 8, requirements: { coins: 8000, wood: 5000, food: 4000, campXP: 10000, scoutsLvl2: 5 } },
  { level: 9, requirements: { coins: 20000, wood: 15000, food: 10000, campXP: 25000, badges: ['fish', 'nature'] } },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'sturdy_axe', name: 'Sturdy Axe', type: 'permanent', price: 450, prevPrice: 600, emoji: '🪓', color: 'from-[#A67B5B] to-[#7A543A]', desc: 'Wood rewards +10%', locked: false },
  { id: 'ration_pack', name: 'Ration Pack', type: 'consumable', price: 120, prevPrice: 200, emoji: '🥫', color: 'from-[#77AB3F] to-[#43741B]', desc: 'Restore all scouts 50 energy', locked: false },
  { id: 'canvas_tent', name: 'Canvas Tent', type: 'permanent', price: 1200, emoji: '⛺', color: 'from-[#D46C6C] to-[#B84E4E]', desc: '+20 Max Energy for all', locked: false },
  { id: 'steel_rod', name: 'Steel Rod', type: 'permanent', price: 850, emoji: '🎣', color: 'from-[#5687C2] to-[#2B578C]', desc: 'Fishing rewards +15%', locked: true },
  { id: 'field_guide', name: 'Field Guide', type: 'permanent', price: 2000, emoji: '📖', color: 'from-[#8C7A5E] to-[#60523C]', desc: '+10% campXP gain', locked: true },
  { id: 'better_backpack', name: 'Better Backpack', type: 'permanent', price: 3000, emoji: '🎒', color: 'from-[#D58C28] to-[#9A6216]', desc: 'Offline cap +30 mins', locked: true },
];

export const INITIAL_STATE: GameState = {
  resources: { coins: 10, wood: 0, food: 0, gems: 0 },
  campLvl: 1,
  campXP: 0,
  campXPToNext: 100, // Not strictly used for leveling but good for display
  totalCollections: 0,
  currentDay: new Date().getDate(),
  dailyChestClaimed: false,
  lastDailyResetAt: Date.now(),
  activities: INITIAL_ACTIVITIES,
  badges: INITIAL_BADGES,
  missions: [...DAILY_MISSIONS, ...TRAIL_MISSIONS],
  scouts: INITIAL_SCOUTS,
  ownedUpgrades: [],
  notifications: [],
  lastTickAt: Date.now(),
};
