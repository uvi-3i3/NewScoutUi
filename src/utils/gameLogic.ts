import { GameState, Scout, Activity, Badge, Mission, Resources, CampUpgrade } from '../types/game';
import { ACTIVITIES_ENERGY_COST, CAMP_UPGRADES, TENT_ENERGY_RESTORE } from '../data/gameConfig';

export function getScoutModifiers(scoutId: string | null | undefined, game: GameState) {
  let speedMulti = 1;
  let foodMulti = 1;
  let woodMulti = 1;
  let coinsMulti = 1;
  let restMulti = 1;
  let energyRestoreMulti = 1;

  if (scoutId === 's1') speedMulti = 0.8;
  if (scoutId === 's2') foodMulti = 1.5;
  if (scoutId === 's3') woodMulti = 1.5;
  if (scoutId === 's4') restMulti = 0.7; // Wait -30%
  if (scoutId === 's5') coinsMulti = 1.5;

  // Apply badge modifiers
  if (isBadgeEarned(game.badges, 'cook')) {
    energyRestoreMulti += 0.25;
  }
  
  if (game.ownedUpgrades.includes('sturdy_axe')) {
    woodMulti *= 1.1;
  }
  if (game.ownedUpgrades.includes('steel_rod')) {
    foodMulti *= 1.15; // assuming steel rod buffs fishing food/coins
    coinsMulti *= 1.15;
  }

  return { speedMulti, foodMulti, woodMulti, coinsMulti, restMulti, energyRestoreMulti };
}

export function isBadgeEarned(badges: Badge[], badgeId: string) {
  const b = badges.find(x => x.id === badgeId);
  return b && b.type === 'earned';
}

export function calculateBaseOfflineCap(game: GameState) {
  let capHours = 2;
  if (isBadgeEarned(game.badges, 'trail')) capHours += 1;
  if (isBadgeEarned(game.badges, 'night')) capHours += 2;
  if (game.ownedUpgrades.includes('better_backpack')) capHours += 0.5;
  return capHours * 60 * 60 * 1000;
}

export function getCampUpgradeReqs(campLvl: number): CampUpgrade['requirements'] | null {
  const upgrade = CAMP_UPGRADES.find(u => u.level === campLvl + 1);
  return upgrade ? upgrade.requirements : null;
}

export function canUpgradeCamp(game: GameState): boolean {
  const reqs = getCampUpgradeReqs(game.campLvl);
  if (!reqs) return false;

  if (reqs.coins && game.resources.coins < reqs.coins) return false;
  if (reqs.wood && game.resources.wood < reqs.wood) return false;
  if (reqs.food && game.resources.food < reqs.food) return false;
  if (reqs.campXP && game.campXP < reqs.campXP) return false;

  if (reqs.badges) {
    for (const bId of reqs.badges) {
      if (!isBadgeEarned(game.badges, bId)) return false;
    }
  }

  if (reqs.scoutsLvl2) {
    const lvl2Count = game.scouts.filter(s => s.level >= 2).length;
    if (lvl2Count < reqs.scoutsLvl2) return false;
  }

  if (reqs.missions) {
    for (const mId of reqs.missions) {
      const m = game.missions.find(m => m.id === mId);
      if (!m || m.status !== 'done') return false;
    }
  }

  return true;
}

export function checkBadgeProgress(badges: Badge[], activityId: string, collectionCount: number): Badge[] {
  return badges.map(b => {
    if (b.type === 'earned') return b;
    if (b.linkedActivityIds.includes(activityId) && b.type === 'in-progress') {
      const newProgress = Math.min(100, b.progress + 5); // 5% per collection
      return {
        ...b,
        progress: newProgress,
        type: newProgress >= 100 ? 'earned' : b.type
      };
    }
    return b;
  });
}

export function updateMissions(missions: Mission[], type: 'collect' | 'upgrade' | 'assign' | 'badge', targetId: string, amount: number = 1): Mission[] {
  return missions.map(m => {
    if (m.status === 'done' || m.status === 'claim') return m;

    let progress = 0;
    if (type === 'collect' && (m.linkedActivityId === targetId || m.title.includes('Start') || m.title.includes('Collect') || m.title.includes('Gather'))) {
      if (m.id === 'd1' || (m.id === 't1' && targetId === 'campfire')) progress = amount;
      if (m.id === 'd2' && targetId === 'wood_pile') progress = amount * 10; // pretend we gathered 10 wood
    }
    if (type === 'assign' && m.id === 'd3') progress = 1;
    if (type === 'upgrade' && m.id === 't2') progress = amount; // camp lvl
    if (type === 'badge' && m.id === 't4') progress = 1;

    if (progress > 0) {
      const newCurrent = Math.min(m.target, m.current + progress);
      return {
        ...m,
        current: newCurrent,
        status: newCurrent >= m.target ? 'claim' : 'go'
      };
    }
    return m;
  });
}

export function applyRandomSurpriseReward(baseRewards: Partial<Resources>): { msg: string, bonus: Partial<Resources> } | null {
  const rand = Math.random();
  if (rand < 0.01) { // 1%
    return { msg: 'Rare treasure found!', bonus: { gems: 1 } };
  } else if (rand < 0.06) { // 5%
    return { msg: 'Found extra supplies!', bonus: { coins: 15, food: 10 } };
  }
  return null;
}
