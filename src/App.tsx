import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Bell, Plus, ArrowUp, CheckCircle2, Clock, 
  Lock, Tent, ClipboardList, Award, Store,
  Flame, Leaf, ChevronRight, Minus, User, RotateCcw
} from 'lucide-react';

// --- TYPES ---
type ActivityStatus = 'idle' | 'active' | 'ready' | 'locked' | 'resting';

interface Activity {
  id: string;
  name: string;
  emoji: string;
  status: ActivityStatus;
  durationSeconds: number;
  startedAt: number | null;
  endsAt: number | null;
  reward: Partial<Resources>;
  xpReward: number;
  unlockLevel: number;
  restDurationSeconds: number;
  restEndsAt: number | null;
}

interface Resources {
  coins: number;
  wood: number;
  food: number;
}

interface Badge {
  id: string;
  name: string;
  progress: number;
  type: 'locked' | 'in-progress' | 'earned';
  unlockLevel: number;
}

interface Mission {
  id: string;
  title: string;
  icon: string;
  reward: Partial<Resources> & { xp?: number; gems?: number };
  current: number;
  target: number;
  status: 'go' | 'claim' | 'done';
}

interface Scout {
  id: string;
  name: string;
  role: string;
  level: number;
  emoji: string;
  assignedTo: string | null;
  ability: string;
}

interface GameState {
  resources: Resources;
  campLvl: number;
  activities: Activity[];
  badges: Badge[];
  missions: Mission[];
  scouts: Scout[];
  lastTickAt: number;
}

function getUpgradeCost(level: number) {
  return {
    coins: level * 50,
    wood: level * 20
  };
}

const INITIAL_STATE: GameState = {
  resources: { coins: 0, wood: 0, food: 0 },
  campLvl: 1,
  lastTickAt: Date.now(),
  activities: [
    { id: 'campfire', name: 'Campfire', emoji: '🔥', status: 'idle', durationSeconds: 2, startedAt: null, endsAt: null, reward: { coins: 5 }, xpReward: 10, unlockLevel: 1, restDurationSeconds: 1, restEndsAt: null },
    { id: 'wood_pile', name: 'Wood Pile', emoji: '🪵', status: 'locked', durationSeconds: 4, startedAt: null, endsAt: null, reward: { wood: 10, coins: 2 }, xpReward: 15, unlockLevel: 2, restDurationSeconds: 2, restEndsAt: null },
    { id: 'foraging_bush', name: 'Foraging Bush', emoji: '🍒', status: 'locked', durationSeconds: 8, startedAt: null, endsAt: null, reward: { food: 10 }, xpReward: 20, unlockLevel: 3, restDurationSeconds: 3, restEndsAt: null },
    { id: 'tent_area', name: 'Tent Area', emoji: '⛺', status: 'locked', durationSeconds: 15, startedAt: null, endsAt: null, reward: { coins: 25 }, xpReward: 30, unlockLevel: 4, restDurationSeconds: 4, restEndsAt: null },
    { id: 'cooking_pot', name: 'Cooking Pot', emoji: '🥘', status: 'locked', durationSeconds: 25, startedAt: null, endsAt: null, reward: { food: 25, coins: 10 }, xpReward: 40, unlockLevel: 5, restDurationSeconds: 5, restEndsAt: null },
    { id: 'fishing_pond', name: 'Fishing Pond', emoji: '🎣', status: 'locked', durationSeconds: 40, startedAt: null, endsAt: null, reward: { food: 40, coins: 15 }, xpReward: 50, unlockLevel: 6, restDurationSeconds: 8, restEndsAt: null },
    { id: 'mushroom_patch', name: 'Mushroom Patch', emoji: '🍄', status: 'locked', durationSeconds: 60, startedAt: null, endsAt: null, reward: { food: 50, coins: 25 }, xpReward: 60, unlockLevel: 7, restDurationSeconds: 10, restEndsAt: null },
    { id: 'lookout_tower', name: 'Lookout Tower', emoji: '🔭', status: 'locked', durationSeconds: 90, startedAt: null, endsAt: null, reward: { coins: 100 }, xpReward: 100, unlockLevel: 8, restDurationSeconds: 15, restEndsAt: null },
    { id: 'honey_bear', name: 'Honey Bear', emoji: '🍯', status: 'locked', durationSeconds: 120, startedAt: null, endsAt: null, reward: { food: 80, coins: 40 }, xpReward: 80, unlockLevel: 9, restDurationSeconds: 20, restEndsAt: null },
  ],
  badges: [
    { id: 'fire', name: 'Fire Maker', progress: 0, type: 'in-progress', unlockLevel: 1 },
    { id: 'wood', name: 'Wood Crafter', progress: 0, type: 'locked', unlockLevel: 2 },
    { id: 'forage', name: 'Forager', progress: 0, type: 'locked', unlockLevel: 3 },
    { id: 'trail', name: 'Trail Explorer', progress: 0, type: 'locked', unlockLevel: 4 },
    { id: 'cook', name: 'Camp Cook', progress: 0, type: 'locked', unlockLevel: 5 },
    { id: 'fish', name: 'Master Fisher', progress: 0, type: 'locked', unlockLevel: 6 },
    { id: 'nature', name: 'Nature Guide', progress: 0, type: 'locked', unlockLevel: 7 },
    { id: 'beast', name: 'Beast Tracker', progress: 0, type: 'locked', unlockLevel: 8 },
    { id: 'night', name: 'Night Owl', progress: 0, type: 'locked', unlockLevel: 9 },
  ],
  missions: [
    { id: 'm1', title: 'Gather Wood', icon: '🪵', reward: { coins: 100 }, current: 0, target: 50, status: 'go' },
    { id: 'm2', title: 'Cook Meals', icon: '🥘', reward: { xp: 50 }, current: 0, target: 2, status: 'go' },
    { id: 'm3', title: 'Find Rare Shroom', icon: '🍄', reward: { gems: 10 }, current: 0, target: 1, status: 'go' },
    { id: 'm4', title: 'Pitch Tent', icon: '⛺', reward: { xp: 100 }, current: 0, target: 1, status: 'go' },
    { id: 'm5', title: 'Unlock Fishing', icon: '🎣', reward: { xp: 200, coins: 500 }, current: 0, target: 1, status: 'go' },
  ],
  scouts: [
    { id: 's1', name: 'Oliver', role: 'Camp Leader', level: 1, emoji: '🦊', assignedTo: null, ability: 'Speed (Time -20%)' },
    { id: 's2', name: 'Mia', role: 'Forager', level: 1, emoji: '🦌', assignedTo: null, ability: 'Eagle Eye (+50% Food)' },
    { id: 's3', name: 'Leo', role: 'Builder', level: 1, emoji: '🐻', assignedTo: null, ability: 'Strong (+50% Wood)' },
    { id: 's4', name: 'Zoe', role: 'Cook', level: 1, emoji: '🐰', assignedTo: null, ability: 'Master Chef (Wait Time -30%)' },
    { id: 's5', name: 'Sam', role: 'Fisher', level: 1, emoji: '🦦', assignedTo: null, ability: 'Patience (+50% Coins)' },
  ],
};

function getScoutModifiers(scoutId?: string | null) {
  let speedMulti = 1;
  let foodMulti = 1;
  let woodMulti = 1;
  let coinsMulti = 1;
  let restMulti = 1;
  if (scoutId === 's1') speedMulti = 0.8;
  if (scoutId === 's2') foodMulti = 1.5;
  if (scoutId === 's3') woodMulti = 1.5;
  if (scoutId === 's4') restMulti = 0.7;
  if (scoutId === 's5') coinsMulti = 1.5;
  return { speedMulti, foodMulti, woodMulti, coinsMulti, restMulti };
}

const SAVE_KEY = 'scouts_game_v2';

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return INITIAL_STATE;
    const parsed = JSON.parse(saved) as GameState;
    // Overwrite with balanced config
    const mergedActivities = parsed.activities.map(act => {
      const initAct = INITIAL_STATE.activities.find(a => a.id === act.id);
      return initAct ? { 
        ...act, 
        durationSeconds: initAct.durationSeconds, 
        restDurationSeconds: initAct.restDurationSeconds 
      } : act;
    });
    return applyOfflineProgress({ ...parsed, activities: mergedActivities });
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function applyOfflineProgress(state: GameState): GameState {
  const now = Date.now();
  const elapsed = now - state.lastTickAt;
  if (elapsed < 2000) return state;

  // const cappedElapsed = Math.min(elapsed, 8 * 60 * 60 * 1000);
  
  let updatedActivities = state.activities.map(act => {
    if (act.status === 'active' && act.endsAt && now >= act.endsAt) {
      return { ...act, status: 'ready' as ActivityStatus };
    }
    if (act.status === 'resting' && act.restEndsAt && now >= act.restEndsAt) {
      return { ...act, status: 'idle' as ActivityStatus, restEndsAt: null };
    }
    return act;
  });

  return { ...state, activities: updatedActivities, lastTickAt: now };
}

function tick(state: GameState): GameState {
  const now = Date.now();

  const updatedActivities = state.activities.map(act => {
    if (act.status === 'active' && act.endsAt && now >= act.endsAt) {
      return { ...act, status: 'ready' as ActivityStatus };
    }
    if (act.status === 'resting' && act.restEndsAt && now >= act.restEndsAt) {
      return { ...act, status: 'idle' as ActivityStatus, restEndsAt: null };
    }
    return act;
  });

  return { ...state, activities: updatedActivities, lastTickAt: now };
}

const BADGE_ACTIVITY_MAP: Record<string, { badgeId: string; increment: number }> = {
  campfire:       { badgeId: 'fire',   increment: 5  },
  cooking_pot:    { badgeId: 'cook',   increment: 8  },
  wood_pile:      { badgeId: 'wood',   increment: 6  },
  foraging_bush:  { badgeId: 'forage', increment: 7  },
  mushroom_patch: { badgeId: 'forage', increment: 4  },
  fishing_pond:   { badgeId: 'fish',   increment: 10 },
  honey_bear:     { badgeId: 'nature', increment: 5  },
  lookout_tower:  { badgeId: 'beast',  increment: 8  },
  tent_area:      { badgeId: 'trail',  increment: 3  },
};

function updateBadgeProgress(badges: Badge[], activityId: string, campLvl: number): Badge[] {
  const mapping = BADGE_ACTIVITY_MAP[activityId];
  return badges.map(badge => {
    if (badge.type === 'locked' && badge.unlockLevel <= campLvl) {
      return { ...badge, type: 'in-progress' as const, progress: 0 };
    }
    if (!mapping || badge.id !== mapping.badgeId) return badge;
    if (badge.type === 'locked' || badge.type === 'earned') return badge;

    const newProgress = Math.min(100, badge.progress + mapping.increment);
    return {
      ...badge,
      progress: newProgress,
      type: newProgress >= 100 ? 'earned' : 'in-progress',
    } as Badge;
  });
}

const MISSION_ACTIVITY_MAP: Record<string, string> = {
  wood_pile:      'm1',
  cooking_pot:    'm2',
  mushroom_patch: 'm3',
  tent_area:      'm4',
};

function updateMissionProgress(missions: Mission[], activityId: string): Mission[] {
  const missionId = MISSION_ACTIVITY_MAP[activityId];
  return missions.map(m => {
    if (m.id !== missionId || m.status === 'done') return m;
    const newCurrent = Math.min(m.target, m.current + 1);
    return {
      ...m,
      current: newCurrent,
      status: newCurrent >= m.target ? 'claim' : 'go',
    };
  });
}

function formatTimeLeft(endsAt: number | null): string {
  if (!endsAt) return '';
  const msLeft = Math.max(0, endsAt - Date.now());
  const totalSecs = Math.ceil(msLeft / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins > 0) return `${mins}m ${secs}s left`;
  return `${secs}s left`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Camp');

  const [game, setGame] = useState<GameState>(loadState);

  // Save on every state change
  useEffect(() => {
    saveState(game);
  }, [game]);

  // Master tick — runs every second
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => tick(prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function resetGame() {
    if (confirm('Are you sure you want to reset your camp? All progress will be lost!')) {
      setGame(INITIAL_STATE);
    }
  }

  function handleUpgradeCamp() {
    const cost = getUpgradeCost(game.campLvl);
    if (game.resources.coins >= cost.coins && game.resources.wood >= cost.wood) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 60, 40, 60, 100]);
      }
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.3 },
        colors: ['#78A944', '#D58C28'],
        disableForReducedMotion: true,
      });
      
      setGame(prev => {
        const currentCost = getUpgradeCost(prev.campLvl);
        if (prev.resources.coins >= currentCost.coins && prev.resources.wood >= currentCost.wood) {
          const newLvl = prev.campLvl + 1;
          
          const updatedActivities = prev.activities.map(a => {
            if (a.status === 'locked' && a.unlockLevel <= newLvl) {
              return { ...a, status: 'idle' as ActivityStatus };
            }
            return a;
          });

          const updatedBadges = updateBadgeProgress(prev.badges, 'upgrade', newLvl);
          
          return {
            ...prev,
            campLvl: newLvl,
            resources: {
              ...prev.resources,
              coins: prev.resources.coins - currentCost.coins,
              wood: prev.resources.wood - currentCost.wood,
            },
            activities: updatedActivities,
            badges: updatedBadges
          };
        }
        return prev;
      });
    }
  }

  function handleAssignScout(activityId: string, event?: React.MouseEvent) {
    if (event) event.stopPropagation();
    setGame(prev => {
      const currentScout = prev.scouts.find(s => s.assignedTo === activityId);
      const availableScouts = prev.scouts.filter(s => !s.assignedTo);
      
      const options = [null, ...availableScouts.map(s => s.id)];
      if (currentScout) options.splice(1, 0, currentScout.id);
      
      const idx = options.indexOf(currentScout ? currentScout.id : null);
      const nextId = options[(idx + 1) % options.length];

      return {
        ...prev,
        scouts: prev.scouts.map(s => {
          if (currentScout && s.id === currentScout.id && s.id !== nextId) {
            return { ...s, assignedTo: null };
          }
          if (nextId && s.id === nextId) {
            return { ...s, assignedTo: activityId };
          }
          return s;
        })
      };
    });
  }

  function handleStartActivity(activityId: string) {
    setGame(prev => {
      const now = Date.now();
      const assignedScout = prev.scouts.find(s => s.assignedTo === activityId);
      const mods = getScoutModifiers(assignedScout?.id);
      const updatedActivities = prev.activities.map(act => {
        if (act.id !== activityId || act.status !== 'idle') return act;
        return {
          ...act,
          status: 'active' as ActivityStatus,
          startedAt: now,
          endsAt: now + (act.durationSeconds * mods.speedMulti) * 1000,
        };
      });
      return { ...prev, activities: updatedActivities };
    });
  }

  function handleSpeedUpActivity(activityId: string) {
    setGame(prev => {
      const updatedActivities = prev.activities.map(act => {
        if (act.id !== activityId || act.status !== 'active' || !act.endsAt) return act;
        const newEndsAt = act.endsAt - 1000; // Speed up by 1 second per tap! Addictive!
        return {
          ...act,
          endsAt: Math.max(Date.now(), newEndsAt)
        };
      });
      return { ...prev, activities: updatedActivities };
    });
  }

  function handleCollectActivity(activityId: string, event?: React.MouseEvent) {
    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { x, y },
        colors: ['#78A944', '#D58C28', '#A48F70', '#8B5A2B'],
        disableForReducedMotion: true,
        ticks: 80,
      });
      
      // Satisfying haptic pop-pop for collecting resources
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    }

    setGame(prev => {
      const act = prev.activities.find(a => a.id === activityId);
      if (!act || act.status !== 'ready') return prev;

      const assignedScout = prev.scouts.find(s => s.assignedTo === activityId);
      const mods = getScoutModifiers(assignedScout?.id);

      const now = Date.now();

      const newResources: Resources = {
        coins: prev.resources.coins + Math.floor((act.reward.coins ?? 0) * mods.coinsMulti),
        wood:  prev.resources.wood  + Math.floor((act.reward.wood  ?? 0) * mods.woodMulti),
        food:  prev.resources.food  + Math.floor((act.reward.food  ?? 0) * mods.foodMulti),
      };

      let newLvl = prev.campLvl;

      const updatedActivities = prev.activities.map(a => {
        if (a.id === activityId) {
          return {
            ...a,
            status: 'resting' as ActivityStatus,
            startedAt: null,
            endsAt: null,
            restEndsAt: now + (a.restDurationSeconds * mods.restMulti) * 1000,
          };
        }
        if (a.status === 'locked' && a.unlockLevel <= newLvl) {
          return { ...a, status: 'idle' as ActivityStatus };
        }
        return a;
      });

      const updatedBadges = updateBadgeProgress(prev.badges, activityId, newLvl);
      const updatedMissions = updateMissionProgress(prev.missions, activityId);

      return {
        ...prev,
        resources: newResources,
        activities: updatedActivities,
        badges: updatedBadges,
        missions: updatedMissions,
      };
    });
  }

  function handleClaimMission(missionId: string) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#78A944', '#D58C28', '#A48F70', '#8B5A2B'],
      disableForReducedMotion: true,
    });

    setGame(prev => {
      const mission = prev.missions.find(m => m.id === missionId);
      if (!mission || mission.status !== 'claim') return prev;

      const newResources: Resources = {
        coins: prev.resources.coins + (mission.reward?.coins || 0),
        wood:  prev.resources.wood + (mission.reward?.wood || 0),
        food:  prev.resources.food + (mission.reward?.food || 0),
      };

      const updatedMissions = prev.missions.map(m =>
        m.id === missionId ? { ...m, status: 'done' as const } : m
      );

      return {
        ...prev,
        resources: newResources,
        missions: updatedMissions,
      };
    });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-4 bg-[#EBE9E4] relative overflow-hidden">
      {/* Main App Container */}
      <div 
        className="w-full h-screen md:h-[760px] md:max-w-[360px] bg-[#F4EFE6] md:rounded-[36px] overflow-hidden md:shadow-[0_20px_60px_-15px_rgba(100,80,60,0.3)] flex flex-col font-sans relative md:scale-[0.87] origin-center"
      >
        {/* Cozy Scout Map Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Topographic Lines SVG */}
          <svg className="absolute inset-0 w-full h-full text-[#C8BFA9] opacity-40" xmlns="http://www.w3.org/2000/svg">
             <path d="M-50,50 Q100,-20 200,100 T450,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
             <path d="M-50,70 Q100,0 200,120 T450,70" fill="none" stroke="currentColor" strokeWidth="1" />
             <path d="M-50,90 Q100,20 200,140 T450,90" fill="none" stroke="currentColor" strokeWidth="0.5" />
             
             <path d="M-20,300 Q150,250 250,400 T450,300" fill="none" stroke="currentColor" strokeWidth="1.5" />
             <path d="M-20,320 Q150,270 250,420 T450,320" fill="none" stroke="currentColor" strokeWidth="1" />
             <path d="M-20,340 Q150,290 250,440 T450,340" fill="none" stroke="currentColor" strokeWidth="0.5" />
             
             <path d="M200,600 Q300,550 400,700 T500,600" fill="none" stroke="currentColor" strokeWidth="1.5" />
             <path d="M180,620 Q280,570 380,720 T480,620" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          
          {/* Dotted Trail */}
          <svg className="absolute inset-0 w-full h-full text-[#A89F88] opacity-30" xmlns="http://www.w3.org/2000/svg">
             <path d="M40,150 Q150,300 280,220 T360,500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 8" strokeLinecap="round" />
             <circle cx="40" cy="150" r="4" fill="currentColor" />
             <path d="M350,490 L370,510 M370,490 L350,510" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.15]" style={{backgroundImage: 'linear-gradient(#B8B09D 1px, transparent 1px), linear-gradient(90deg, #B8B09D 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center center'}}></div>
          
          {/* Compass / Map Decorations */}
          <span className="absolute top-[10%] -right-12 text-[140px] opacity-[0.04] text-black drop-shadow-sm pointer-events-none leading-none">🧭</span>
          <span className="absolute bottom-[20%] -left-8 text-[120px] opacity-[0.04] text-black drop-shadow-sm pointer-events-none leading-none">🌲</span>
          
          {/* Paper Shading / Fold Lines */}
          <div className="absolute h-full w-[2px] bg-white opacity-[0.1] shadow-[0_0_10px_rgba(0,0,0,0.1)] left-1/3"></div>
          <div className="absolute w-full h-[2px] bg-white opacity-[0.1] shadow-[0_0_10px_rgba(0,0,0,0.1)] top-1/2"></div>
          
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(150,130,110,0.2)] mix-blend-multiply border-[4px] border-[#E8DFC9] rounded-[36px]"></div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full">
          <div className="flex-shrink-0">
            <Header coins={game.resources.coins} wood={game.resources.wood} food={game.resources.food} campLvl={game.campLvl} onReset={resetGame} />
            <ResourceBar resources={game.resources} />
          </div>
          
          {activeTab === 'Camp' && (
            <>
              <div className="flex-shrink-0">
                <CampLevel campLvl={game.campLvl} resources={game.resources} onUpgrade={handleUpgradeCamp} />
              </div>
              <div className="px-4 mb-2 flex-1 min-h-0 relative z-10 flex flex-col">
                <ActivitiesMap activities={game.activities} scouts={game.scouts} onStart={handleStartActivity} onCollect={handleCollectActivity} onSpeedUp={handleSpeedUpActivity} onAssign={handleAssignScout} />
              </div>
            </>
          )}

          {activeTab === 'Missions' && (
            <MissionsTab missions={game.missions} onClaim={handleClaimMission} />
          )}

          {activeTab === 'Badges' && (
            <BadgesTab badges={game.badges} />
          )}

          {activeTab === 'Scouts' && (
            <ScoutsTab scouts={game.scouts} />
          )}

          {activeTab === 'Shop' && (
            <ShopTab />
          )}

          <div className="flex-shrink-0">
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ coins, wood, food, campLvl, onReset }: any) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-[36px] h-[36px] bg-[#78A944] rounded-[8px] flex items-center justify-center shadow-sm border border-[#557F26]">
          <span className="text-[18px] relative z-10 leading-none pb-0.5">⚜️</span>
        </div>
        <h1 className="text-[20px] font-extrabold tracking-tight text-[#1E3310] uppercase">SCOUTS</h1>
      </div>
      <div className="flex items-center gap-3 mr-1">
        <RotateCcw onClick={onReset} className="w-[20px] h-[20px] text-[#A67E51] cursor-pointer hover:text-[#8E6941] transition-colors" strokeWidth={2} />
        <div className="relative">
          <Bell className="w-[24px] h-[24px] text-[#A67E51]" fill="#A67E51" strokeWidth={1.5} />
          <div className="absolute -top-0.5 -right-0.5 w-[10px] h-[10px] bg-[#DD5F22] border-[1.5px] border-[#FCF8ED] rounded-full shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}

function ResourceBar({ resources }: any) {
  return (
    <div className="flex items-center gap-2 px-4 mb-2 shrink-0">
      <div className="flex items-center justify-center bg-[#FEFCF3] rounded-lg py-1.5 px-2 flex-1 border border-[#E2D2B6] shadow-sm hover:bg-white transition-colors cursor-pointer">
        <div className="w-[14px] h-[14px] bg-[#E29D1D] rounded-[3px] flex items-center justify-center border border-[#BA7810] mr-1.5">
           <span className="text-[7px] text-white">⚜️</span>
        </div>
        <span className="font-extrabold text-[11px] truncate text-[#383222]">{resources.coins}</span>
      </div>
      <div className="flex items-center justify-center bg-[#FEFCF3] rounded-lg py-1.5 px-2 flex-1 border border-[#E2D2B6] shadow-sm hover:bg-white transition-colors cursor-pointer">
        <span className="text-[14px] mr-1 leading-none pt-0.5">🪵</span>
        <span className="font-extrabold text-[11px] truncate text-[#383222]">{resources.wood}</span>
      </div>
      <div className="flex items-center justify-between bg-[#FEFCF3] rounded-lg py-1 px-1 pl-2 flex-1 border border-[#E2D2B6] shadow-sm hover:bg-white transition-colors cursor-pointer">
        <div className="flex items-center">
          <span className="text-[13px] mr-1 leading-none pt-[1px]">🍞</span>
          <span className="font-extrabold text-[11px] truncate text-[#383222]">{resources.food}</span>
        </div>
        <div className="w-[18px] h-[18px] bg-[#E1DBCA] rounded text-[#556F37] flex items-center justify-center shrink-0">
          <Plus className="w-[12px] h-[12px]" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

function CampLevel({ campLvl, resources, onUpgrade }: any) {
  const cost = getUpgradeCost(campLvl);
  const canUpgrade = resources.coins >= cost.coins && resources.wood >= cost.wood;
  const nextUnlock = INITIAL_STATE.activities.find(a => a.unlockLevel === campLvl + 1);

  return (
    <div className="px-4 mb-4 shrink-0">
      <div className="bg-[#FEFCF3] rounded-[24px] p-4 shadow-sm border-[2px] border-[#E2D2B6] flex items-center justify-between transition-all hover:shadow-md hover:bg-white cursor-default relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F4E8D1] to-transparent opacity-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="relative w-[64px] h-[64px] bg-[#EFE9DA] rounded-[18px] flex items-center justify-center text-[42px] drop-shadow-sm shrink-0 border border-[#DCCCAD] shadow-inner">
             🏕️
          </div>
          <div className="flex flex-col justify-center flex-1">
            <h2 className="text-[#304811] font-black text-[22px] tracking-tight leading-none mb-1.5 flex items-center gap-2">
              Camp Level {campLvl}
            </h2>
            <div className="flex flex-col gap-1">
              <span className="text-[#8C7A5E] text-[11.5px] font-extrabold tracking-wide uppercase leading-none">Upgrade Cost:</span>
              <div className="flex items-center gap-2.5">
                 <div className={`flex items-center gap-1 bg-[#F5EAD4] px-2 py-1 rounded-md border border-[#E8D9BB] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] ${resources.coins >= cost.coins ? '' : 'opacity-60'}`}>
                   <span className="text-[12px]">🪙</span>
                   <span className={`text-[13px] font-black ${resources.coins >= cost.coins ? 'text-[#D58C28]' : 'text-[#A49C8B]'}`}>{cost.coins}</span>
                 </div>
                 <div className={`flex items-center gap-1 bg-[#F5EAD4] px-2 py-1 rounded-md border border-[#E8D9BB] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] ${resources.wood >= cost.wood ? '' : 'opacity-60'}`}>
                   <span className="text-[12px]">🪵</span>
                   <span className={`text-[13px] font-black ${resources.wood >= cost.wood ? 'text-[#8B5A2B]' : 'text-[#A49C8B]'}`}>{cost.wood}</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center relative z-10 ml-2">
             <button 
               onClick={onUpgrade}
               disabled={!canUpgrade}
               className={`relative shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-[16px] text-white transition-all ${canUpgrade ? 'bg-[#78A944] hover:bg-[#689439] active:scale-95 shadow-[0_4px_0_#557F26] hover:translate-y-[1px] hover:shadow-[0_3px_0_#557F26] active:translate-y-[4px] active:shadow-[0_0px_0_#557F26]' : 'bg-[#EAE0CB] cursor-not-allowed opacity-80 border-2 border-[#DCCCAD]'}`}
             >
               <ArrowUp className={`w-[26px] h-[26px] ${canUpgrade ? 'animate-bounce' : ''}`} strokeWidth={3.5} />
             </button>
             {nextUnlock && canUpgrade && <span className="absolute -bottom-2 -right-2 text-[20px] drop-shadow-lg pointer-events-none">{nextUnlock.emoji}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitiesMap({ activities, scouts, onStart, onCollect, onSpeedUp, onAssign }: any) {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-start">
      <div className="flex items-center gap-2 mb-2 relative z-10 shrink-0 px-2 mt-1">
        <h2 className="text-[#304811] font-extrabold text-[16px] tracking-tight ml-2">Camp Activities</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 relative z-10 px-4 mt-1 pb-4">
        <AnimatePresence>
          {activities.filter((act: Activity) => act.status !== 'locked').map((act: Activity) => (
            <ActivityCard key={act.id} act={act} scouts={scouts} onStart={onStart} onCollect={onCollect} onSpeedUp={onSpeedUp} onAssign={onAssign} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActivityCard({ act, scouts, onStart, onCollect, onSpeedUp, onAssign }: { 
  act: Activity, 
  scouts: any[],
  onStart: (id: string) => void, 
  onCollect: (id: string, e: React.MouseEvent) => void,
  onSpeedUp?: (id: string) => void,
  onAssign?: (id: string, e: React.MouseEvent) => void,
  key?: React.Key
}) {
  const { id, emoji, status, endsAt, name, reward, xpReward } = act;
  const isActive = status === 'active';
  const isLocked = status === 'locked';
  const assignedScout = scouts?.find(s => s.assignedTo === id);
  const [showReward, setShowReward] = useState(false);
  const [taps, setTaps] = useState<{id: string, x: number, y: number}[]>([]);
  
  const handleClick = (e: React.MouseEvent) => {
    if (status === 'idle') {
      onStart(id);
    } else if (status === 'ready') {
      setShowReward(true);
      onCollect(id, e);
      setTimeout(() => setShowReward(false), 2000);
    } else if (status === 'active' && onSpeedUp) {
      onSpeedUp(id);
      const tapId = Math.random().toString(36).substr(2, 9);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTaps(prev => [...prev, { id: tapId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setTaps(prev => prev.filter(t => t.id !== tapId)), 600);
    }
  };
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileTap={isLocked || status === 'resting' ? {} : { scale: 0.92 }}
      onClick={handleClick} 
      className={`relative flex flex-col items-center justify-center bg-[#FEFCF3] w-full min-h-[88px] h-fit pb-1 rounded-[18px] shadow-sm border ${isActive ? 'border-[#78A944] ring-4 ring-[#78A944]/20 bg-white z-10' : 'border-[#E2D2B6] hover:border-[#D1B88B] hover:bg-white'} ${(isLocked || status === 'resting') ? 'opacity-70 grayscale-[40%] hover:opacity-70 cursor-not-allowed' : 'cursor-pointer'} transition-all group pt-1`}
    >
      {/* Scout Assignment Button */}
      {!isLocked && (
        <button
          onClick={(e) => onAssign && onAssign(id, e)}
          className={`absolute -top-1.5 -left-1.5 w-[24px] h-[24px] rounded-[8px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.8)] border-[1.5px] border-[#FEFCF3] z-30 transition-all ${assignedScout ? 'bg-[#FFF9EA]' : 'bg-[#E2D2B6] hover:bg-[#CBB58B]'}`}
        >
          {assignedScout ? (
            <span className="text-[13px] drop-shadow-sm leading-none pl-[1px]">{assignedScout.emoji}</span>
          ) : (
            <span className="text-[12px] text-[#A29780] font-black pointer-events-none">+</span>
          )}
        </button>
      )}

      {/* Floating Speed Up Indicators */}
      <AnimatePresence>
        {taps.map(tap => (
          <motion.div
            key={tap.id}
            initial={{ opacity: 1, y: tap.y, x: tap.x, scale: 0.5 }}
            animate={{ opacity: 0, y: tap.y - 40, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute text-[#78A944] font-black pointer-events-none text-[14px] z-50 drop-shadow-sm"
          >
            -1s!
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -40, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap z-50 pointer-events-none"
          >
            {reward?.coins && <span className="text-[#D58C28] font-black text-[14px] drop-shadow-md">+{reward.coins}🪙</span>}
            {reward?.wood && <span className="text-[#8B5A2B] font-black text-[14px] drop-shadow-md">+{reward.wood}🪵</span>}
            {reward?.food && <span className="text-[#78A944] font-black text-[14px] drop-shadow-md">+{reward.food}🍒</span>}
            <span className="text-[#3A5025] font-black text-[12px] drop-shadow-md">+{xpReward}✨</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tiny corner indicators */}
      <AnimatePresence mode="wait">
        {status === 'ready' && (
          <motion.div 
            key="ready"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 bg-[#78A944] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={4} />
          </motion.div>
        )}
        {status === 'active' && (
          <motion.div 
            key="active"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 bg-[#78A944] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]"
          >
            <Clock className="w-3 h-3" strokeWidth={3.5} />
          </motion.div>
        )}
        {status === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 bg-[#A49C8B] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]"
          >
            <Minus className="w-3 h-3" strokeWidth={4} />
          </motion.div>
        )}
        {status === 'resting' && (
          <motion.div 
            key="resting"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 bg-[#5687C2] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]"
          >
            <span className="text-[11px] font-extrabold pb-[1px] leading-none">Z</span>
          </motion.div>
        )}
        {status === 'locked' && (
          <motion.div 
            key="locked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 bg-[#8C8677] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]"
          >
            <Lock className="w-3 h-3" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Centered Emoji */}
      <span className={`text-[28px] drop-shadow-md mb-0.5 ${isLocked ? 'opacity-60' : ''}`}>
        {emoji}
      </span>
      
      {/* Text Detail */}
      <span className={`text-[9.5px] font-extrabold leading-tight tracking-tight text-center px-1 truncate w-[85%] ${isLocked ? 'text-[#8C8677]' : 'text-[#304811]'}`}>
        {name}
      </span>
      
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[#78A944] font-black whitespace-nowrap z-30 mt-0.5"
        >
          {formatTimeLeft(endsAt)}
        </motion.div>
      )}
    </motion.div>
  );
}

function MissionsTab({ missions, onClaim }: any) {
  const completedCount = missions.filter((m: any) => m.status === 'done').length;

  return (
    <div className="flex-1 min-h-0 relative flex flex-col w-full px-1 pt-1 mb-2">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 flex flex-col gap-3 relative z-10 w-full">

      <div className="pt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[#304811] font-extrabold text-[20px] tracking-tight">Missions</h2>
          <span className="text-[#304811] opacity-70 drop-shadow-sm text-sm">🪧</span>
        </div>
        <div className="bg-[#FEFCF3] rounded-[16px] p-3 shadow-sm border border-[#DBC19C] relative">
          <div className="flex justify-between items-center mb-2 px-1">
             <h2 className="text-[#304811] font-extrabold text-[15px] tracking-tight">Today's Trail</h2>
             <span className="text-[#78A944] font-extrabold text-[12px]">{completedCount} / {missions.length}</span>
          </div>
          <div className="w-full h-[6px] bg-[#EBE6CD] rounded-full overflow-hidden">
            <div className="bg-[#78A944] h-full rounded-full transition-all duration-300" style={{ width: `${(completedCount / missions.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="px-3">
         {/* Featured Mission */}
         <div className="bg-[#FEFCF3] rounded-2xl p-3 shadow-sm border border-[#DBC19C] relative flex items-center gap-3">
           <div className="w-[60px] h-[60px] bg-[#F1E4C3] rounded-xl flex items-center justify-center text-[32px] border border-[#DBC19C] shrink-0">
             🎣
           </div>
           
           <div className="flex-1 min-w-0">
             <span className="text-[#E4A034] text-[9px] font-extrabold uppercase tracking-wide mb-0.5 block">Featured Task</span>
             <h3 className="font-extrabold text-[14px] text-[#2A4418] leading-tight mb-1 truncate">Unlock Fishing Pond</h3>
             <div className="flex items-center gap-1.5 mb-2">
               <span className="bg-[#EAE0CB] text-[#7A6C56] font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-[#DBC19C] flex items-center gap-1">
                 <span className="text-[#E4A034] text-[10px]">⭐</span> 200 XP
               </span>
             </div>
           </div>
           
           <div className="shrink-0 flex items-center justify-center">
             <button className="bg-[#7CAE41] hover:bg-[#689439] text-white font-extrabold text-[12px] px-3 py-1.5 rounded-[10px] transition-all outline-none">
               GO
             </button>
           </div>
         </div>
      </div>

      <div className="px-3">
        {/* Mission Grid */}
        <div className="grid grid-cols-2 gap-2.5">
           {missions.map((m: any) => (
             <SmallMissionCard 
               key={m.id}
               icon={m.icon} 
               title={m.title} 
               progress={`${m.current}/${m.target}`} 
               reward={m.reward.coins ? `${m.reward.coins} 🪙` : m.reward.xp ? `${m.reward.xp} ✨` : `${m.reward.gems} 💎`} 
               status={m.status} 
               onClick={() => onClaim(m.id)}
             />
           ))}
        </div>
      </div>

      <div className="px-3 mt-1 pb-4">
        {/* Daily Chest */}
        <div className="bg-gradient-to-br from-[#FEFCF3] to-[#F1E4C3] rounded-[18px] p-3 shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-[1.5px] border-[#DBC19C] relative flex items-center gap-3">
          <div className="w-[50px] h-[50px] bg-[#EAE0CB] rounded-[12px] flex items-center justify-center text-[28px] border-[1.5px] border-[#DBC19C] shrink-0 shadow-inner">
            🧰
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-[13px] text-[#2A4418] mb-0.5">Daily Chest</h3>
            <p className="text-[#7A6C56] font-bold text-[10px] mb-1.5">Complete 5 missions</p>
            <div className="w-full h-[5px] bg-[#DBC19C] rounded-full overflow-hidden shadow-inner">
              <div className="bg-[#E4A034] h-full rounded-full w-[60%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"></div>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-center gap-1">
             <div className="flex gap-1">
               <span className="text-[10px]">🪙</span>
               <span className="text-[10px]">💎</span>
             </div>
             <button className="bg-gradient-to-b from-[#A49C8B] to-[#7A6C56] text-white opacity-70 font-extrabold text-[11px] px-3 py-1 rounded-[8px] border-[1.5px] border-[#564938] pointer-events-none">
               Locked
             </button>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}

function SmallMissionCard({ icon, title, progress, reward, status, onClick }: any) {
  const isClaim = status === 'claim';
  const isDone = status === 'done';
  const percent = progress.includes('/') ? Math.round((parseInt(progress.split('/')[0]) / parseInt(progress.split('/')[1])) * 100) : 0;
  
  return (
    <motion.div 
      layout
      className={`bg-[#FEFCF3] rounded-[14px] p-2 shadow-sm border ${isClaim ? 'border-[#78A944]' : 'border-[#DBC19C]'} relative ${isDone ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1.5 mt-1">
        <div className={`w-[32px] h-[32px] rounded-[10px] flex items-center justify-center text-[18px] border shrink-0 ${isClaim ? 'bg-[#F2F7E6] border-[#78A944]' : 'bg-[#F1E4C3] border-[#DBC19C]'}`}>
           {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-[11px] text-[#2A4418] truncate leading-tight">{title}</h4>
          <span className="text-[#D58C28] font-extrabold text-[9px]">{reward}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
         <div className="flex-1 h-[4px] bg-[#EBE6CD] rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${percent}%` }}
             className={`h-full rounded-full ${isClaim || isDone ? 'bg-[#78A944]' : 'bg-[#D3A95E]'}`} 
           />
         </div>
         <span className={`font-bold text-[9px] ${isClaim || isDone ? 'text-[#78A944]' : 'text-[#7A6C56]'}`}>{progress}</span>
      </div>
      
      {isDone ? (
        <button disabled className="w-full bg-[#EAE0CB] text-[#8C7A5E] font-extrabold text-[10px] py-[3px] rounded-[8px] border border-[#CBB58B]">
          Done
        </button>
      ) : isClaim ? (
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onClick} 
          className="w-full bg-[#7CAE41] hover:bg-[#689439] text-white font-extrabold text-[10px] py-[3px] rounded-[8px] transition-all"
        >
          Claim
        </motion.button>
      ) : (
        <button disabled className="w-full bg-white text-[#5C8925] font-extrabold text-[10px] py-[3px] rounded-[8px] border border-[#DCD1AD] opacity-50">
          GO
        </button>
      )}
    </motion.div>
  );
}

const BADGE_VISUALS: Record<string, any> = {
  fire: { icon: <Flame className="w-[24px] h-[24px] text-white" strokeWidth={1.5} fill="white" />, colors: 'from-[#E4A034] to-[#C96C11]', emoji: '🔥' },
  nature: { icon: <Leaf className="w-[24px] h-[24px] text-white" strokeWidth={1.5} fill="white" />, colors: 'from-[#77AB3F] to-[#43741B]', emoji: '🍃' },
  trail: { icon: <Tent className="w-[24px] h-[24px] text-white" strokeWidth={1.5} fill="currentColor" />, colors: 'from-[#5687C2] to-[#2B578C]', emoji: '🏕️' },
  fish: { icon: '🎣', emoji: '🎣', colors: 'from-[#5687C2] to-[#2B578C]' },
  cook: { icon: '🥘', emoji: '🥘', colors: 'from-[#E4A034] to-[#C96C11]' },
  wood: { icon: '🪵', emoji: '🪵', colors: 'from-[#A67B5B] to-[#7A543A]' },
  beast: { icon: '🐾', emoji: '🐾', colors: 'from-[#77AB3F] to-[#43741B]' },
  forage: { icon: '🍄', emoji: '🍄', colors: 'from-[#C23B22] to-[#8A2411]' },
  night: { icon: '🦉', emoji: '🦉', colors: 'from-[#56227B] to-[#361351]' },
};

function BadgesTab({ badges }: any) {
  const earnedCount = badges.filter((b: any) => b.type === 'earned').length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-12 flex flex-col gap-6 relative z-10 w-full mb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-[#3A5025] font-extrabold text-[24px] tracking-tight mb-1">Badges</h2>
            <p className="text-[#8C7A5E] text-[14px] font-medium">{earnedCount} of {badges.length} collected</p>
         </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#DCCCAD]">
          <div className="grid grid-cols-3 gap-y-10 gap-x-4 justify-items-center">
             {badges.map((badge: any) => (
                <BadgeTile key={badge.id} {...badge} />
             ))}
          </div>
      </div>
    </div>
  );
}

function BadgeTile({ id, name, progress, type }: any) {
  const isEarned = type === 'earned';
  const isLocked = type === 'locked';
  const visual = BADGE_VISUALS[id] || { emoji: '❔' };
  const { icon = visual.emoji, colors = '', emoji = visual.emoji } = visual;
  
  const handleClick = (e: React.MouseEvent) => {
    if (isEarned) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([20, 30, 20]);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { x, y },
        colors: ['#E4A034', '#F3D581', '#ffffff'],
        disableForReducedMotion: true,
        ticks: 60,
      });
    } else if (!isLocked) {
       if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
    }
  };

  return (
    <div onClick={handleClick} className="flex flex-col items-center justify-start relative group w-full max-w-[80px] cursor-pointer">
       
       <div className={`relative w-[64px] h-[64px] rounded-full flex items-center justify-center mb-3 shrink-0 transition-transform group-hover:scale-105 active:scale-95
          ${isEarned ? 'shadow-sm bg-white border border-[#DCCCAD]' : isLocked ? 'bg-[#EAE0CB] border border-dashed border-[#C5B79F]' : 'bg-[#F4E8D1] border border-[#DECAAA]'}`}>
          
          {!isLocked && !isEarned && (
             <svg className="absolute inset-[-2px] w-[64px] h-[64px] -rotate-90 pointer-events-none drop-shadow-sm">
                <circle cx="32" cy="32" r="30" fill="none" stroke="#DCCCAD" strokeWidth="4" />
                <circle cx="32" cy="32" r="30" fill="none" stroke="#E4A034" strokeWidth="4" strokeDasharray="188" strokeDashoffset={188 - (188 * progress) / 100} strokeLinecap="round" />
             </svg>
          )}

          {isEarned ? (
             <div className={`w-[52px] h-[52px] rounded-full bg-gradient-to-br ${colors} flex items-center justify-center relative overflow-hidden`}>
                <div className="relative z-10">{icon}</div>
             </div>
          ) : isLocked ? (
             <span className="text-[28px] opacity-[0.3] grayscale-[70%]">{emoji}</span>
          ) : (
             <div className={`w-[52px] h-[52px] rounded-full bg-gradient-to-br ${colors} flex items-center justify-center opacity-[0.85] grayscale-[15%]`}>
                {icon}
             </div>
          )}

          {isEarned && (
             <div className="absolute -bottom-1 -right-1 z-20 w-[20px] h-[20px] bg-[#E4A034] rounded-full shadow-sm flex items-center justify-center border-[2px] border-white text-white">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={4} />
             </div>
          )}

          {isLocked && (
             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 z-10 w-[20px] h-[20px] bg-[#A49C8B] rounded-full flex items-center justify-center border-[2px] border-[#F4E8D1]">
                <Lock className="w-2.5 h-2.5 text-white" strokeWidth={3} />
             </div>
          )}
       </div>

       <div className="text-center w-full px-1">
          <h4 className={`font-medium text-[11px] leading-tight line-clamp-2 ${isLocked ? 'text-[#A49C8B]' : 'text-[#3A5025]'}`}>{name}</h4>
          {!isLocked && !isEarned && (
             <span className="text-[#D58C28] font-bold text-[10px] mt-1 block bg-white rounded-full px-2 py-0.5 border border-[#E9DBB8] mx-auto w-fit shadow-sm">{progress}%</span>
          )}
       </div>
    </div>
  );
}

const SCOUT_VISUALS: Record<string, any> = {
  s1: { emoji: '🦊', color: 'from-[#E4A034] to-[#C96C11]', bg: 'bg-[#F2C94C]', border: 'border-[#C96C11]' },
  s2: { emoji: '🦌', color: 'from-[#77AB3F] to-[#43741B]', bg: 'bg-[#A2C259]', border: 'border-[#43741B]' },
  s3: { emoji: '🐻', color: 'from-[#5687C2] to-[#2B578C]', bg: 'bg-[#8BB2E5]', border: 'border-[#2B578C]' },
  s4: { emoji: '🐰', color: 'from-[#D96B6B] to-[#B04545]', bg: 'bg-[#E58B8B]', border: 'border-[#B04545]' },
  s5: { emoji: '🦦', color: 'from-[#5D9C88] to-[#2A6653]', bg: 'bg-[#7EC2AD]', border: 'border-[#2A6653]' },
};

function ScoutsTab({ scouts }: any) {
  const displayScouts = Array.from({ length: 6 }).map((_, i) => scouts[i] ? { ...scouts[i], ...SCOUT_VISUALS[scouts[i].id] } : { locked: true, name: 'Empty', role: 'Vacant', level: 0, emoji: '+' });

  return (
    <div className="flex-1 min-h-0 relative flex flex-col mb-2 w-full px-1 pt-1">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 pb-12 flex flex-col gap-4 relative z-10 w-full">
      <div className="px-2 pt-2 mb-1">
         <h2 className="text-[#304811] font-extrabold text-[20px] tracking-tight">Scouts</h2>
      </div>

      {/* Team Summary */}
      <div className="bg-[#FEFCF3] rounded-2xl p-3 shadow-sm border border-[#DBC19C] flex justify-between items-center relative mx-1">
         <div className="flex flex-col z-10">
            <h3 className="text-[#304811] font-extrabold text-[15px] tracking-tight">Team Overview</h3>
            <span className="text-[#7A6C56] text-[12px] font-bold">{scouts.length} / 6 Recruited</span>
         </div>
         <div className="flex gap-4 z-10">
             <div className="flex flex-col items-end">
                <span className="text-[#A48F70] text-[9.5px] font-extrabold uppercase">Power</span>
                <span className="text-[#D58C28] font-black text-[15px] leading-tight flex items-center gap-1">{scouts.reduce((sum: number, s: Scout) => sum + s.level * 10, 0)} <span className="text-[12px]">⚔️</span></span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[#A48F70] text-[9.5px] font-extrabold uppercase">Energy</span>
                <span className="text-[#659131] font-black text-[15px] drop-shadow-sm leading-tight mt-[1px]">78% <span className="text-xs">⚡</span></span>
             </div>
         </div>
      </div>

      {/* Scout List */}
      <div className="flex flex-col gap-3 px-1 mt-1 pb-8">
         {displayScouts.map((scout, i) => (
             <div key={i} className={`bg-white p-3 shadow-sm rounded-[16px] border ${scout.locked ? 'border-[#EAE0CB] opacity-70 cursor-not-allowed' : 'border-[#E8E4D9] hover:shadow-md cursor-pointer hover:-translate-y-0.5'} flex items-center gap-3 relative transition-all active:scale-[0.98]`}>
                 
                 <div className={`w-[56px] h-[56px] flex-shrink-0 flex items-center justify-center rounded-[14px] border relative overflow-hidden ${scout.locked ? 'bg-[#EAE0CB] border-[#DCCCAD]' : `bg-gradient-to-br ${scout.color || ''} border-white shadow-inner`}`}>
                     {!scout.locked && <div className="absolute inset-0 opacity-[0.1]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '6px 6px'}}></div>}
                     {scout.locked ? (
                         <Lock className="w-5 h-5 text-[#A49C8B] opacity-50" strokeWidth={2.5}/>
                     ) : (
                         <div className="text-[32px] drop-shadow-sm z-10 font-emoji">{scout.emoji}</div>
                     )}
                 </div>
                 
                 {scout.locked ? (
                     <div className="flex-1 min-w-0">
                         <div className="font-extrabold text-[#A49C8B] text-[15px] opacity-70">Vacant Tent</div>
                         <span className="text-[#A49C8B] text-[11px] font-bold opacity-60">Unlock at next level</span>
                     </div>
                 ) : (
                     <div className="flex-1 min-w-0 flex flex-col justify-center relative">
                         {scout.assignedTo && (
                             <span className="absolute right-0 bottom-0 text-[10px] font-black text-[#E4A034] bg-[#FFF9EA] px-2 py-0.5 rounded-md border border-[#E9DBB8] shrink-0 uppercase tracking-wide">
                               Working
                             </span>
                         )}
                         <div className="flex justify-between items-start mb-0.5">
                             <h4 className="font-extrabold text-[#2A4418] text-[16px] leading-tight truncate pr-2">{scout.name}</h4>
                             <div className="bg-[#FEFCF3] border border-[#E2D2B6] text-[#5C8925] font-extrabold text-[10px] px-1.5 py-0.5 rounded-md leading-none shrink-0 shadow-sm mt-0.5">L.{scout.level}</div>
                         </div>
                         <span className="font-bold text-[#A48F70] text-[11.5px] block leading-none mb-1.5 truncate uppercase tracking-wide">{scout.role}</span>
                         <span className="text-[#78A944] bg-[#F1F6EC] text-[10.5px] font-bold px-2 py-1 rounded inline-block w-fit truncate max-w-full">✨ {scout.ability}</span>
                     </div>
                 )}
             </div>
         ))}
      </div>
      </div>
    </div>
  );
}

function ShopTab() {
  const dailyDeals = [
    { name: 'Sturdy Axe', type: 'Tool', price: 450, prevPrice: 600, emoji: '🪓', color: 'from-[#D46C6C] to-[#B84E4E]' },
    { name: 'Ration Pack', type: 'Food', price: 120, prevPrice: 200, emoji: '🥫', color: 'from-[#77AB3F] to-[#43741B]' },
  ];

  const upgrades = [
    { name: 'Canvas Tent', desc: '+2 Max Scouts', price: 1200, emoji: '⛺', locked: false },
    { name: 'Steel Rod', desc: 'Better Fish', price: 850, emoji: '🎣', locked: false },
    { name: 'Field Guide', desc: '+10% XP', price: 2000, emoji: '📖', locked: true },
  ];

  return (
    <div className="flex-1 min-h-0 relative flex flex-col w-full px-2 pt-2 mb-2">
      {/* Background */}
      <div className="absolute inset-x-2 top-0 bottom-0 bg-[#F4E8D1] shadow-[inset_0_4px_12px_rgba(180,140,90,0.15)] -z-10 rounded-[20px] border-[1.5px] border-[#DECAAA]"></div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-4 pb-12 flex flex-col gap-6 relative z-10 w-full rounded-[20px]">

      {/* Header */}
      <div className="flex items-center justify-between px-1">
         <div>
            <h2 className="text-[#3A5025] font-black text-[28px] tracking-tight mb-1 font-serif uppercase">Post</h2>
            <p className="text-[#8C7A5E] text-[14px] font-bold">Trading Post & Upgrades</p>
         </div>
         <div className="w-12 h-12 bg-[#FEFCF8] rounded-full shadow-sm flex items-center justify-center border-[2px] border-[#DECAAA]">
            <Store className="text-[#D58C28] w-6 h-6" strokeWidth={2.2} />
         </div>
      </div>

      {/* Daily Deals (Wooden Sign Board Style) */}
      <div className="relative mx-1">
         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5E3F24] px-4 py-1 rounded-[4px] border-[2px] border-[#4A3219] z-10 shadow-md transform -rotate-1">
            <span className="text-[#F3D581] font-black text-[12px] uppercase tracking-wider">Daily Deals</span>
         </div>
         <div className="bg-[#8A603C] rounded-[16px] p-4 pt-6 shadow-[0_6px_16px_rgba(0,0,0,0.3),_inset_0_2px_4px_rgba(255,255,255,0.15)] border-[2px] border-[#4A3219] flex gap-3 overflow-x-auto hide-scrollbar relative">
             {/* Wood texture overlay */}
             <div className="absolute inset-0 opacity-[0.2]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, #000 10px, #000 12px)'}}></div>

             {dailyDeals.map((deal, i) => (
                <div key={i} className="min-w-[140px] bg-[#FEFCF3] rounded-[12px] p-3 shadow-inner border-[1.5px] border-[#C19A6B] relative z-10 flex flex-col items-center flex-1">
                    <div className="absolute top-2 left-2 flex gap-1">
                       <span className="w-2.5 h-2.5 rounded-full bg-[#C23B22] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-[#8A2411]"></span>
                    </div>
                    <div className={`w-[56px] h-[56px] rounded-full bg-gradient-to-br ${deal.color} border-[2px] border-[#FEFCF3] shadow-md flex items-center justify-center text-[28px] mb-2`}>
                       {deal.emoji}
                    </div>
                    <h4 className="font-extrabold text-[#3E2813] text-[14px] leading-tight text-center">{deal.name}</h4>
                    <span className="text-[#A48F70] text-[10px] font-bold mb-2 uppercase">{deal.type}</span>
                    
                    <button className="w-full bg-[#F3D581] hover:bg-[#E4B14B] active:bg-[#C9912F] text-[#5E3F24] font-black text-[13px] py-1.5 rounded-[8px] border-[1.5px] border-[#D4A373] shadow-sm transform active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-auto">
                       <span className="line-through text-[#A48F70] text-[10px] opacity-70">{deal.prevPrice}</span>
                       <span>{deal.price} <span className="text-[10px]">🪙</span></span>
                    </button>
                </div>
             ))}
         </div>
      </div>

      {/* Upgrades */}
      <div className="px-1 flex flex-col gap-3">
         <h3 className="text-[#2A4418] font-black text-[16px] uppercase tracking-wide ml-1 border-b-[2px] border-[#DCCCAD] pb-1 inline-block w-fit">Camp Upgrades</h3>
         
         {upgrades.map((item, i) => (
             <div key={i} className={`bg-[#FEFcf5] p-3 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-[1.5px] flex items-center gap-3 relative overflow-hidden ${item.locked ? 'border-[#EAE0CB] opacity-70' : 'border-[#DCCCAD]'}`}>
                 <div className={`w-[52px] h-[52px] rounded-[12px] flex items-center justify-center text-[24px] shrink-0 shadow-inner border-[1.5px] ${item.locked ? 'bg-[#EAE0CB] border-[#DCCCAD]' : 'bg-[#EFE9DA] border-[#DCCCAD]'}`}>
                    {item.emoji}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h4 className={`font-extrabold text-[15px] leading-tight truncate ${item.locked ? 'text-[#8C7A5E]' : 'text-[#2A4418]'}`}>{item.name}</h4>
                       {item.locked && <Lock className="w-3 h-3 text-[#A49C8B]" strokeWidth={3} />}
                    </div>
                    <p className="text-[#8C7A5E] text-[12px] font-bold mb-1">{item.desc}</p>
                 </div>

                 <button className={`shrink-0 flex items-center justify-center gap-1 px-3 py-1.5 rounded-[12px] font-extrabold text-[13px] border-[1.5px] shadow-sm transform active:scale-95 transition-all ${item.locked ? 'bg-[#F4E8D1] border-[#DECAAA] text-[#A49C8B]' : 'bg-[#FEFCF3] border-[#78A944] text-[#5C8925]'}`}>
                    {item.price} <span className="text-[11px]">🪙</span>
                 </button>
             </div>
         ))}
      </div>

    </div>
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab }: any) {
  return (
    <div className="w-full bg-[#F5EAD4] flex justify-between items-center px-4 py-2 flex-grow-0 pb-5 md:pb-3 md:rounded-b-[36px] z-30 border-t border-[#E8D9BB] relative">
      <NavItem icon={<Tent className="w-[20px] h-[20px]" fill="currentColor" strokeWidth={1.5} />} label="Camp" active={activeTab === 'Camp'} onClick={() => setActiveTab('Camp')} />
      <NavItem icon={<ClipboardList className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Missions" active={activeTab === 'Missions'} onClick={() => setActiveTab('Missions')} />
      <NavItem icon={<Award className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Badges" active={activeTab === 'Badges'} onClick={() => setActiveTab('Badges')} />
      <NavItem icon={<User className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Scouts" active={activeTab === 'Scouts'} onClick={() => setActiveTab('Scouts')} />
      <NavItem icon={<Store className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Shop" active={activeTab === 'Shop'} onClick={() => setActiveTab('Shop')} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.85 }}
      onClick={onClick} 
      className={`relative flex flex-col items-center justify-center w-[58px] py-[7px] cursor-pointer transition-colors ${active ? 'text-[#364F10]' : 'text-[#968972] hover:text-[#7A6C56]'}`}
    >
      {active && (
        <motion.div 
          layoutId="tabIndicator"
          className="absolute inset-x-0 -top-1 bottom-0 bg-[#EFE8D0] border border-[#DCD1AD] shadow-sm rounded-xl z-0"
        />
      )}
      <div className="relative z-10 flex flex-col items-center gap-[4px] mt-0.5">
        <motion.div animate={active ? { y: -2 } : { y: 0 }}>
          {icon}
        </motion.div>
        <span className="text-[9.5px] font-extrabold tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
}

