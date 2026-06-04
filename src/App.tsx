import React, { useState } from 'react';
import { 
  Bell, Plus, ArrowUp, CheckCircle2, Clock, 
  Lock, Tent, ClipboardList, Award, Store,
  Flame, Leaf, ChevronRight, Minus, User
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Camp');
  const [config, setConfig] = useState({
    title: 'SCOUTS',
    coins: '12,840',
    wood: '3,420',
    food: '2,160',
    campLvl: 3,
    campXp: 620,
    fireBadge: 70,
    natureBadge: 40,
    activity1Time: '4m 12s left'
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-4 bg-[#EBE9E4] relative overflow-hidden">
      {/* Main App Container */}
      <div 
        className="w-full h-screen md:h-[760px] md:max-w-[360px] bg-[#FCF8ED] md:rounded-[36px] overflow-hidden md:shadow-[0_45px_100px_-20px_rgba(100,80,60,0.4)] flex flex-col font-sans relative md:scale-[0.87] transition-all origin-center"
      >
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full">
          <div className="flex-shrink-0">
            <Header config={config} />
            <ResourceBar config={config} />
          </div>
          
          {activeTab === 'Camp' && (
            <>
              <div className="flex-shrink-0">
                <CampLevel config={config} />
              </div>
              <div className="px-4 mb-2 flex-1 min-h-0 relative z-10 flex flex-col">
                <ActivitiesMap config={config} />
              </div>
              <div className="px-5 pb-3 flex-shrink-0">
                <BadgesSection config={config} />
              </div>
            </>
          )}

          {activeTab === 'Missions' && (
            <MissionsTab />
          )}

          {activeTab === 'Badges' && (
            <BadgesTab />
          )}

          {activeTab === 'Scouts' && (
            <ScoutsTab />
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

function Header({ config }: any) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-[36px] h-[36px] bg-gradient-to-br from-[#A2C259] to-[#608722] rounded-[8px] flex items-center justify-center shadow-sm border-[1.5px] border-[#385315] relative overflow-hidden">
          <div className="absolute inset-0 border-[1.5px] border-[#D8EB9A] rounded-[6px] opacity-30 pointer-events-none"></div>
          <span className="text-[18px] drop-shadow-md relative z-10 leading-none pb-0.5">⚜️</span>
        </div>
        <h1 className="text-[20px] font-extrabold tracking-tight text-[#1E3310] uppercase">{config.title}</h1>
      </div>
      <div className="relative mr-1">
        <Bell className="w-[24px] h-[24px] text-[#A67E51]" fill="#A67E51" strokeWidth={1.5} />
        <div className="absolute -top-0.5 -right-0.5 w-[10px] h-[10px] bg-[#DD5F22] border-[1.5px] border-[#FCF8ED] rounded-full shadow-sm"></div>
      </div>
    </div>
  );
}

function ResourceBar({ config }: any) {
  return (
    <div className="flex items-center gap-2 px-4 mb-2 shrink-0">
      <div className="flex items-center justify-center bg-[#FEFCF3] rounded-[10px] py-1 px-2.5 flex-1 border-[1.5px] border-[#E2CBA3] shadow-[0_4px_10px_rgba(180,140,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.8)] transition-all hover:scale-[1.02] cursor-pointer">
        <div className="w-[14px] h-[14px] bg-gradient-to-br from-[#F5CB50] to-[#E29D1D] rounded-[4px] flex items-center justify-center border border-[#BA7810] shadow-[inset_0_1px_rgba(255,255,255,0.4)] mr-1.5">
           <span className="text-[7px] text-white">⚜️</span>
        </div>
        <span className="font-extrabold text-[#383222] text-[11px] truncate">{config.coins}</span>
      </div>
      <div className="flex items-center justify-center bg-[#FEFCF3] rounded-[10px] py-1 px-2 flex-1 border-[1.5px] border-[#E2CBA3] shadow-[0_4px_10px_rgba(180,140,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.8)] transition-all hover:scale-[1.02] cursor-pointer">
        <span className="text-[14px] mr-1 drop-shadow-sm leading-none pt-0.5">🪵</span>
        <span className="font-extrabold text-[#383222] text-[11px] truncate">{config.wood}</span>
      </div>
      <div className="flex items-center justify-between bg-[#FEFCF3] rounded-[10px] py-[3px] pr-1 pl-2 flex-1 border-[1.5px] border-[#E2CBA3] shadow-[0_4px_10px_rgba(180,140,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.8)] transition-all hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center">
          <span className="text-[13px] mr-1 drop-shadow-sm leading-none pt-[1px]">🍞</span>
          <span className="font-extrabold text-[#383222] text-[11px] truncate">{config.food}</span>
        </div>
        <div className="w-[18px] h-[18px] bg-[#E1DBCA] rounded-[6px] flex items-center justify-center text-[#556F37] hover:bg-[#D5CCAB] transition-colors shadow-sm shrink-0">
          <Plus className="w-[12px] h-[12px]" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

function CampLevel({ config }: any) {
  const percent = Math.min(100, Math.max(0, (Number(config.campXp) / 1000) * 100));

  return (
    <div className="px-4 mb-3 shrink-0">
      <div className="bg-[#FEFCF3] rounded-[16px] py-[10px] px-3 shadow-[0_6px_16px_rgba(180,140,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.8)] border-[1.5px] border-[#DFCA9F] flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]">
        <div className="flex items-center gap-3">
          <div className="relative w-[54px] h-[50px] flex items-center justify-center text-[42px] drop-shadow-md ml-1">
             <span className="absolute -left-2 top-0 text-[15px] drop-shadow-sm">🌲</span>
             🏕️
             <span className="absolute space-x-1 bottom-0 -right-1 text-[12px]">🔥</span>
             <span className="absolute -top-1 right-1 text-[18px]">🌲</span>
          </div>
          <div className="pl-2 flex flex-col justify-center pb-0.5">
            <h2 className="text-[#203411] font-extrabold text-[19px] tracking-tight leading-tight flex items-center gap-1 mb-1 relative">
              <span className="text-[#B9C694] text-[15px] absolute -left-[20px] top-[1px]">🌿</span>
              Camp Level {config.campLvl}
              <span className="text-[#B9C694] text-[15px] transform scale-x-[-1] absolute -right-[20px] top-[1px]">🌿</span>
            </h2>
            <div className="flex flex-col gap-1 mt-0.5">
              <span className="text-[#695F4D] text-[10px] font-extrabold tracking-wide">{config.campXp} / 1000 XP</span>
              <div className="w-[115px] h-[6px] bg-[#DED6BC] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                <div className="bg-[#659131] h-full rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <button className="relative shrink-0 bg-gradient-to-b from-[#7CAE41] to-[#5C8925] hover:from-[#84B947] hover:to-[#619027] active:scale-95 transition-all flex items-center justify-center w-[44px] h-[44px] rounded-[14px] border-[1.5px] border-[#2A4315] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),_inset_0_-2px_0_rgba(0,0,0,0.25),_0_4px_10px_rgba(92,137,37,0.4)] outline-none mr-1 cursor-pointer group">
          <ArrowUp className="w-[20px] h-[20px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] group-hover:-translate-y-0.5 transition-transform duration-200" strokeWidth={4} />
        </button>
      </div>
    </div>
  );
}

function ActivitiesMap({ config }: any) {
  const activities = [
    { name: 'Campfire', emoji: '🔥', type: 'ready' },
    { name: 'Foraging Bush', emoji: '🍒', type: 'active', status: config.activity1Time },
    { name: 'Wood Pile', emoji: '🪵', type: 'empty' },
    { name: 'Cooking Pot', emoji: '🥘', type: 'ready' },
    { name: 'Tent Area', emoji: '💤', type: 'resting' },
    { name: 'Fishing Pond', emoji: '🎣', type: 'locked' },
    { name: 'Mushroom Patch', emoji: '🍄', type: 'ready' },
    { name: 'Lookout Tower', emoji: '🔭', type: 'locked' },
    { name: 'Honey Bear', emoji: '🍯', type: 'empty' },
  ];

  return (
    <div className="bg-[#F1E4C3] rounded-[22px] p-3 pt-3.5 pb-2.5 relative overflow-hidden shadow-[0_6px_16px_rgba(180,140,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.5)] border-[1.5px] border-[#DBC19C] flex-1 min-h-0 flex flex-col justify-start saturate-150">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Decorative SVG trail background */}
      <svg className="absolute inset-0 w-full h-full text-[#DCC79D] pointer-events-none z-0" style={{ opacity: 1 }}>
        <path d="M -10 50 Q 80 15 160 80 T 380 60" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6"/>
        <path d="M 20 180 Q 140 220 200 150 T 380 190" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6"/>
        <path d="M -20 300 Q 90 270 180 340 T 400 300" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6"/>
      </svg>
      {/* Tiny decorative flowers/trees */}
      <span className="absolute top-8 right-8 text-[#FFF6DB] text-[10px] z-0 drop-shadow-sm">✿ ✿</span>
      <span className="absolute top-6 left-[35%] text-[#FFF6DB] text-[11px] z-0 drop-shadow-sm">✿</span>
      <span className="absolute top-[48%] left-6 text-white text-[10px] opacity-80 z-0 drop-shadow-sm">❀</span>
      <span className="absolute bottom-10 right-20 text-white text-[12px] opacity-90 z-0 drop-shadow-sm">✿</span>
      <span className="absolute bottom-[20%] left-4 text-[#8C9A69] text-[13px] z-0 opacity-90 drop-shadow-sm">🌿</span>
      <span className="absolute top-3 left-2 text-[#7A8A56] text-sm z-0 drop-shadow-sm">🌲</span>
      <span className="absolute bottom-1 right-2 text-[#7A8A56] text-2xl z-0 drop-shadow-sm opacity-95">🌲</span>
      
      {/* Wooden Signpost near bottom right */}
      <div className="absolute bottom-3 right-6 text-[18px] z-0 drop-shadow-sm">🪧</div>

      <div className="flex items-center gap-2 mb-3 relative z-10 px-2 shrink-0 mt-1">
        <h2 className="text-[#304811] font-extrabold text-[17px] tracking-tight drop-shadow-sm">Camp Activities</h2>
      </div>

      <div className="flex flex-wrap justify-start content-start gap-[14px] relative z-10 px-2 mt-2">
        {activities.map((act) => (
          <ActivityCard key={act.name} {...act} />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ emoji, type }: any) {
  const isActive = type === 'active';
  const isLocked = type === 'locked';
  
  return (
    <div className={`relative flex flex-col items-center justify-center bg-[#FEFCF3] w-[64px] h-[64px] rounded-[16px] shadow-[0_4px_8px_rgba(180,140,90,0.15),_inset_0_-3px_0_rgba(180,140,90,0.1),_inset_0_2px_4px_rgba(255,255,255,0.9)] border-[1.5px] ${isActive ? 'border-[#78A944] shadow-[0_4px_12px_rgba(120,169,68,0.35),_inset_0_-3px_0_rgba(120,169,68,0.15),_inset_0_2px_4px_rgba(255,255,255,0.9)] z-10 bg-white' : 'border-[#D1B88B] hover:bg-white hover:border-[#BEA273] hover:shadow-[0_4px_10px_rgba(180,140,90,0.22),_inset_0_-3px_0_rgba(180,140,90,0.1)]'} ${isLocked ? 'opacity-70 grayscale-[40%] hover:opacity-70 cursor-not-allowed' : 'cursor-pointer'} transition-all group`}>
      
      {/* Tiny corner indicators */}
      {type === 'ready' && (
        <div className="absolute -top-1.5 -right-1.5 bg-[#78A944] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={4} />
        </div>
      )}
      {type === 'active' && (
        <div className="absolute -top-1.5 -right-1.5 bg-[#78A944] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]">
          <Clock className="w-3 h-3" strokeWidth={3.5} />
        </div>
      )}
      {type === 'empty' && (
        <div className="absolute -top-1.5 -right-1.5 bg-[#A49C8B] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]">
          <Minus className="w-3 h-3" strokeWidth={4} />
        </div>
      )}
      {type === 'resting' && (
        <div className="absolute -top-1.5 -right-1.5 bg-[#5687C2] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]">
          <span className="text-[11px] font-extrabold pb-[1px] leading-none">Z</span>
        </div>
      )}
      {type === 'locked' && (
        <div className="absolute -top-1.5 -right-1.5 bg-[#8C8677] text-white rounded-[7px] w-[20px] h-[20px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.4)] z-20 border-[1.5px] border-[#FEFCF3]">
          <Lock className="w-3 h-3" strokeWidth={3} />
        </div>
      )}
      
      {/* Centered Emoji */}
      <span className={`text-[32px] drop-shadow-md transition-transform hover:scale-110 active:scale-[0.95] ${isLocked ? 'opacity-60' : ''}`}>
        {emoji}
      </span>

    </div>
  );
}

function BadgesSection({ config }: any) {
  return (
    <div className="flex justify-between items-center px-1 gap-2 border border-transparent bg-transparent pb-1">
      {/* Fire Badge */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-[#E4A034] to-[#C96C11] rounded-[8px] flex items-center justify-center shadow-[0_3px_6px_rgba(228,160,52,0.3),_inset_0_1px_2px_rgba(255,255,255,0.4)] border-[1.5px] border-[#FCF8ED]">
          <Flame className="w-[16px] h-[16px] text-white drop-shadow-sm" fill="white" strokeWidth={1} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9.5px] font-extrabold text-[#2A4418] truncate leading-tight">Fire Badge</p>
          <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-full bg-[#EADFBD] h-[3.5px] rounded-full overflow-hidden shadow-inner flex-1">
                <div className="bg-[#DB8D1E] h-full rounded-full shadow-[inset_0_1px_rgba(255,255,255,0.2)]" style={{ width: `${config.fireBadge}%` }}></div>
             </div>
             <span className="text-[8.5px] font-bold text-[#867B66] leading-none">{config.fireBadge}%</span>
          </div>
        </div>
      </div>
      
      <div className="w-[1px] h-6 bg-[#EACD9B] shrink-0 mx-0.5"></div>

      {/* Nature Badge */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-[#77AB3F] to-[#43741B] rounded-[8px] flex items-center justify-center shadow-[0_3px_6px_rgba(119,171,63,0.3),_inset_0_1px_2px_rgba(255,255,255,0.4)] border-[1.5px] border-[#FCF8ED]">
          <Leaf className="w-[16px] h-[16px] text-white drop-shadow-sm" fill="white" strokeWidth={1} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9.5px] font-extrabold text-[#2A4418] truncate leading-tight">Nature Badge</p>
          <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-full bg-[#EADFBD] h-[3.5px] rounded-full overflow-hidden shadow-inner flex-1">
                <div className="bg-[#78A944] h-full rounded-full shadow-[inset_0_1px_rgba(255,255,255,0.2)]" style={{ width: `${config.natureBadge}%` }}></div>
             </div>
             <span className="text-[8.5px] font-bold text-[#867B66] leading-none">{config.natureBadge}%</span>
          </div>
        </div>
      </div>

      <div className="w-[1px] h-6 bg-[#EACD9B] shrink-0 mx-0.5"></div>

      {/* Next Unlock */}
      <div className="flex items-center gap-1.5 shrink-0">
         <div className="w-8 h-8 bg-[#E6D9B4] rounded-[8px] flex items-center justify-center text-[#958362] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),_0_1px_1px_rgba(255,255,255,0.7)] border border-[#CBB58B]">
            <Award className="w-[16px] h-[16px] drop-shadow-sm" fill="currentColor" strokeWidth={1.5} />
         </div>
         <div className="flex flex-col justify-center">
            <p className="text-[7.5px] font-extrabold uppercase tracking-wide text-[#908670] leading-none mb-[1px]">Next Unlock</p>
            <p className="text-[9px] font-extrabold text-[#2A4418] leading-tight">Fisher Badge</p>
            <p className="text-[7.5px] font-bold text-[#A29780] leading-none mt-[1px]">at Level 5</p>
         </div>
      </div>
    </div>
  );
}

function MissionsTab() {
  return (
    <div className="flex-1 min-h-0 relative flex flex-col w-full px-1 pt-1 mb-2">
      {/* Background Wooden Board */}
      <div className="absolute inset-x-2 top-0 bottom-0 bg-[#A67B5B] shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)] -z-10 rounded-[20px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          {/* Wooden panels lines */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_20%,rgba(0,0,0,0.05)_21%,transparent_22%,transparent_40%,rgba(0,0,0,0.05)_41%,transparent_42%,transparent_60%,rgba(0,0,0,0.05)_61%,transparent_62%,transparent_80%,rgba(0,0,0,0.05)_81%,transparent_82%)] rounded-[20px]"></div>
          {/* Board frame */}
          <div className="absolute inset-0 border-[6px] border-[#8B5E3C] rounded-[20px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] pointer-events-none"></div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-3 pt-3 pb-6 flex flex-col gap-3 relative z-10 w-full rounded-[20px]">

      <div className="px-3 pt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[#F5EAD4] font-extrabold text-[20px] tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Missions</h2>
          <span className="text-[#D1B88B] drop-shadow-sm text-sm">🪧</span>
        </div>
        <div className="bg-[#FEFCF3] rounded-[16px] p-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.2)] border-[1.5px] border-[#DBC19C] relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C23B22] rounded-full shadow-sm border-2 border-[#FEFCF3] z-10"></div>
          
          <div className="flex justify-between items-center mb-1.5 px-1">
             <h2 className="text-[#304811] font-extrabold text-[15px] tracking-tight">Today's Trail</h2>
             <span className="text-[#78A944] font-extrabold text-[12px]">3 / 5</span>
          </div>
          <div className="w-full h-[6px] bg-[#E5DCC2] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="bg-[#78A944] h-full rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] w-[60%]"></div>
          </div>
        </div>
      </div>

      <div className="px-3">
         {/* Featured Mission */}
         <div className="bg-[#FEFCF3] rounded-[18px] p-3 shadow-[0_4px_10px_rgba(0,0,0,0.15)] border-[1.5px] border-[#DBC19C] relative flex items-center gap-3">
           <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#E4A034] rounded-full shadow-sm border-[1.5px] border-white z-10"></div>
           <div className="absolute -top-1.5 right-4 w-3 h-3 bg-[#E4A034] rounded-full shadow-sm border-[1.5px] border-white z-10"></div>
           
           <div className="w-[60px] h-[60px] bg-[#F1E4C3] rounded-[14px] flex items-center justify-center text-[32px] border-[1.5px] border-[#DBC19C] shrink-0">
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
             <button className="bg-gradient-to-b from-[#7CAE41] to-[#5C8925] text-white font-extrabold text-[12px] px-3 py-1.5 rounded-[10px] border-[1.5px] border-[#2A4315] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),_0_2px_4px_rgba(0,0,0,0.2)] active:scale-95 transition-all outline-none">
               GO
             </button>
           </div>
         </div>
      </div>

      <div className="px-3">
        {/* Mission Grid */}
        <div className="grid grid-cols-2 gap-2.5">
           <SmallMissionCard icon="🪵" title="Gather Wood" progress="50/50" reward="100 🪙" status="claim" />
           <SmallMissionCard icon="🥘" title="Cook Meals" progress="1/2" reward="50 XP" status="go" />
           <SmallMissionCard icon="🍄" title="Find Rare" progress="0/1" reward="10 💎" status="go" />
           <SmallMissionCard icon="⛺" title="Pitch Tent" progress="0/1" reward="100 XP" status="go" />
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

function SmallMissionCard({ icon, title, progress, reward, status }: any) {
  const isClaim = status === 'claim';
  const percent = progress.includes('/') ? Math.round((parseInt(progress.split('/')[0]) / parseInt(progress.split('/')[1])) * 100) : 0;
  
  return (
    <div className={`bg-[#FEFCF3] rounded-[14px] p-2 shadow-[0_2px_6px_rgba(0,0,0,0.1)] border-[1.5px] ${isClaim ? 'border-[#78A944]' : 'border-[#DBC19C]'} relative`}>
      <div className="absolute top-1 right-1/2 translate-x-1/2 w-2 h-2 bg-[#D1B88B] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)] z-10"></div>
      
      <div className="flex items-center gap-2 mb-1.5 mt-1">
        <div className={`w-[32px] h-[32px] rounded-[10px] flex items-center justify-center text-[18px] border-[1.5px] shrink-0 ${isClaim ? 'bg-[#F2F7E6] border-[#78A944]' : 'bg-[#F1E4C3] border-[#DBC19C]'}`}>
           {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-[11px] text-[#2A4418] truncate leading-tight">{title}</h4>
          <span className="text-[#D58C28] font-extrabold text-[9px]">{reward}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
         <div className="flex-1 h-[4px] bg-[#E5DCC2] rounded-full overflow-hidden">
           <div className={`h-full rounded-full ${isClaim ? 'bg-[#78A944]' : 'bg-[#D3A95E]'}`} style={{ width: `${percent}%` }}></div>
         </div>
         <span className={`font-bold text-[9px] ${isClaim ? 'text-[#78A944]' : 'text-[#7A6C56]'}`}>{progress}</span>
      </div>
      
      {isClaim ? (
        <button className="w-full bg-gradient-to-b from-[#7CAE41] to-[#5C8925] text-white font-extrabold text-[10px] py-[3px] rounded-[8px] border-[1.2px] border-[#2A4315] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] active:scale-95 transition-all">
          Claim
        </button>
      ) : (
        <button className="w-full bg-gradient-to-b from-[#FEFCF3] to-[#EAE0CB] text-[#5C8925] font-extrabold text-[10px] py-[3px] rounded-[8px] border-[1.2px] border-[#5C8925] active:scale-95 transition-all shadow-sm">
          GO
        </button>
      )}
    </div>
  );
}

function BadgesTab() {
  const badges = [
    { name: 'Fire Maker', progress: 70, type: 'in-progress', icon: <Flame className="w-[24px] h-[24px] text-white" strokeWidth={1.5} fill="white" />, colors: 'from-[#E4A034] to-[#C96C11]', emoji: '🔥' },
    { name: 'Nature Guide', progress: 40, type: 'in-progress', icon: <Leaf className="w-[24px] h-[24px] text-white" strokeWidth={1.5} fill="white" />, colors: 'from-[#77AB3F] to-[#43741B]', emoji: '🍃' },
    { name: 'Trail Explorer', progress: 100, type: 'earned', icon: <Tent className="w-[24px] h-[24px] text-white" strokeWidth={1.5} fill="currentColor" />, colors: 'from-[#5687C2] to-[#2B578C]', emoji: '🏕️' },
    { name: 'Master Fisher', progress: 0, type: 'locked', icon: '🎣', colors: '', emoji: '🎣' },
    { name: 'Camp Cook', progress: 0, type: 'locked', icon: '🥘', colors: '', emoji: '🥘' },
    { name: 'Wood Crafter', progress: 0, type: 'locked', icon: '🪵', colors: '', emoji: '🪵' },
    { name: 'Beast Tracker', progress: 0, type: 'locked', icon: '🐾', colors: '', emoji: '🐾' },
    { name: 'Forager', progress: 0, type: 'locked', icon: '🍄', colors: '', emoji: '🍄' },
    { name: 'Night Owl', progress: 0, type: 'locked', icon: '🦉', colors: '', emoji: '🦉' },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-6 pt-6 pb-12 flex flex-col gap-6 relative z-10 w-full mb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-[#3A5025] font-black text-[28px] tracking-tight mb-1">Badges</h2>
            <p className="text-[#8C7A5E] text-[14px] font-bold">8 of 24 collected</p>
         </div>
      </div>

      {/* Grid */}
      <div className="bg-[#FEFCF8] rounded-[24px] p-6 shadow-sm border border-[#DCCCAD]">
          <div className="grid grid-cols-3 gap-y-10 gap-x-4 justify-items-center">
             {badges.map((badge, i) => (
                <BadgeTile key={i} {...badge} />
             ))}
          </div>
      </div>
    </div>
  );
}

function BadgeTile({ name, progress, type, icon, colors, emoji }: any) {
  const isEarned = type === 'earned';
  const isLocked = type === 'locked';
  
  return (
    <div className="flex flex-col items-center justify-start relative group w-full max-w-[80px] cursor-pointer">
       
       <div className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center mb-3 shrink-0 transition-transform group-hover:scale-105 active:scale-95
          ${isEarned ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)] bg-white border-[3px] border-[#FEFCF8]' : isLocked ? 'bg-[#EAE0CB] border-[2px] border-dashed border-[#C5B79F] shadow-inner' : 'bg-[#F4E8D1] border-[2px] border-[#DECAAA] shadow-sm'}`}>
          
          {!isLocked && !isEarned && (
             <svg className="absolute inset-[-2px] w-[72px] h-[72px] -rotate-90 pointer-events-none drop-shadow-sm">
                <circle cx="36" cy="36" r="34" fill="none" stroke="#DCCCAD" strokeWidth="4" />
                <circle cx="36" cy="36" r="34" fill="none" stroke="#E4A034" strokeWidth="4" strokeDasharray="213" strokeDashoffset={213 - (213 * progress) / 100} strokeLinecap="round" />
             </svg>
          )}

          {isEarned ? (
             <div className={`w-[58px] h-[58px] rounded-full bg-gradient-to-br ${colors} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.15]" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px)'}}></div>
                <div className="relative z-10">{icon}</div>
             </div>
          ) : isLocked ? (
             <span className="text-[32px] opacity-[0.3] grayscale-[70%] drop-shadow-none">{emoji}</span>
          ) : (
             <div className={`w-[58px] h-[58px] rounded-full bg-gradient-to-br ${colors} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] opacity-[0.85] grayscale-[15%]`}>
                {icon}
             </div>
          )}

          {isEarned && (
             <div className="absolute -bottom-1 -right-1 z-20 w-[24px] h-[24px] bg-[#E4A034] rounded-full shadow-md flex items-center justify-center border-[2.5px] border-white text-white">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={4} />
             </div>
          )}

          {isLocked && (
             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 z-10 w-[22px] h-[22px] bg-[#A49C8B] rounded-full shadow-sm flex items-center justify-center border-[2px] border-[#F4E8D1]">
                <Lock className="w-3 h-3 text-white" strokeWidth={3} />
             </div>
          )}
       </div>

       <div className="text-center w-full px-1">
          <h4 className={`font-extrabold text-[12px] leading-tight line-clamp-2 ${isLocked ? 'text-[#A49C8B]' : 'text-[#3A5025]'}`}>{name}</h4>
          {!isLocked && !isEarned && (
             <span className="text-[#D58C28] font-bold text-[10px] mt-1 block bg-[#FEFCF3] rounded-full px-2 py-0.5 border border-[#E9DBB8] mx-auto w-fit shadow-sm">{progress}%</span>
          )}
       </div>
    </div>
  );
}

function ScoutsTab() {
  const scouts = [
    { name: 'Oliver', role: 'Camp Leader', level: 12, emoji: '🦊', color: 'from-[#E4A034] to-[#C96C11]', bg: 'bg-[#F2C94C]', border: 'border-[#C96C11]' },
    { name: 'Mia', role: 'Forager', level: 8, emoji: '🦌', color: 'from-[#77AB3F] to-[#43741B]', bg: 'bg-[#A2C259]', border: 'border-[#43741B]' },
    { name: 'Leo', role: 'Builder', level: 6, emoji: '🐻', color: 'from-[#5687C2] to-[#2B578C]', bg: 'bg-[#8BB2E5]', border: 'border-[#2B578C]' },
    { name: 'Zoe', role: 'Cook', level: 5, emoji: '🐰', color: 'from-[#D96B6B] to-[#B04545]', bg: 'bg-[#E58B8B]', border: 'border-[#B04545]' },
    { name: 'Sam', role: 'Fisher', level: 4, emoji: '🦦', color: 'from-[#5D9C88] to-[#2A6653]', bg: 'bg-[#7EC2AD]', border: 'border-[#2A6653]' },
    { name: 'Empty', role: 'Vacant', level: 0, emoji: '+', color: 'from-[#EAE0CB] to-[#DCCCAD]', bg: 'bg-[#EAE0CB]', border: 'border-[#C5B79F]', locked: true }
  ];

  return (
    <div className="flex-1 min-h-0 relative flex flex-col mb-2 w-full px-2 pt-2 pb-1">
      {/* Background Canvas Board */}
      <div className="absolute inset-0 bg-[#536936] shadow-[inset_0_4px_16px_rgba(0,0,0,0.4)] -z-10 rounded-[18px] border-[2.5px] border-[#3B4D24] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px)'}}></div>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-2 pt-2 pb-12 flex flex-col gap-5 relative z-10 w-full rounded-[18px]">
      <div className="px-2 pt-1 mb-1">
         <h2 className="text-[#F1E4C3] font-black text-[24px] tracking-wide flex items-center gap-2 drop-shadow-md pb-0.5">
           Scout Roster
         </h2>
      </div>

      {/* Team Summary - Pinned Paper */}
      <div className="bg-[#FEF8EB] rounded-[4px] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-[#DCCCAD] flex justify-between items-center relative transform -rotate-1 mx-2">
         {/* Tape */}
         <div className="absolute top-[-8px] left-[30%] -translate-x-1/2 w-8 h-[18px] bg-[#EFE3C6] opacity-90 rotate-[-4deg] shadow-sm flex items-center justify-center overflow-hidden border border-[#DCCCAD]">
            <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
         </div>
         <div className="absolute top-[-8px] right-[20%] w-8 h-[18px] bg-[#D46C6C] opacity-80 rotate-[3deg] shadow-sm flex items-center justify-center overflow-hidden border border-[#B84E4E]">
            <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
         </div>

         <div className="flex flex-col z-10 pt-1 px-1">
            <h3 className="text-[#3A5025] font-black text-[14px] uppercase tracking-tight">Team Overview</h3>
            <span className="text-[#A48F70] text-[11px] font-bold">5 of 6 Recruited</span>
         </div>
         <div className="flex gap-4 z-10 pr-2 pt-1">
             <div className="flex flex-col items-end">
                <span className="text-[#A48F70] text-[9.5px] font-extrabold uppercase">Power</span>
                <span className="text-[#D58C28] font-black text-[15px] drop-shadow-sm leading-tight mt-[1px]">420 <span className="text-xs">⚔️</span></span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[#A48F70] text-[9.5px] font-extrabold uppercase">Energy</span>
                <span className="text-[#659131] font-black text-[15px] drop-shadow-sm leading-tight mt-[1px]">78% <span className="text-xs">⚡</span></span>
             </div>
         </div>
      </div>

      {/* Featured Scout - Large Polaroid */}
      <div className="bg-[#FEFcf5] p-3 pb-4 shadow-[0_8px_20px_rgba(0,0,0,0.5)] relative flex flex-col transform rotate-1 mx-2 mt-2 border-[1px] border-[#E8E4D9]">
         {/* Push Pin */}
         <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E4A034] shadow-[0_2px_4px_rgba(0,0,0,0.4),_inset_0_1px_2px_rgba(255,255,255,0.4)] border border-[#C96C11] z-20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60 absolute top-[2px] right-[2px]"></div>
         </div>

         <div className="w-full bg-[#EFE9DA] rounded-[2px] aspect-square border-[1.5px] border-[#DCCCAD] flex flex-col items-center justify-center relative overflow-hidden mb-3 shadow-inner">
             {/* Subtle background lines/texture */}
             <div className="absolute inset-0 opacity-[0.2]" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '8px 8px'}}></div>
             
             {/* Character */}
             <div className="text-[76px] drop-shadow-lg z-10 hover:scale-110 active:scale-95 transition-transform cursor-pointer">🦊</div>
             
             {/* Optional Nature Props */}
             <span className="absolute bottom-2 right-2 text-2xl opacity-80 filter drop-shadow-sm pointer-events-none">🌲</span>
             <span className="absolute bottom-1 left-2 text-xl opacity-80 filter drop-shadow-sm z-20 pointer-events-none">🍃</span>
         </div>
         
         <div className="w-full flex justify-between items-end px-1 mt-1">
             <div className="flex flex-col">
                <span className="font-serif italic text-[#A48F70] text-[15px] leading-none mb-1 text-left line-clamp-1">Camp Leader</span>
                <h2 className="font-black text-[28px] text-[#2A4418] leading-none tracking-tight font-serif uppercase">OLIVER</h2>
             </div>
             <div className="flex flex-col items-end pb-1 pr-1 shrink-0">
                 <div className="bg-[#3A5025] text-[#F1E4C3] px-2 py-0.5 rounded-[4px] font-black text-[14px] shadow-sm transform -rotate-2 border border-[#8BA667]">Lv. 12</div>
             </div>
         </div>
         
         <div className="w-full flex gap-2 mt-4 relative z-10">
             <button className="flex-1 bg-transparent border-[2.5px] border-[#D58C28] text-[#D58C28] font-black text-[14px] py-1.5 rounded-[8px] transform active:scale-95 transition-all outline-none">
                TRAIN
             </button>
             <button className="flex-1 bg-gradient-to-b from-[#78A944] to-[#5A8726] text-white font-black text-[14px] py-1.5 rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] border-[1px] border-[#4A731B] transform active:scale-95 transition-all outline-none">
                ASSIGN
             </button>
         </div>
      </div>

      {/* Scout Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 px-1 mt-3 pb-8">
         {scouts.slice(1).map((scout, i) => (
             <div key={i} className={`bg-[#FEFcf5] p-2 pb-3 shadow-[0_4px_12px_rgba(0,0,0,0.4)] border-[1px] border-[#E8E4D9] flex flex-col relative transform ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'} transition-transform active:scale-95 cursor-pointer hover:shadow-[0_8px_16px_rgba(0,0,0,0.5)] hover:scale-105 hover:z-20`}>
                 {/* Tape piece */}
                 <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 opacity-90 z-20 shadow-sm border border-black/10 ${i % 3 === 0 ? 'bg-[#D46C6C] rotate-[-5deg]' : i%2 === 0 ? 'bg-[#6CA8D4] rotate-[5deg]' : 'bg-[#EFE3C6] rotate-[2deg]'}`}>
                    <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                 </div>

                 <div className={`w-full aspect-square flex items-center justify-center rounded-[2px] border-[1.5px] border-[#DCCCAD] mb-2 shadow-inner relative overflow-hidden ${scout.locked ? 'bg-[#EAE0CB]' : 'bg-[#EFE9DA]'}`}>
                     {!scout.locked && <div className="absolute inset-0 opacity-[0.2]" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '6px 6px'}}></div>}
                     {scout.locked ? (
                         <Lock className="w-8 h-8 text-[#A49C8B] opacity-50" strokeWidth={2.5}/>
                     ) : (
                         <div className="text-[44px] drop-shadow-md z-10 transform translate-y-1">{scout.emoji}</div>
                     )}
                 </div>
                 
                 {scout.locked ? (
                     <div className="text-center font-serif italic text-[#A49C8B] text-[13px] opacity-70 mt-1">Vacant</div>
                 ) : (
                     <div className="flex flex-col px-1 justify-between h-full">
                         <span className="font-serif italic text-[#A48F70] text-[11px] block leading-none mb-1 text-left truncate">{scout.role}</span>
                         <div className="flex justify-between items-end mt-1">
                            <h4 className="font-black text-[#2A4418] text-[16px] leading-none uppercase tracking-tight font-serif truncate mr-1">{scout.name}</h4>
                            <div className="bg-[#3A5025] text-[#F1E4C3] font-black text-[10px] px-1.5 py-0.5 rounded-[4px] leading-tight border border-[#8BA667] shadow-sm transform -rotate-3 shrink-0">L.{scout.level}</div>
                         </div>
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
    <div className="w-full bg-[#F5EAD4] flex justify-between items-center px-4 py-2 pb-5 md:pb-3 md:rounded-b-[36px] z-30 overflow-x-hidden shadow-[0_-12px_24px_rgba(160,130,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.9)] border-t-[2px] border-[#E8D9BB] relative">
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
    <div onClick={onClick} className={`relative flex flex-col items-center justify-center w-[58px] py-[7px] cursor-pointer transform active:scale-95 transition-all ${active ? 'text-[#364F10]' : 'text-[#968972] hover:text-[#7A6C56]'}`}>
      {active && (
        <div className="absolute inset-x-0 -top-1 bottom-0 bg-[#EFE8D0] border-[1.5px] border-[#DCD1AD] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_2px_6px_rgba(180,150,100,0.15)] rounded-[14px] z-0"></div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-[4px] mt-0.5">
        {icon}
        <span className="text-[9.5px] font-extrabold tracking-wide drop-shadow-sm">{label}</span>
      </div>
    </div>
  );
}

