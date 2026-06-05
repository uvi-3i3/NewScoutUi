import { GameState } from '../types/game';
import { INITIAL_STATE } from '../data/gameConfig';
import { calculateBaseOfflineCap } from './gameLogic';

const SAVE_KEY = 'scouts_game_v3';

export function loadState(): GameState {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return migrateOldSaves(); // Check for v2 or v1 and return INITIAL_STATE or migrated
    const parsed = JSON.parse(saved) as GameState;
    // Overwrite config values with initial state to ensure changes to duration/rewards apply
    const mergedActivities = parsed.activities.map(act => {
      const initAct = INITIAL_STATE.activities.find(a => a.id === act.id);
      return initAct ? { 
        ...act, 
        durationSeconds: initAct.durationSeconds, 
        restDurationSeconds: initAct.restDurationSeconds,
        reward: initAct.reward,
        xpReward: initAct.xpReward
      } : act;
    });

    const mergedBadges = parsed.badges.map(badge => {
       const initBadge = INITIAL_STATE.badges.find(b => b.id === badge.id);
       return initBadge ? {
           ...badge,
           linkedActivityIds: initBadge.linkedActivityIds,
           passiveEffect: initBadge.passiveEffect,
           description: initBadge.description
       } : badge;
    });

    const mergedScouts = parsed.scouts.map(scout => {
       const initScout = INITIAL_STATE.scouts.find(s => s.id === scout.id);
       return initScout ? {
           ...scout,
           ability: initScout.ability,
           preferredActivities: initScout.preferredActivities
       } : scout;
    });

    let loadedCampLvl = parsed.campLvl || INITIAL_STATE.campLvl;
    if (loadedCampLvl < 1) loadedCampLvl = 1;
    if (loadedCampLvl > 10) loadedCampLvl = 1; // Migration: reset to 1 if affected by old default
    else if (loadedCampLvl > 9) loadedCampLvl = 9; // Normal cap

    return applyOfflineProgress({ 
        ...INITIAL_STATE, 
        ...parsed, 
        campLvl: loadedCampLvl,
        activities: mergedActivities,
        badges: mergedBadges,
        scouts: mergedScouts
    });
  } catch {
    return INITIAL_STATE;
  }
}

function migrateOldSaves(): GameState {
   try {
      const oldV2 = localStorage.getItem('scouts_game_v2');
      if (oldV2) {
         // Reset to 1 for v3 because progression has completely changed (checklists etc).
         // Give them their old resources to speed through the initial levels as compensation.
         const parsed = JSON.parse(oldV2);
         return {
            ...INITIAL_STATE,
            resources: { 
               ...INITIAL_STATE.resources, 
               coins: parsed.resources?.coins || INITIAL_STATE.resources.coins,
               wood: parsed.resources?.wood || INITIAL_STATE.resources.wood,
               food: parsed.resources?.food || INITIAL_STATE.resources.food
            },
         };
      }
   } catch {}
   return INITIAL_STATE;
}

export function saveState(state: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function applyOfflineProgress(state: GameState): GameState {
  const now = Date.now();
  const elapsed = now - state.lastTickAt;
  if (elapsed < 60000) return { ...state, lastTickAt: now }; // only run if offline for > 1 min

  const cap = calculateBaseOfflineCap(state);
  const cappedElapsed = Math.min(elapsed, cap);
  
  if (cappedElapsed < 60000) return { ...state, lastTickAt: now };

  let totalCoins = 0;
  let totalWood = 0;
  let totalFood = 0;
  let totalGems = 0;
  let totalXP = 0;

  // We will assume active activities auto-loop at 50% efficiency during offline.
  let updatedActivities = state.activities.map(act => {
    if (act.status !== 'locked' && act.status !== 'idle') {
      const cycleTime = ((act.durationSeconds + act.restDurationSeconds) * 1000) * 2; // 50% efficiency
      
      const cycles = Math.floor(cappedElapsed / cycleTime);
      if (cycles > 0) {
         totalCoins += (act.reward.coins || 0) * cycles;
         totalWood += (act.reward.wood || 0) * cycles;
         totalFood += (act.reward.food || 0) * cycles;
         totalGems += (act.reward.gems || 0) * cycles;
         totalXP += (act.xpReward || 0) * cycles;
         
         return {
            ...act,
            collectionCount: act.collectionCount + cycles,
            status: 'ready' as const, // leaving it ready for them when they return
            endsAt: null,
            startedAt: null,
            restEndsAt: null
         };
      }
    }
    return act;
  });

  const offlineReport = (totalCoins || totalWood || totalFood || totalGems || totalXP) ? {
    timeOfflineMs: cappedElapsed,
    coins: totalCoins,
    wood: totalWood,
    food: totalFood,
    gems: totalGems,
    xp: totalXP
  } : null;

  return { 
    ...state, 
    resources: {
       ...state.resources,
       coins: state.resources.coins + totalCoins,
       wood: state.resources.wood + totalWood,
       food: state.resources.food + totalFood,
       gems: (state.resources.gems || 0) + totalGems
    },
    campXP: state.campXP + totalXP,
    activities: updatedActivities, 
    lastTickAt: now,
    // we inject this transient state to show the modal!
    offlineReport: offlineReport as any
  };
}

export function tick(state: GameState): GameState {
  const now = Date.now();

  const updatedActivities = state.activities.map(act => {
    if (act.status === 'active' && act.endsAt && now >= act.endsAt) {
      return { ...act, status: 'ready' as const };
    }
    if (act.status === 'resting' && act.restEndsAt && now >= act.restEndsAt) {
      return { ...act, status: 'idle' as const, restEndsAt: null, startedAt: null, endsAt: null };
    }
    return act;
  });

  // Daily reset logic check could go here if needed

  return { ...state, activities: updatedActivities, lastTickAt: now };
}
