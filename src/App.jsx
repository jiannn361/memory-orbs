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

// --- 設定常數：莫蘭迪色系 (Morandi Colors) ---
const MOODS = {
  joy: { id: 'joy', name: '開心', light: '#E2D9C8', dark: '#B5A48C', face: 'joy' },       // 莫蘭迪灰黃
  sadness: { id: 'sadness', name: '悲傷', light: '#D0D7DE', dark: '#7A8B99', face: 'sadness' }, // 莫蘭迪藍灰
  anger: { id: 'anger', name: '憤怒', light: '#E8D3D1', dark: '#A37A74', face: 'anger' },     // 莫蘭迪磚紅
  disgust: { id: 'disgust', name: '厭惡', light: '#D3DDD4', dark: '#839987', face: 'disgust' }, // 莫蘭迪綠灰
};

// --- 已經清空的所有測試資料 ---
const INITIAL_MEMORIES = [];
const INITIAL_TODOS = [];

// --- 組件：立體玻璃記憶球 (Glass Orb) ---
const SvgOrb = ({ moodId, size = 'md', isSelected = false, onClick, customClass = '' }) => {
  const mood = MOODS[moodId] || MOODS.joy;
  const sizeMap = { xs: 24, sm: 36, md: 48, lg: 72, xl: 100 };
  const s = sizeMap[size];
  const uniqueId = Math.random().toString(36).substr(2, 9);

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
          <radialGradient id={`glass-${moodId}-${uniqueId}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={mood.light} stopOpacity="0.95" />
            <stop offset="70%" stopColor={mood.dark} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2D2D2D" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id={`highlight-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="white" stopOpacity="0.8" />
             <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill={`url(#glass-${moodId}-${uniqueId})`} />
        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
        
        <ellipse cx="50" cy="22" rx="35" ry="14" fill={`url(#highlight-${uniqueId})`} transform="rotate(-10 50 22)" />
        <path d="M 28 82 A 35 15 0 0 0 72 82" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" />
        
        <g fill="#4A4A4A" stroke="#4A4A4A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
          {mood.face === 'joy' && (
            <><path d="M35,45 Q40,40 45,45" fill="none" /><path d="M55,45 Q60,40 65,45" fill="none" /><path d="M40,56 Q50,66 60,56" fill="none" /></>
          )}
          {mood.face === 'sadness' && (
            <><path d="M35,47 Q40,51 45,47" fill="none" /><path d="M55,47 Q60,51 65,47" fill="none" /><path d="M45,62 Q50,56 55,62" fill="none" /><circle cx="37" cy="56" r="2" fill="#7A8B99" stroke="none" /></>
          )}
          {mood.face === 'anger' && (
            <><path d="M34,41 L44,45" fill="none" /><path d="M66,41 L56,45" fill="none" /><circle cx="41" cy="49" r="2" fill="#4A4A4A" stroke="none" /><circle cx="59" cy="49" r="2" fill="#4A4A4A" stroke="none" /><path d="M44,61 L56,61" fill="none" /></>
          )}
          {mood.face === 'disgust' && (
            <><path d="M35,46 L45,46" fill="none" /><path d="M55,46 L65,46" fill="none" /><path d="M44,61 Q50,58 56,63" fill="none" /></>
          )}
        </g>
      </svg>
    </div>
  );
};

// --- 天空背景 ---
const SkyBackground = () => (
  <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F9F3E6] via-[#FDFBF7] to-[#F5EFE0] overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-2 h-2 bg-amber-200 rounded-full animate-pulse blur-[1px]"></div>
    <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse delay-75 blur-[1px]"></div>
    <div className="absolute top-12 -left-10 opacity-30 animate-[slideRight_60s_linear_infinite]">
      <svg width="120" height="40" viewBox="0 0 120 40" fill="white"><path d="M10,30 Q20,10 40,20 Q60,0 80,20 Q100,10 110,30 Z" /></svg>
    </div>
    <div className="absolute top-32 -right-20 opacity-20 animate-[slideLeft_80s_linear_infinite]">
      <svg width="150" height="50" viewBox="0 0 150 50" fill="white"><path d="M10,40 Q30,10 60,25 Q90,5 120,25 Q140,15 150,40 Z" /></svg>
    </div>
  </div>
);

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentView, setCurrentView] = useState('home'); 
  const [activeTab, setActiveTab] = useState('diary');
  
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(null); 
  
  const [planetName, setPlanetName] = useState('未命名的小宇宙');
  const [addingTodo, setAddingTodo] = useState(false);
  const [newTodoDraft, setNewTodoDraft] = useState({ text: '', date: new Date().toISOString().split('T')[0] });

  const todayStr = new Date().toISOString().split('T')[0];

  const [memoryDraft, setMemoryDraft] = useState({
    date: todayStr, text: '', mood: null,
    weather: 'sun', steps: '', music: '', period: 'none', images: []
  });

  const [financeDraft, setFinanceDraft] = useState({
    date: todayStr, amount: '', category: '飲食', note: ''
  });

  const [finances, setFinances] = useState([]);
  const [statsTab, setStatsTab] = useState('mood');

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
    const newFinance = { id: Date.now(), ...financeDraft, amount: Number(financeDraft.amount) };
    setFinances([newFinance, ...finances]);
    setFinanceDraft({ date: todayStr, amount: '', category: '飲食', note: '' });
    setCurrentView('home');
  };

  // --- 手帳自由排版 (DIY Scrapbook) 狀態 ---
  const [scrapbookItems, setScrapbookItems] = useState([]);
  const [dragInfo, setDragInfo] = useState(null);
  const maxZIndex = useRef(1);

  const handlePointerDown = (e, id) => {
    e.target.setPointerCapture(e.pointerId);
    const item = scrapbookItems.find(i => i.id === id);
    maxZIndex.current += 1;
    
    setDragInfo({ id, startX: e.clientX, startY: e.clientY, initX: item.x, initY: item.y });
    setScrapbookItems(items => items.map(i => i.id === id ? { ...i, zIndex: maxZIndex.current } : i));
  };

  const handlePointerMove = (e) => {
    if (!dragInfo) return;
    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    setScrapbookItems(items => items.map(i => i.id === dragInfo.id ? { ...i, x: dragInfo.initX + dx, y: dragInfo.initY + dy } : i));
  };

  const handlePointerUp = (e) => {
    if (!dragInfo) return;
    e.target.releasePointerCapture(e.pointerId);
    setDragInfo(null);
  };

  const addScrapbookItem = (type) => {
    maxZIndex.current += 1;
    const newItem = {
      id: Date.now().toString(),
      type,
      x: 60 + Math.random() * 60,
      y: 120 + Math.random() * 60,
      rotation: (Math.random() - 0.5) * 15,
      scale: 1,
      zIndex: maxZIndex.current,
      url: type === 'photo' ? 'image_be7f1e.jpg' : null,
      content: type === 'text' ? '點擊編輯文字' : null,
      color: type === 'tape' ? 'amber' : null
    };
    setScrapbookItems([...scrapbookItems, newItem]);
  };

  const removeScrapbookItem = (id) => {
    setScrapbookItems(items => items.filter(i => i.id !== id));
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center overflow-hidden font-sans">
         <div className="w-full max-w-md bg-[#F4EFE0] h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col items-center justify-center sm:border-8 border-slate-800">
            <SkyBackground />
            <div className="z-10 flex flex-col items-center text-slate-700">
              <ScanFace size={64} className="mb-6 text-amber-600/70 opacity-80" />
              <h1 className="text-2xl font-bold mb-1 tracking-wide">MemoryOrbs</h1>
              <p className="text-xs text-slate-400 mb-12 tracking-widest">PRIVATE DIARY space</p>
              <button onClick={() => setIsUnlocked(true)} className="px-10 py-3.5 bg-white/70 backdrop-blur-md rounded-full shadow-md font-bold text-slate-700 hover:bg-white transition-all border border-white/60 tracking-wider text-sm">
                解鎖進入專屬空間
              </button>
            </div>
         </div>
      </div>
    );
  }

  const renderHome = () => {
    const hasActivePeriod = memories.some(m => m.date === todayStr && m.period !== 'none');

    return (
      <div className="flex-1 overflow-y-auto pb-24 relative scroll-smooth">
        <SkyBackground />
        
        <div className="relative z-10 pt-12 px-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-wide">生活手帳日誌</h1>
              {hasActivePeriod && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-red-50/80 backdrop-blur-sm text-red-700/80 rounded-full text-xs font-bold border border-red-100">
                  <Droplets size={12} /> 生理期記錄中
                </div>
              )}
            </div>
            <button onClick={() => setCurrentView('dump')} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-slate-600 border border-white hover:scale-105 transition">
              <Share2 size={18} />
            </button>
          </div>

          {/* 玻璃記憶罐 */}
          <div className="relative w-28 h-36 mx-auto mb-8">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-800/40 rounded-full border-b-2 border-amber-900/20 z-20 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-md border-2 border-white/50 rounded-b-[2rem] rounded-t-xl shadow-[inset_0_0_15px_rgba(255,255,255,0.6)] z-10 flex flex-wrap-reverse content-start justify-center gap-1 p-3 pt-5 overflow-hidden">
              {memories.map((m, i) => (
                <SvgOrb key={i} moodId={m.mood} size="xs" />
              ))}
              <div className="absolute top-0 left-2 w-3 h-full bg-white/30 rounded-full skew-x-6 blur-[1px] pointer-events-none"></div>
            </div>
          </div>

          {/* 1. 相片日曆網格 */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 mb-6 relative">
            <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-400">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(1).keys()].map(i => <div key={`empty-${i}`} className="aspect-square"></div>)}
              {[...Array(30).keys()].map(i => {
                const day = i + 1;
                const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                const dayMemory = memories.find(m => m.date === dateStr);
                const isToday = day === 22;
                const hasImage = dayMemory && dayMemory.images && dayMemory.images.length > 0;

                return (
                  <div 
                    key={day} onClick={() => dayMemory && setSelectedDateModal(dateStr)}
                    className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all overflow-hidden
                      ${isToday ? 'ring-2 ring-slate-400 bg-white shadow-sm' : 'bg-slate-100/40'}
                      ${dayMemory ? 'cursor-pointer shadow-xs hover:scale-105' : ''}
                    `}
                  >
                    {hasImage ? (
                      <>
                        <img src={dayMemory.images[0]} alt="img" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white z-10">{day}</span>
                        <div className="absolute top-0.5 left-0.5 z-10 scale-70 origin-top-left">
                           <SvgOrb moodId={dayMemory.mood} size="xs" />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className={`text-xs font-bold z-10 ${isToday ? 'text-slate-800' : 'text-slate-400'}`}>{day}</span>
                        {dayMemory && (
                          <div className="absolute inset-0 flex items-center justify-center pt-2">
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

          {/* 2. 待辦事項區塊 (置於下方) */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 shadow-xs border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-slate-500" /> 備忘規劃事項
              </h3>
              <button onClick={() => setAddingTodo(!addingTodo)} className="text-slate-600 bg-slate-200/60 p-1.5 rounded-full">
                <Plus size={14} />
              </button>
            </div>

            {addingTodo && (
              <div className="mb-4 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                <input 
                  type="text" placeholder="輸入待辦工作..." autoFocus
                  value={newTodoDraft.text} onChange={e => setNewTodoDraft({...newTodoDraft, text: e.target.value})}
                  className="w-full text-sm outline-none mb-2 text-slate-700 bg-transparent"
                />
                <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2">
                  <input 
                    type="date" value={newTodoDraft.date} onChange={e => setNewTodoDraft({...newTodoDraft, date: e.target.value})}
                    className="text-xs text-slate-400 outline-none bg-transparent"
                  />
                  <button onClick={handleAddTodo} className="text-xs bg-slate-700 text-white px-3 py-1 rounded-full">排定</button>
                </div>
              </div>
            )}

            {todos.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">目前沒有安排待辦事項</p>
            ) : (
              <div className="space-y-3">
                {todos.map(todo => (
                  <div key={todo.id} className="flex items-start gap-3">
                    <div className="mt-0.5" onClick={() => toggleTodo(todo.id)}>
                      {todo.done ? <CheckCircle2 size={18} className="text-slate-400 cursor-pointer"/> : <Circle size={18} className="text-slate-300 cursor-pointer"/>}
                    </div>
                    <div className="flex-1" onClick={() => toggleTodo(todo.id)}>
                      <p className={`text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{todo.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{todo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 檢視特定日期細節卡片 */}
        {selectedDateModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-xl relative p-6 border border-slate-100">
              <button onClick={() => setSelectedDateModal(null)} className="absolute top-4 right-4 p-1.5 bg-slate-100 rounded-full text-slate-500">
                <X size={18} />
              </button>

              {(() => {
                const entry = memories.find(m => m.date === selectedDateModal);
                if (!entry) return null;
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <h2 className="text-lg font-bold text-slate-700">{entry.date}</h2>
                      <SvgOrb moodId={entry.mood} size="sm" />
                    </div>
                    {entry.images.length > 0 && (
                      <img src={entry.images[0]} className="w-full h-40 object-cover rounded-xl" alt="手帳照片" />
                    )}
                    {entry.music && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl flex items-center gap-2">
                        <Music size={14} className="animate-spin" /> {entry.music}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                    <div className="flex gap-4 text-xs text-slate-400">
                      {entry.steps && <span>👣 {entry.steps} 步</span>}
                      {entry.weather && <span>🌤️ 天氣狀態</span>}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 手帳自由剪貼畫布 (DIY Scrapbook) ---
  const renderScrapbook = () => (
    <div className="flex-1 bg-[#FBF9F4] flex flex-col relative overflow-hidden">
      <div className="px-6 pt-12 pb-4 flex justify-between items-center z-20 bg-[#FBF9F4]">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-white rounded-full text-slate-600 shadow-xs"><X size={20} /></button>
        <span className="text-sm font-bold text-slate-500 tracking-widest">MONTHLY DUMP PUNCH</span>
        <button className="px-4 py-1.5 bg-slate-700 text-white rounded-full text-xs font-bold shadow-xs">匯出</button>
      </div>

      <div className="flex-1 relative overflow-hidden touch-none" style={{ touchAction: 'none' }}>
        {scrapbookItems.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-8 text-center pointer-events-none">
            <StickyNote size={48} className="mb-2 stroke-1" />
            <p className="text-xs">月底自由手帳畫布<br/>點擊下方工具欄加入照片、文字或紙膠帶，自由拖曳拼貼</p>
          </div>
        )}
        
        {scrapbookItems.map(item => (
          <div 
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute cursor-move transition-transform ${dragInfo?.id === item.id ? 'scale-105 shadow-xl' : 'shadow-xs'}`}
            style={{ 
              transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`,
              zIndex: item.zIndex,
              userSelect: 'none'
            }}
          >
             {dragInfo?.id === item.id && (
               <button 
                 onPointerDown={(e) => { e.stopPropagation(); removeScrapbookItem(item.id); }}
                 className="absolute -top-3 -right-3 w-5 h-5 bg-slate-500 text-white rounded-full flex items-center justify-center z-50 text-[10px]"
               ><X size={10}/></button>
             )}

             {item.type === 'photo' && (
               <div className="bg-white p-2 pb-6 border border-slate-100 rounded-xs pointer-events-none">
                 <div className="w-32 h-32 bg-slate-200 rounded-xs flex items-center justify-center text-slate-400 text-xs">相簿照片素材</div>
               </div>
             )}
             {item.type === 'video' && (
               <div className="bg-white p-2 pb-6 border border-slate-100 rounded-xs pointer-events-none">
                 <div className="w-32 h-32 bg-slate-300 rounded-xs flex items-center justify-center text-slate-500 text-xs"><PlaySquare size={20}/></div>
               </div>
             )}
             {item.type === 'text' && (
               <div className="text-lg text-slate-700 font-bold px-2 pointer-events-none bg-white/40 rounded">
                 {item.content}
               </div>
             )}
             {item.type === 'tape' && (
               <div className="w-20 h-5 bg-amber-200/40 border-x border-dashed border-amber-300 pointer-events-none"></div>
             )}
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-slate-50 p-4 pb-8 flex justify-around z-20 shadow-lg">
         <button onClick={() => addScrapbookItem('photo')} className="flex flex-col items-center gap-1 text-slate-500">
           <ImageIcon size={20}/><span className="text-[9px] font-bold">照片</span>
         </button>
         <button onClick={() => addScrapbookItem('video')} className="flex flex-col items-center gap-1 text-slate-500">
           <PlaySquare size={20}/><span className="text-[9px] font-bold">影片</span>
         </button>
         <button onClick={() => addScrapbookItem('text')} className="flex flex-col items-center gap-1 text-slate-500">
           <Type size={20}/><span className="text-[9px] font-bold">文字</span>
         </button>
         <button onClick={() => addScrapbookItem('tape')} className="flex flex-col items-center gap-1 text-slate-500">
           <StickyNote size={20}/><span className="text-[9px] font-bold">紙膠帶</span>
         </button>
      </div>
    </div>
  );

  // --- 統計數據頁面 (情緒與記帳分離夾層) ---
  const renderStats = () => (
    <div className="flex-1 overflow-y-auto pb-24 relative bg-slate-50 px-6 pt-12">
      <div className="flex justify-center bg-slate-200/60 p-1 rounded-xl mb-6">
        <button onClick={() => setStatsTab('mood')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statsTab === 'mood' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'}`}>情緒玻璃球</button>
        <button onClick={() => setStatsTab('finance')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statsTab === 'finance' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'}`}>記帳開銷明細</button>
      </div>

      {statsTab === 'mood' ? (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4">月度情緒統計分佈</h3>
          <div className="space-y-4">
            {Object.keys(MOODS).map(k => {
              const count = memories.filter(m => m.mood === k).length;
              return (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-10">{MOODS[k].name}</span>
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: MOODS[k].dark, width: `${count ? Math.min(count * 20, 100) : 5}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">{count} 顆</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-2">總支出開銷</h3>
            <p className="text-2xl font-black text-slate-800">NT$ {finances.reduce((acc, curr) => acc + curr.amount, 0)}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
            {finances.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">目前尚無記帳開銷明細</p>
            ) : (
              finances.map(f => (
                <div key={f.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                  <div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-bold mr-2">{f.category}</span>
                    <span className="text-slate-600 text-xs">{f.note || '未備註'}</span>
                  </div>
                  <span className="font-bold text-slate-700">-${f.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  // --- 大腦儲藏室 ---
  const renderStorage = () => (
    <div className="flex-1 flex flex-col bg-slate-900 h-full overflow-y-auto text-white p-6 pt-12">
       <h1 className="text-xl font-bold mb-1 flex items-center gap-2"><Archive className="text-amber-400" /> 大腦儲藏空間</h1>
       <p className="text-xs text-slate-400 mb-8">月底自動封存的星雲集合</p>

       <div className="space-y-6">
         <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/50 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-slate-600 via-slate-500 to-amber-700/40 shadow-inner mb-4 relative">
               <div className="absolute inset-2 border border-dashed border-white/10 rounded-full animate-spin"></div>
            </div>
            <div className="flex items-center gap-2">
               <input type="text" value={planetName} onChange={(e) => setPlanetName(e.target.value)} className="bg-transparent text-sm font-bold text-white text-center outline-none border-b border-slate-700 focus:border-amber-400 w-36" />
               <Edit2 size={12} className="text-slate-500" />
            </div>
         </div>
       </div>
    </div>
  );

  // --- 新增功能表單頁面 ---
  const renderAddMemory = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="px-6 pt-12 pb-4 bg-white flex justify-between items-center shadow-xs z-10">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-slate-100 rounded-full text-slate-600"><X size={18} /></button>
        <h2 className="text-sm font-bold text-slate-700">生活日誌封存</h2>
        <button onClick={handleSaveMemory} className="p-2 bg-slate-800 rounded-full text-white"><Check size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500">日期時間</span>
           <input type="date" value={memoryDraft.date} onChange={(e) => setMemoryDraft({...memoryDraft, date: e.target.value})} className="outline-none text-sm text-slate-700 bg-transparent font-medium" />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-400 mb-4">今天的心情莫蘭迪玻璃球</p>
          <div className="flex justify-center gap-3">
            {Object.keys(MOODS).map(k => (
              <SvgOrb key={k} moodId={k} size="md" isSelected={memoryDraft.mood === k} onClick={() => setMemoryDraft({...memoryDraft, mood: k})} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4 text-xs text-slate-500">
          <div>
            <label className="block font-bold mb-1.5">專屬背景音樂 (BGM)</label>
            <input type="text" placeholder="輸入今天適合的歌曲..." value={memoryDraft.music} onChange={e => setMemoryDraft({...memoryDraft, music: e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl outline-none text-slate-700" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1.5">生理期流量</label>
              <select value={memoryDraft.period} onChange={e => setMemoryDraft({...memoryDraft, period: e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl outline-none text-slate-700">
                <option value="none">沒來</option>
                <option value="light">量少</option>
                <option value="normal">正常</option>
                <option value="heavy">量多</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1.5">健康步數連動</label>
              <input type="number" placeholder="8500" value={memoryDraft.steps} onChange={e => setMemoryDraft({...memoryDraft, steps: e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl outline-none text-slate-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4">
          <textarea placeholder="寫下當下的心情與對話細節..." className="w-full h-24 text-sm outline-none resize-none text-slate-700 placeholder:text-slate-300 leading-relaxed" value={memoryDraft.text} onChange={(e) => setMemoryDraft({...memoryDraft, text: e.target.value})} />
        </div>
      </div>
    </div>
  );

  const renderAddFinance = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="px-6 pt-12 pb-4 bg-white flex justify-between items-center shadow-xs z-10">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-slate-100 rounded-full text-slate-600"><X size={18} /></button>
        <h2 className="text-sm font-bold text-slate-700">記一筆帳目</h2>
        <button onClick={handleSaveFinance} className="p-2 bg-slate-800 rounded-full text-white"><Check size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100">
          <label className="block text-xs font-bold text-slate-400 mb-2">支出金額 (NT$)</label>
          <input type="number" placeholder="0" value={financeDraft.amount} onChange={e => setFinanceDraft({...financeDraft, amount: e.target.value})} className="w-full outline-none text-2xl font-bold text-slate-700" />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-400 mb-1.5">分類標籤</label>
            <div className="grid grid-cols-4 gap-2">
              {['飲食', '交通', '購物', '娛樂'].map(c => (
                <button key={c} onClick={() => setFinanceDraft({...financeDraft, category: c})} className={`py-1.5 rounded-lg border font-bold ${financeDraft.category === c ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <label className="block font-bold text-slate-400 mb-1.5">備註說明</label>
            <input type="text" placeholder="例如：午餐酪梨吐司..." value={financeDraft.note} onChange={e => setFinanceDraft({...financeDraft, note: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg outline-none text-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );

  const hideNav = ['add_memory', 'add_finance', 'dump'].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center overflow-hidden font-sans text-slate-800">
      <div className="w-full max-w-md bg-white h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden sm:border-8 border-slate-800">
        
        {currentView === 'home' && renderHome()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'storage' && renderStorage()}
        {currentView === 'add_memory' && renderAddMemory()}
        {currentView === 'add_finance' && renderAddFinance()}
        {currentView === 'dump' && renderScrapbook()}

        {showAddMenu && !hideNav && (
          <div className="absolute inset-0 z-40 bg-slate-900/20 backdrop-blur-xs flex flex-col justify-end pb-32 items-center">
            <div className="flex gap-6 mb-4 z-50">
              <button onClick={() => { setShowAddMenu(false); setCurrentView('add_memory'); }} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md"><Smile size={20} /></div>
                <span className="text-[10px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs">封存記憶</span>
              </button>
              <button onClick={() => { setShowAddMenu(false); setCurrentView('add_finance'); }} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-md"><DollarSign size={20} /></div>
                <span className="text-[10px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs">記一筆帳</span>
              </button>
            </div>
            <div className="absolute inset-0 bg-transparent" onClick={() => setShowAddMenu(false)}></div>
          </div>
        )}

        {!hideNav && (
          <div className={`absolute bottom-0 left-0 right-0 border-t z-30 px-6 py-4 pb-8 sm:pb-6 flex justify-between items-center
            ${currentView === 'storage' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/80 border-white/40 backdrop-blur-md'}
          `}>
            <button onClick={() => setCurrentView('home')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'home' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              <Home size={22} /><span className="text-[9px]">日曆</span>
            </button>
            <button onClick={() => setCurrentView('stats')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'stats' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              <PieChart size={22} /><span className="text-[9px]">統計</span>
            </button>
            <div className="relative -top-6">
              <button onClick={() => setShowAddMenu(!showAddMenu)} className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-md transition-all ${showAddMenu ? 'bg-slate-600 rotate-45' : 'bg-slate-800'}`}>
                <Plus size={28} />
              </button>
            </div>
            <button onClick={() => setCurrentView('storage')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'storage' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
              <Archive size={22} /><span className="text-[9px]">星球</span>
            </button>
            <button className="p-1.5 flex flex-col items-center gap-0.5 text-slate-400">
              <User size={22} /><span className="text-[9px]">我的</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}