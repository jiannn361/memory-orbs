import React, { useState, useRef } from 'react';
import { 
  Home, Plus, PieChart, User, Camera, 
  Sparkles, Coffee, DollarSign, Shirt, 
  ChevronLeft, Check, Image as ImageIcon, Smile,
  Calendar as CalendarIcon, Archive, X, ChevronRight,
  Sun, Cloud, CloudRain, Snowflake, Music, 
  Footprints, Droplets, CheckCircle2, Circle,
  ScanFace, Share2, Edit2, PlaySquare, Type, StickyNote, Trash2
} from 'lucide-react';

// --- 設定常數 ---
const MOODS = {
  joy: { id: 'joy', name: '開心', light: '#E8D7A5', dark: '#C1A162', face: 'joy' }, // 莫蘭迪黃
  sadness: { id: 'sadness', name: '悲傷', light: '#C4D1D6', dark: '#7A909E', face: 'sadness' }, // 莫蘭迪藍
  anger: { id: 'anger', name: '憤怒', light: '#DEB3B3', dark: '#A86A6A', face: 'anger' }, // 莫蘭迪粉/磚紅
  disgust: { id: 'disgust', name: '厭惡', light: '#C3D1B6', dark: '#869971', face: 'disgust' }, // 莫蘭迪綠
};

const INITIAL_MEMORIES = [
  { 
    id: 1, date: '2026-06-15', mood: 'joy', 
    text: '今天天氣超好！和朋友去吃了一家新開的早午餐，那個酪梨吐司簡直是人間美味呀～🥑✨', 
    images: ['image_be7f1e.jpg'], weather: 'sun', steps: 8500, music: 'Perfect Night - LE SSERAFIM', period: 'none'
  },
  { 
    id: 2, date: '2026-06-14', mood: 'sadness', 
    text: '剛買的冰淇淋掉到地上了... 雖然是很小的事情但突然覺得有點委屈 🥲', 
    images: [], weather: 'cloud', steps: 3200, music: 'Ditto - NewJeans', period: 'light'
  },
  { 
    id: 3, date: '2026-06-10', mood: 'anger', 
    text: '上班路上遇到大塞車，還被旁邊的車按喇叭，真的超級火大！', 
    images: ['image_be7f1e.jpg'], weather: 'rain', steps: 5120, music: 'Supernova - aespa', period: 'heavy'
  },
  { id: 4, date: '2026-06-05', mood: 'joy', text: '看了期待已久的電影！', images: ['image_be7f1e.jpg'], weather: 'sun', steps: 12000, music: null, period: 'none' },
];

const INITIAL_TODOS = [
  { id: 1, text: '買貓砂', done: true, date: '2026-06-15' },
  { id: 2, text: '預約牙醫', done: false, date: '2026-06-15' },
  { id: 3, text: '準備朋友生日禮物', done: false, date: '2026-06-20' },
  { id: 4, text: '整理六月發票', done: false, date: '2026-06-30' },
];

// --- 組件：立體玻璃記憶球 (Glass Orb) ---
const SvgOrb = ({ moodId, size = 'md', isSelected = false, onClick, customClass = '' }) => {
  const mood = MOODS[moodId] || MOODS.joy;
  const sizeMap = { xs: 24, sm: 36, md: 48, lg: 72, xl: 100 };
  const s = sizeMap[size];
  const uniqueId = Math.random().toString(36).substr(2, 9); // 防止漸層 ID 衝突

  return (
    <div 
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-all duration-300 flex-shrink-0
        ${onClick ? 'cursor-pointer' : ''}
        ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : (onClick ? 'hover:scale-105 hover:drop-shadow-md' : '')}
        ${customClass}
      `}
      style={{ width: s, height: s }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible drop-shadow-lg">
        <defs>
          {/* 玻璃球立體漸層 */}
          <radialGradient id={`glass-${moodId}-${uniqueId}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={mood.light} stopOpacity="0.95" />
            <stop offset="70%" stopColor={mood.dark} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </radialGradient>
          {/* 頂部高光 */}
          <linearGradient id={`highlight-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="white" stopOpacity="0.9" />
             <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 球體本體 */}
        <circle cx="50" cy="50" r="46" fill={`url(#glass-${moodId}-${uniqueId})`} />
        
        {/* 內發光/邊緣反光 */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" strokeOpacity="0.1" />

        {/* 頂部弧形高光 (玻璃質感關鍵) */}
        <ellipse cx="50" cy="22" rx="30" ry="12" fill={`url(#highlight-${uniqueId})`} transform="rotate(-15 50 22)" />
        {/* 底部小反光 */}
        <path d="M 30 85 A 35 15 0 0 0 70 85" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
        
        {/* 表情 (放在玻璃球內部，稍微透出) */}
        <g fill="#475569" stroke="#475569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          {mood.face === 'joy' && (
            <><path d="M35,45 Q40,40 45,45" fill="none" /><path d="M55,45 Q60,40 65,45" fill="none" /><path d="M40,55 Q50,65 60,55" fill="none" /></>
          )}
          {mood.face === 'sadness' && (
            <><path d="M35,45 Q40,50 45,45" fill="none" /><path d="M55,45 Q60,50 65,45" fill="none" /><path d="M45,60 Q50,55 55,60" fill="none" /><circle cx="38" cy="55" r="2" fill="#3B82F6" stroke="none" opacity="0.9"/></>
          )}
          {mood.face === 'anger' && (
            <><path d="M35,40 L45,45" fill="none" /><path d="M65,40 L55,45" fill="none" /><circle cx="42" cy="48" r="2" fill="#475569" stroke="none" /><circle cx="58" cy="48" r="2" fill="#475569" stroke="none" /><path d="M45,60 L55,60" fill="none" /></>
          )}
          {mood.face === 'disgust' && (
            <><path d="M35,45 L45,45" fill="none" /><path d="M55,45 L65,45" fill="none" /><path d="M45,60 Q50,58 55,62" fill="none" /></>
          )}
        </g>
      </svg>
    </div>
  );
};

// --- 共用背景 ---
const SkyBackground = () => (
  <div className="absolute inset-0 z-0 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-50 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse blur-[1px]"></div>
    <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse delay-75 blur-[1px]"></div>
    <div className="absolute top-40 left-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse delay-150"></div>
    <div className="absolute top-12 -left-10 opacity-40 animate-[slideRight_60s_linear_infinite]">
      <svg width="120" height="40" viewBox="0 0 120 40" fill="white"><path d="M10,30 Q20,10 40,20 Q60,0 80,20 Q100,10 110,30 Z" /></svg>
    </div>
    <div className="absolute top-32 -right-20 opacity-30 animate-[slideLeft_80s_linear_infinite]">
      <svg width="150" height="50" viewBox="0 0 150 50" fill="white"><path d="M10,40 Q30,10 60,25 Q90,5 120,25 Q140,15 150,40 Z" /></svg>
    </div>
  </div>
);

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentView, setCurrentView] = useState('home'); 
  
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(null); 
  
  const [planetName, setPlanetName] = useState('雲朵上的棉花糖星');
  const [addingTodo, setAddingTodo] = useState(false);
  const [newTodoDraft, setNewTodoDraft] = useState({ text: '', date: new Date().toISOString().split('T')[0] });

  // 記帳與統計狀態
  const [financeDraft, setFinanceDraft] = useState({ date: new Date().toISOString().split('T')[0], amount: '', category: '午餐' });
  const [finances, setFinances] = useState([{ id: 1, date: '2026-06-15', amount: 150, category: '午餐' }]);
  const [statsTab, setStatsTab] = useState('memory'); // 'memory' 或 'finance'

  // 模擬當前日期與月經狀態
  const todayStr = '2026-06-15';
  const periodState = { isActive: true, day: 3, statusText: "🌸 經期第 3 天 (預計還有 2 天結束)" };

  const [memoryDraft, setMemoryDraft] = useState({
    date: todayStr, text: '', mood: null,
    weather: 'sun', steps: '', music: '', period: 'none', images: []
  });

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTodo = () => {
    if (!newTodoDraft.text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodoDraft.text, done: false, date: newTodoDraft.date }]);
    setNewTodoDraft({ text: '', date: todayStr });
    setAddingTodo(false);
  };

  const handleSaveMemory = () => {
    if (!memoryDraft.mood && !memoryDraft.text) return;
    const newEntry = { id: Date.now(), ...memoryDraft };
    setMemories([newEntry, ...memories]);
    setMemoryDraft({ date: todayStr, text: '', mood: null, weather: 'sun', steps: '', music: '', period: 'none', images: [] });
    setCurrentView('home');
  };

  const handleSaveFinance = () => {
    if (!financeDraft.amount) return;
    setFinances([{ id: Date.now(), ...financeDraft, amount: Number(financeDraft.amount) }, ...finances]);
    setFinanceDraft({ date: todayStr, amount: '', category: '午餐' });
    setStatsTab('finance');
    setCurrentView('stats'); // 儲存後跳轉到統計看記帳
  };

  // --- 手帳排版 (Scrapbook) 邏輯 ---
  const [scrapbookItems, setScrapbookItems] = useState([
    { id: '1', type: 'photo', url: 'image_be7f1e.jpg', x: 20, y: 50, rotation: -5, scale: 1, zIndex: 1 },
    { id: '2', type: 'text', content: 'June Dump ✨', x: 50, y: 300, rotation: 2, scale: 1, zIndex: 2 },
    { id: '3', type: 'tape', color: 'orange', x: 100, y: 35, rotation: -3, scale: 1, zIndex: 3 }
  ]);
  const [dragInfo, setDragInfo] = useState(null);
  const maxZIndex = useRef(3);

  const handlePointerDown = (e, id) => {
    e.target.setPointerCapture(e.pointerId);
    const item = scrapbookItems.find(i => i.id === id);
    maxZIndex.current += 1; // 點擊時移到最上層
    
    setDragInfo({ 
      id, 
      startX: e.clientX, 
      startY: e.clientY, 
      initX: item.x, 
      initY: item.y 
    });
    
    setScrapbookItems(items => items.map(i => 
      i.id === id ? { ...i, zIndex: maxZIndex.current } : i
    ));
  };

  const handlePointerMove = (e) => {
    if (!dragInfo) return;
    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    setScrapbookItems(items => items.map(i => 
      i.id === dragInfo.id ? { ...i, x: dragInfo.initX + dx, y: dragInfo.initY + dy } : i
    ));
  };

  const handlePointerUp = (e) => {
    e.target.releasePointerCapture(e.pointerId);
    setDragInfo(null);
  };

  const addScrapbookItem = (type) => {
    maxZIndex.current += 1;
    const newItem = {
      id: Date.now().toString(),
      type,
      x: 80 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      rotation: (Math.random() - 0.5) * 20,
      scale: 1,
      zIndex: maxZIndex.current,
      url: type === 'photo' ? 'image_be7f1e.jpg' : null,
      content: type === 'text' ? 'New Text' : null,
      color: type === 'tape' ? 'amber' : null
    };
    setScrapbookItems([...scrapbookItems, newItem]);
  };

  const removeScrapbookItem = (id) => {
    setScrapbookItems(items => items.filter(i => i.id !== id));
  };

  // --- 畫面渲染 ---

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center overflow-hidden font-sans">
         <div className="w-full max-w-md bg-gradient-to-b from-amber-100 to-orange-100 h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col items-center justify-center sm:border-8 border-slate-800">
            <SkyBackground />
            <div className="z-10 flex flex-col items-center text-slate-700 animate-fade-in-up">
              <ScanFace size={64} className="mb-6 text-amber-500 animate-pulse" />
              <h1 className="text-2xl font-bold mb-2">MemoryOrbs</h1>
              <p className="text-sm text-slate-500 mb-12">請使用 Face ID 解鎖</p>
              <button onClick={() => setIsUnlocked(true)} className="px-8 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg font-bold text-amber-600 hover:bg-white transition-all flex items-center gap-2 border border-white">
                解鎖進入手帳
              </button>
            </div>
         </div>
      </div>
    );
  }

  const renderHome = () => {
    const currentMonthMemories = memories.filter(m => m.date.startsWith('2026-06'));

    return (
      <div className="flex-1 overflow-y-auto pb-24 relative scroll-smooth">
        <SkyBackground />
        
        <div className="relative z-10 pt-12 px-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 drop-shadow-sm">六月, 2026</h1>
              {periodState.isActive && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-pink-100/80 backdrop-blur-sm text-pink-600 rounded-full text-xs font-bold shadow-sm">
                  <Droplets size={12} /> {periodState.statusText}
                </div>
              )}
            </div>
            {/* 進入 Scrapbook 排版模式 */}
            <button onClick={() => setCurrentView('dump')} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-amber-600 border border-white hover:scale-105 transition group relative">
              <Share2 size={18} />
              <span className="absolute -bottom-6 text-[10px] whitespace-nowrap bg-slate-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">手帳排版</span>
            </button>
          </div>

          {/* 玻璃記憶罐 */}
          <div className="relative w-32 h-40 mx-auto mb-8 animate-fade-in-up">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-800/80 rounded-full border-b-4 border-amber-900/50 z-20 backdrop-blur-sm shadow-md"></div>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-700/80 rounded-t-lg z-20 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-2 border-white/60 rounded-b-[2.5rem] rounded-t-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.7)] z-10 flex flex-wrap-reverse content-start justify-center gap-1 p-3 pt-6 overflow-hidden">
              {currentMonthMemories.map((m, i) => (
                <SvgOrb key={i} moodId={m.mood} size="xs" customClass="animate-fade-in-up" />
              ))}
              {/* 玻璃罐反光 */}
              <div className="absolute top-0 left-2 w-4 h-full bg-white/50 rounded-full skew-x-12 blur-[2px] pointer-events-none"></div>
              <div className="absolute top-10 right-2 w-2 h-1/2 bg-white/30 rounded-full skew-x-12 blur-[1px] pointer-events-none"></div>
            </div>
          </div>

          {/* 1. 相片日曆網格 (移至上方) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/80 mb-6 relative overflow-hidden">
             {/* 裝飾膠帶 */}
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-orange-200/50 -rotate-2 backdrop-blur-sm"></div>
            
            <div className="grid grid-cols-7 gap-2 mb-4 text-center mt-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-xs font-bold text-amber-700/70">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(1).keys()].map(i => <div key={`empty-${i}`} className="aspect-square"></div>)}
              {[...Array(30).keys()].map(i => {
                const day = i + 1;
                const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                const dayMemory = memories.find(m => m.date === dateStr);
                const isToday = day === 15;
                const hasImage = dayMemory && dayMemory.images && dayMemory.images.length > 0;

                return (
                  <div 
                    key={day} onClick={() => dayMemory && setSelectedDateModal(dateStr)}
                    className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all overflow-hidden
                      ${isToday ? 'ring-2 ring-amber-400 ring-offset-2 bg-amber-50' : 'bg-slate-50/50'}
                      ${dayMemory ? 'cursor-pointer shadow-sm hover:scale-105' : ''}
                      ${!hasImage && dayMemory ? 'bg-white border border-slate-100' : ''}
                    `}
                  >
                    {hasImage ? (
                      <>
                        <img src={dayMemory.images[0]} alt="記憶" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white z-10">{day}</span>
                        <div className="absolute top-0.5 left-0.5 z-10">
                           <SvgOrb moodId={dayMemory.mood} size="xs" customClass="scale-75 origin-top-left" />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className={`text-xs font-bold z-10 ${isToday ? 'text-amber-600' : 'text-slate-500'}`}>{day}</span>
                        {dayMemory && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-90 pt-3">
                             <SvgOrb moodId={dayMemory.mood} size="xs" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. 待辦事項區塊 (移至下方，並支援新增與日期) */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-500" /> 待辦事項
              </h3>
              <button onClick={() => setAddingTodo(!addingTodo)} className="text-amber-600 bg-amber-100 p-1.5 rounded-full hover:bg-amber-200 transition-colors">
                <Plus size={14} />
              </button>
            </div>

            {/* 新增待辦表單 */}
            {addingTodo && (
              <div className="mb-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
                <input 
                  type="text" placeholder="準備做些什麼呢？" autoFocus
                  value={newTodoDraft.text} onChange={e => setNewTodoDraft({...newTodoDraft, text: e.target.value})}
                  className="w-full text-sm outline-none mb-2 text-slate-700"
                />
                <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2">
                  <input 
                    type="date" value={newTodoDraft.date} onChange={e => setNewTodoDraft({...newTodoDraft, date: e.target.value})}
                    className="text-xs text-slate-500 outline-none bg-transparent"
                  />
                  <button onClick={handleAddTodo} className="text-xs bg-slate-800 text-white px-3 py-1 rounded-full font-bold">新增</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {todos.sort((a,b) => new Date(a.date) - new Date(b.date)).map(todo => {
                const isPast = new Date(todo.date) < new Date(todayStr);
                const isToday = todo.date === todayStr;
                
                return (
                  <div key={todo.id} className="flex items-start gap-3 group">
                    <div className="mt-0.5" onClick={() => toggleTodo(todo.id)}>
                      {todo.done ? <CheckCircle2 size={18} className="text-green-500 cursor-pointer"/> : <Circle size={18} className="text-slate-300 cursor-pointer"/>}
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                      <p className={`text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{todo.text}</p>
                      <p className={`text-[10px] mt-0.5 font-medium ${isPast && !todo.done ? 'text-red-400' : isToday ? 'text-amber-500' : 'text-slate-400'}`}>
                        {isToday ? '今天' : todo.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 日期卡片 Modal */}
        {selectedDateModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white/95 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl scale-in relative border border-white/20">
              <button onClick={() => setSelectedDateModal(null)} className="absolute top-4 right-4 p-2 bg-black/10 backdrop-blur-md rounded-full text-slate-700 hover:bg-black/20 z-20">
                <X size={20} />
              </button>

              {(() => {
                const entry = memories.find(m => m.date === selectedDateModal);
                if (!entry) return null;
                const weatherIcons = { sun: <Sun size={16}/>, cloud: <Cloud size={16}/>, rain: <CloudRain size={16}/> };

                return (
                  <div className="max-h-[80vh] overflow-y-auto pb-6">
                    {entry.images.length > 0 ? (
                      <div className="h-64 relative">
                        <img src={entry.images[0]} className="w-full h-full object-cover" alt="回憶" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                        <div className="absolute -bottom-8 right-6 z-10">
                           <SvgOrb moodId={entry.mood} size="lg" customClass="shadow-2xl" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 relative flex items-center justify-center">
                        <SvgOrb moodId={entry.mood} size="xl" customClass="drop-shadow-2xl scale-125" />
                      </div>
                    )}

                    <div className="px-8 pt-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-black text-slate-800 tracking-wider">
                          {entry.date.replace(/-/g, ' . ')}
                        </div>
                        <div className="flex gap-2 text-slate-400">
                          {entry.weather && weatherIcons[entry.weather]}
                        </div>
                      </div>

                      {entry.music && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md animate-[spin_4s_linear_infinite]">
                            <Music size={18} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs text-slate-400 font-bold mb-0.5">今日專屬 BGM</p>
                            <p className="text-sm text-slate-700 font-bold truncate">{entry.music}</p>
                          </div>
                        </div>
                      )}

                      <p className="text-slate-700 leading-loose text-sm font-medium whitespace-pre-wrap mb-6">{entry.text}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 手帳排版畫布 (DIY Scrapbook) ---
  const renderScrapbook = () => (
    <div className="flex-1 bg-[#FDFBF7] flex flex-col relative font-serif overflow-hidden">
      {/* 網格背景 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* 頂部導覽列 */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-center z-20 bg-gradient-to-b from-[#FDFBF7] to-transparent sticky top-0">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 shadow-sm"><X size={20} /></button>
        <span className="font-handwriting text-xl text-slate-600 font-bold">Monthly Dump</span>
        <button className="px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-bold shadow-md flex items-center gap-2 hover:bg-amber-700 transition-colors">
          <Share2 size={16}/> 儲存
        </button>
      </div>

      {/* 畫布區域 (可拖曳元素) */}
      <div className="flex-1 relative overflow-hidden touch-none" style={{ touchAction: 'none' }}>
        {scrapbookItems.map(item => (
          <div 
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute cursor-move transition-transform ${dragInfo?.id === item.id ? 'scale-105 shadow-2xl' : 'shadow-md'} hover:ring-2 ring-amber-400/50`}
            style={{ 
              transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scale(${item.scale})`,
              zIndex: item.zIndex,
              userSelect: 'none'
            }}
          >
             {/* 刪除按鈕 */}
             {dragInfo?.id === item.id && (
               <button 
                 onPointerDown={(e) => { e.stopPropagation(); removeScrapbookItem(item.id); }}
                 className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-50 shadow-md"
               ><Trash2 size={12}/></button>
             )}

             {/* 渲染不同類型的元素 */}
             {item.type === 'photo' && (
               <div className="bg-white p-2 pb-8 rounded-sm pointer-events-none">
                 <img src={item.url} alt="pic" className="w-40 h-40 object-cover rounded-sm sepia-[0.1]" draggable="false" />
               </div>
             )}
             {item.type === 'video' && (
               <div className="bg-white p-2 pb-8 rounded-sm pointer-events-none relative">
                 <div className="w-40 h-40 bg-slate-200 rounded-sm flex items-center justify-center text-slate-400">
                    <PlaySquare size={32} />
                 </div>
                 <div className="absolute inset-x-0 bottom-2 text-center font-handwriting text-slate-500">Video</div>
               </div>
             )}
             {item.type === 'text' && (
               <div className="font-handwriting text-3xl text-slate-800 font-bold px-2 pointer-events-none drop-shadow-sm bg-white/50 backdrop-blur-sm rounded">
                 {item.content}
               </div>
             )}
             {item.type === 'tape' && (
               <div className="w-24 h-6 bg-orange-300/60 backdrop-blur-md mix-blend-multiply opacity-80 pointer-events-none rounded-sm"></div>
             )}
          </div>
        ))}
      </div>

      {/* 底部工具列 (新增素材) */}
      <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 pb-8 flex justify-around z-20">
         <button onClick={() => addScrapbookItem('photo')} className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-600">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><ImageIcon size={18}/></div>
           <span className="text-[10px] font-bold">加照片</span>
         </button>
         <button onClick={() => addScrapbookItem('video')} className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-600">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><PlaySquare size={18}/></div>
           <span className="text-[10px] font-bold">加影片</span>
         </button>
         <button onClick={() => addScrapbookItem('text')} className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-600">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Type size={18}/></div>
           <span className="text-[10px] font-bold">加文字</span>
         </button>
         <button onClick={() => addScrapbookItem('tape')} className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-600">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><StickyNote size={18}/></div>
           <span className="text-[10px] font-bold">紙膠帶</span>
         </button>
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="flex-1 flex flex-col bg-slate-900 h-full overflow-y-auto text-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] z-0 pointer-events-none"></div>
      
      <div className="px-6 pt-12 pb-8 relative z-10">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Archive className="text-amber-400" /> 大腦儲藏室
        </h1>
        <p className="text-slate-400 text-sm">封存的記憶玻璃球與星球</p>
      </div>

      <div className="px-6 space-y-8 pb-24 relative z-10">
        <div>
          <h2 className="text-sm font-bold text-slate-400 mb-4 tracking-widest uppercase">2025 年度星球</h2>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 flex flex-col items-center relative overflow-hidden">
             <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-600 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative mb-6 animate-spin-slow">
                <div className="absolute inset-0 rounded-full bg-black/10 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 blur-[2px]"></div>
                <div className="absolute bottom-8 right-8 w-16 h-8 rounded-full bg-indigo-900/40 blur-[3px] -rotate-12"></div>
             </div>
             <div className="flex items-center gap-2 group cursor-pointer">
               <input type="text" value={planetName} onChange={(e) => setPlanetName(e.target.value)} className="bg-transparent text-xl font-bold text-white text-center outline-none border-b border-transparent focus:border-amber-400 transition-colors w-48" />
               <Edit2 size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
             </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-400 mb-4 tracking-widest uppercase">已收集的玻璃球展示</h2>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 flex justify-around flex-wrap gap-4">
            <SvgOrb moodId="joy" size="md" />
            <SvgOrb moodId="sadness" size="md" />
            <SvgOrb moodId="anger" size="md" />
            <SvgOrb moodId="disgust" size="md" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddMemory = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden animate-slide-up relative">
      <div className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur-md flex justify-between items-center shadow-sm z-10">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-slate-100 rounded-full text-slate-600"><X size={20} /></button>
        <h2 className="text-lg font-bold text-slate-800">封存記憶</h2>
        <button onClick={handleSaveMemory} className="p-2 bg-slate-800 rounded-full text-white"><Check size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* 日期 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
           <span className="text-sm font-bold text-slate-600 flex items-center gap-2"><CalendarIcon size={18} className="text-amber-500"/> 日期</span>
           <input type="date" value={memoryDraft.date} onChange={(e) => setMemoryDraft({...memoryDraft, date: e.target.value})} className="outline-none text-slate-700 bg-transparent font-medium" />
        </div>

        {/* 心情玻璃球 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
          <p className="text-sm font-medium text-slate-500 mb-6">今天的心情玻璃球？</p>
          <div className="flex justify-center gap-4">
            {Object.keys(MOODS).map(moodKey => (
              <SvgOrb key={moodKey} moodId={moodKey} size="lg" isSelected={memoryDraft.mood === moodKey} onClick={() => setMemoryDraft({...memoryDraft, mood: moodKey})} />
            ))}
          </div>
        </div>

        {/* 其他生活紀錄 (天氣、月經、音樂、步數) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 font-bold w-12">天氣</span>
            <button onClick={() => setMemoryDraft({...memoryDraft, weather: 'sun'})} className={`p-2 rounded-full ${memoryDraft.weather === 'sun' ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'}`}><Sun size={18}/></button>
            <button onClick={() => setMemoryDraft({...memoryDraft, weather: 'cloud'})} className={`p-2 rounded-full ${memoryDraft.weather === 'cloud' ? 'bg-slate-200 text-slate-600' : 'bg-slate-50 text-slate-400'}`}><Cloud size={18}/></button>
            <button onClick={() => setMemoryDraft({...memoryDraft, weather: 'rain'})} className={`p-2 rounded-full ${memoryDraft.weather === 'rain' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}><CloudRain size={18}/></button>
          </div>
          
          <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
            <Droplets size={18} className="text-pink-400" />
            <span className="text-sm text-slate-500 font-bold w-12">月經</span>
            <select value={memoryDraft.period} onChange={(e) => setMemoryDraft({...memoryDraft, period: e.target.value})} className="flex-1 bg-transparent text-sm text-slate-700 outline-none">
              <option value="none">沒來</option>
              <option value="light">量少</option>
              <option value="normal">正常</option>
              <option value="heavy">量多</option>
            </select>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
            <Music size={18} className="text-purple-400" />
            <span className="text-sm text-slate-500 font-bold w-12">音樂</span>
            <input type="text" placeholder="今日專屬 BGM..." value={memoryDraft.music} onChange={(e) => setMemoryDraft({...memoryDraft, music: e.target.value})} className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-300" />
          </div>

          <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
            <Footprints size={18} className="text-green-500" />
            <span className="text-sm text-slate-500 font-bold w-12">步數</span>
            <input type="number" placeholder="今天走了幾步？" value={memoryDraft.steps} onChange={(e) => setMemoryDraft({...memoryDraft, steps: e.target.value})} className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-300" />
          </div>
        </div>

        {/* 日記內文與照片 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-5 flex flex-col">
          <textarea placeholder="寫下今天的點點滴滴..." className="w-full h-32 outline-none resize-none text-slate-700 placeholder:text-slate-300 leading-relaxed mb-4" value={memoryDraft.text} onChange={(e) => setMemoryDraft({...memoryDraft, text: e.target.value})} />
          <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
            <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-600 transition-colors">
               <Camera size={18} /> 新增照片
            </button>
            {memoryDraft.images.length > 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">1 張照片</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddFinance = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden animate-slide-up relative">
      <div className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur-md flex justify-between items-center shadow-sm z-10">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-slate-100 rounded-full text-slate-600"><X size={20} /></button>
        <h2 className="text-lg font-bold text-slate-800">記一筆</h2>
        <button onClick={handleSaveFinance} className="p-2 bg-amber-500 rounded-full text-white"><Check size={20} /></button>
      </div>
      <div className="flex-1 px-6 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
           <span className="text-sm font-bold text-slate-600 flex items-center gap-2"><CalendarIcon size={18} className="text-amber-500"/> 日期</span>
           <input type="date" value={financeDraft.date} onChange={(e) => setFinanceDraft({...financeDraft, date: e.target.value})} className="outline-none text-slate-700 bg-transparent font-medium" />
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
           <span className="text-slate-400 font-bold mb-2">花費金額</span>
           <div className="flex items-center justify-center text-4xl font-black text-slate-700 border-b-2 border-amber-200 pb-2">
             <DollarSign size={32} className="text-amber-500 mr-1"/>
             <input type="number" placeholder="0" value={financeDraft.amount} onChange={(e) => setFinanceDraft({...financeDraft, amount: e.target.value})} className="w-32 bg-transparent outline-none text-center" autoFocus/>
           </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['早餐', '午餐', '晚餐', '飲料', '交通', '購物'].map(cat => (
            <button key={cat} onClick={() => setFinanceDraft({...financeDraft, category: cat})} className={`py-3 rounded-2xl text-sm font-bold transition-colors ${financeDraft.category === cat ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' : 'bg-white text-slate-500 border border-slate-100 shadow-sm'}`}>{cat}</button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
     <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden relative">
        <div className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur-md z-10 sticky top-0 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">統計與回顧</h1>
          {/* 夾層切換按鈕 */}
          <div className="flex bg-slate-200 p-1 rounded-full">
            <button onClick={() => setStatsTab('memory')} className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${statsTab === 'memory' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>記憶球</button>
            <button onClick={() => setStatsTab('finance')} className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${statsTab === 'finance' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>記帳明細</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {statsTab === 'memory' ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 mb-4">本月情緒分佈</h3>
              <div className="flex justify-around items-end h-40 mb-4 border-b border-slate-100 pb-2">
                 {Object.keys(MOODS).map(moodKey => {
                   const count = memories.filter(m => m.mood === moodKey).length;
                   // 視覺化長條圖高度
                   const height = count === 0 ? 10 : count * 30; 
                   return (
                     <div key={moodKey} className="flex flex-col items-center gap-2">
                       <div style={{height: `${height}px`, backgroundColor: MOODS[moodKey].dark}} className="w-8 rounded-t-lg opacity-80 transition-all"></div>
                       <SvgOrb moodId={moodKey} size="xs" />
                     </div>
                   );
                 })}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-24">
              <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl p-6 shadow-lg text-white">
                <p className="text-amber-100 font-bold text-sm mb-1">本月總花費</p>
                <h2 className="text-4xl font-black flex items-center tracking-wider"><DollarSign size={28} className="mr-1"/> {finances.reduce((acc, curr) => acc + curr.amount, 0)}</h2>
              </div>
              <h3 className="text-sm font-bold text-slate-500 mt-6 mb-2 flex items-center gap-2"><Coffee size={16}/> 花費紀錄</h3>
              {finances.map(f => (
                <div key={f.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs">{f.category[0]}</div>
                    <div>
                      <p className="font-bold text-slate-700">{f.category}</p>
                      <p className="text-xs font-medium text-slate-400">{f.date}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-700 text-lg">${f.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
     </div>
  );

  const hideNav = ['add_memory', 'add_finance', 'dump'].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center overflow-hidden font-sans text-slate-800">
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        .font-handwriting { font-family: 'Caveat', 'Comic Sans MS', cursive; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(500px); } }
        @keyframes slideLeft { from { transform: translateX(500px); } to { transform: translateX(-200px); } }
      `}} />

      <div className="w-full max-w-md bg-white h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden sm:border-8 border-slate-800">
        
        {currentView === 'home' && renderHome()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'storage' && renderStorage()}
        {currentView === 'add_memory' && renderAddMemory()}
        {currentView === 'add_finance' && renderAddFinance()}
        {currentView === 'dump' && renderScrapbook()}

        {showAddMenu && !hideNav && (
          <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end pb-32 items-center animate-fade-in">
            <div className="flex gap-6 mb-4">
              <button onClick={() => { setShowAddMenu(false); setCurrentView('add_memory'); }} className="flex flex-col items-center gap-2 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-500 to-slate-400 text-white flex items-center justify-center shadow-lg"><Smile size={24} /></div>
                <span className="text-xs font-bold text-slate-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">封存記憶</span>
              </button>
              <button onClick={() => { setShowAddMenu(false); setCurrentView('add_finance'); }} className="flex flex-col items-center gap-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-lg"><DollarSign size={24} /></div>
                <span className="text-xs font-bold text-slate-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">記一筆</span>
              </button>
            </div>
            <div className="absolute inset-0 -z-10" onClick={() => setShowAddMenu(false)}></div>
          </div>
        )}

        {!hideNav && (
          <div className={`absolute bottom-0 left-0 right-0 border-t z-50 transition-colors duration-300
            ${currentView === 'storage' ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-white/50 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}
            px-6 py-4 pb-8 sm:pb-6 flex justify-between items-center
          `}>
            <button onClick={() => setCurrentView('home')} className={`p-2 flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-amber-600' : (currentView==='storage'?'text-slate-500':'text-slate-400')}`}>
              <Home size={24} /><span className="text-[10px] font-bold">日曆</span>
            </button>
            <button onClick={() => setCurrentView('stats')} className={`p-2 flex flex-col items-center gap-1 ${currentView==='stats'?'text-amber-500':(currentView==='storage'?'text-slate-500':'text-slate-400')}`}>
              <PieChart size={24} /><span className="text-[10px] font-bold">統計</span>
            </button>
            <div className="relative -top-8">
              <button onClick={() => setShowAddMenu(!showAddMenu)} className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 ${showAddMenu ? 'bg-amber-600 rotate-45 shadow-amber-600/40' : 'bg-slate-800 shadow-slate-800/30'}`}>
                <Plus size={32} />
              </button>
            </div>
            <button onClick={() => setCurrentView('storage')} className={`p-2 flex flex-col items-center gap-1 ${currentView === 'storage' ? 'text-amber-400' : 'text-slate-400'}`}>
              <Archive size={24} /><span className="text-[10px] font-bold">星球</span>
            </button>
            <button className={`p-2 flex flex-col items-center gap-1 ${currentView==='storage'?'text-slate-500':'text-slate-400'}`}>
              <User size={24} /><span className="text-[10px] font-bold">我的</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}