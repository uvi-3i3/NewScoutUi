import React, { useState } from 'react';
import { 
  Bell, Plus, ArrowUp, CheckCircle2, Clock, 
  Lock, Tent, ClipboardList, Award, Store,
  Flame, Leaf, ChevronRight, Minus, User
} from 'lucide-react';

export default function App() {
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
            <CampLevel config={config} />
          </div>
          
          <div className="px-4 mb-2 flex-1 min-h-0 relative z-10 flex flex-col">
            <ActivitiesMap config={config} />
          </div>

          <div className="px-5 pb-3 flex-shrink-0">
             <BadgesSection config={config} />
          </div>

          <div className="flex-shrink-0">
            <BottomNav />
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

function BottomNav() {
  return (
    <div className="w-full bg-[#F5EAD4] flex justify-between items-center px-4 py-2 pb-5 md:pb-3 md:rounded-b-[36px] z-30 overflow-x-hidden shadow-[0_-12px_24px_rgba(160,130,90,0.15),_inset_0_2px_4px_rgba(255,255,255,0.9)] border-t-[2px] border-[#E8D9BB] relative">
      <NavItem icon={<Tent className="w-[20px] h-[20px]" fill="currentColor" strokeWidth={1.5} />} label="Camp" active />
      <NavItem icon={<ClipboardList className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Missions" />
      <NavItem icon={<Award className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Badges" />
      <NavItem icon={<User className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Scouts" />
      <NavItem icon={<Store className="w-[20px] h-[20px]" strokeWidth={2.2} />} label="Shop" />
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center justify-center w-[58px] py-[7px] cursor-pointer transform active:scale-95 transition-all ${active ? 'text-[#364F10]' : 'text-[#968972] hover:text-[#7A6C56]'}`}>
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

