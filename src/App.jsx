import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Plus, PieChart, User, Camera, 
  Sparkles, Coffee, DollarSign, Shirt, 
  ChevronLeft, Check, Image as ImageIcon, Smile,
  Calendar as CalendarIcon, Archive, X, ChevronRight,
  Sun, Cloud, CloudRain, Snowflake, Music, 
  Footprints, Droplets, CheckCircle2, Circle,
  ScanFace, Edit2, PlaySquare, Type, StickyNote, Trash2, Play
} from 'lucide-react';

// --- 設定常數：莫蘭迪色系 (Morandi Colors) ---
const MOODS = {
  joy: { id: 'joy', name: '開心', light: '#E2D9C8', dark: '#B5A48C', face: 'joy' },       // 莫蘭迪灰黃
  sadness: { id: 'sadness', name: '悲傷', light: '#D0D7DE', dark: '#7A8B99', face: 'sadness' }, // 莫蘭迪藍灰
  anger: { id: 'anger', name: '憤怒', light: '#E8D3D1', dark: '#A37A74', face: 'anger' },     // 莫蘭迪磚紅
  disgust: { id: 'disgust', name: '厭惡', light: '#D3DDD4', dark: '#839987', face: 'disgust' }, // 莫蘭迪綠灰
};

const CATEGORY_COLORS = {
  '飲食': '#F59E0B', // Amber
  '交通': '#3B82F6', // Blue
  '購物': '#EC4899', // Pink
  '娛樂': '#8B5CF6', // Purple
  '訂閱': '#14B8A6', // Teal
  '薪資': '#10B981', // Emerald (收入)
  '獎金': '#FBBF24', // Yellow (收入)
  '投資': '#6366F1', // Indigo (收入)
  '其他': '#94A3B8'  // Slate
};

const EXPENSE_CATEGORIES = ['飲食', '交通', '購物', '娛樂', '訂閱', '其他'];
const INCOME_CATEGORIES = ['薪資', '獎金', '投資', '其他'];

// --- 安全讀取 Local Storage 防崩潰輔助函數 ---
const safelyParseJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`讀取 ${key} 失敗，將重置為預設值避免崩潰。`, e);
    return fallback;
  }
};

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
  
  // 導入 localStorage (全面換上安全防護機制，避免舊資料損壞導致白畫面)
  const [memories, setMemories] = useState(() => safelyParseJSON('memoryorbs_memories', []));
  const [todos, setTodos] = useState(() => safelyParseJSON('memoryorbs_todos', []));
  const [finances, setFinances] = useState(() => safelyParseJSON('memoryorbs_finances', []));
  const [planetName, setPlanetName] = useState(() => localStorage.getItem('memoryorbs_planetName') || '未命名的小宇宙');
  const [userName, setUserName] = useState(() => localStorage.getItem('memoryorbs_userName') || '小晴');

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(null); 
  const [actionMenuDate, setActionMenuDate] = useState(null); // 用於點擊空白日期時彈出
  
  const [addingTodo, setAddingTodo] = useState(false);
  const [newTodoDraft, setNewTodoDraft] = useState({ text: '', date: new Date().toISOString().split('T')[0] });
  const [editingMemoryId, setEditingMemoryId] = useState(null);

  // 日期狀態 (控制日曆與圖表顯示的年月)
  const todayStr = new Date().toISOString().split('T')[0];
  const [displayDate, setDisplayDate] = useState(new Date());

  useEffect(() => { localStorage.setItem('memoryorbs_memories', JSON.stringify(memories)); }, [memories]);
  useEffect(() => { localStorage.setItem('memoryorbs_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('memoryorbs_finances', JSON.stringify(finances)); }, [finances]);
  useEffect(() => { localStorage.setItem('memoryorbs_planetName', planetName); }, [planetName]);
  useEffect(() => { localStorage.setItem('memoryorbs_userName', userName); }, [userName]);

  const [memoryDraft, setMemoryDraft] = useState({
    date: todayStr, text: '', mood: null,
    weather: 'sun', music: '', period: 'none', images: []
  });

  const [financeDraft, setFinanceDraft] = useState({
    date: todayStr, amount: '', category: '飲食', note: '', type: 'expense'
  });

  const [statsTab, setStatsTab] = useState('mood');

  // 多圖上傳邏輯 (上限 3 張)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (memoryDraft.images.length >= 3) return; // 限制 3 張
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setMemoryDraft(prev => ({ ...prev, images: [...prev.images, compressedBase64] }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDraftImage = (index) => {
    setMemoryDraft(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

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
    
    if (editingMemoryId) {
      setMemories(memories.map(m => m.id === editingMemoryId ? { ...memoryDraft, id: editingMemoryId } : m));
    } else {
      const existingEntry = memories.find(m => m.date === memoryDraft.date);
      if (existingEntry) {
        setMemories(memories.map(m => m.date === memoryDraft.date ? { ...memoryDraft, id: existingEntry.id } : m));
      } else {
        const newEntry = { id: Date.now(), ...memoryDraft };
        setMemories([newEntry, ...memories]);
      }
    }
    
    setEditingMemoryId(null);
    setMemoryDraft({ date: todayStr, text: '', mood: null, weather: 'sun', music: '', period: 'none', images: [] });
    setCurrentView('home');
  };

  const handleSaveFinance = () => {
    if (!financeDraft.amount) return;
    // 加入 type 屬性 (預設為 expense 支出)，舊資料也能完美相容
    const newFinance = { id: Date.now(), ...financeDraft, amount: Number(financeDraft.amount), type: financeDraft.type || 'expense' };
    setFinances([newFinance, ...finances]);
    setFinanceDraft({ date: todayStr, amount: '', category: '飲食', note: '', type: 'expense' });
    setCurrentView('home');
  };

  const changeMonth = (offset) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + offset, 1);
    setDisplayDate(newDate);
  };

  const handleDayClick = (dateStr, dayMemory) => {
    if (dayMemory) {
      setSelectedDateModal(dateStr);
    } else {
      setActionMenuDate(dateStr);
    }
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
    const currentYear = displayDate.getFullYear();
    const currentMonth = displayDate.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
    const currentMonthPrefix = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    // 加入安全檢查，避免舊有異常資料缺少 date 屬性導致崩潰
    const currentMonthMemories = memories.filter(m => m && m.date && m.date.startsWith(currentMonthPrefix));
    const hasActivePeriod = currentMonthMemories.some(m => m.date === todayStr && m.period !== 'none');

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
          </div>

          {/* 月份切換控制器 */}
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-md rounded-2xl p-2 mb-6 border border-white/60 shadow-sm">
             <button onClick={() => changeMonth(-1)} className="p-2 text-slate-600 hover:bg-white/60 rounded-xl transition"><ChevronLeft size={20}/></button>
             <div className="relative font-bold text-slate-700 tracking-wider">
               <span>{currentYear} 年 {currentMonth} 月</span>
               <input 
                 type="date" 
                 value={`${currentMonthPrefix}-01`}
                 onChange={(e) => {
                   if(e.target.value) {
                     // 轉換格式確保跨瀏覽器相容，並準確跳轉到選定的年月日
                     setDisplayDate(new Date(e.target.value.replace(/-/g, '/')));
                   }
                 }} 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
             </div>
             <button onClick={() => changeMonth(1)} className="p-2 text-slate-600 hover:bg-white/60 rounded-xl transition"><ChevronRight size={20}/></button>
          </div>

          {/* 玻璃記憶罐 */}
          <div className="relative w-28 h-36 mx-auto mb-8">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-800/40 rounded-full border-b-2 border-amber-900/20 z-20 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-md border-2 border-white/50 rounded-b-[2rem] rounded-t-xl shadow-[inset_0_0_15px_rgba(255,255,255,0.6)] z-10 flex flex-wrap-reverse content-start justify-center gap-1 p-3 pt-5 overflow-hidden">
              {currentMonthMemories.map((m, i) => (
                <SvgOrb key={i} moodId={m.mood} size="xs" />
              ))}
              <div className="absolute top-0 left-2 w-3 h-full bg-white/30 rounded-full skew-x-6 blur-[1px] pointer-events-none"></div>
            </div>
          </div>

          {/* 相片日曆網格 */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 mb-6 relative">
            <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-400">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(firstDayOfWeek).keys()].map(i => <div key={`empty-${i}`} className="aspect-square"></div>)}
              {[...Array(daysInMonth).keys()].map(i => {
                const day = i + 1;
                const dateStr = `${currentMonthPrefix}-${day.toString().padStart(2, '0')}`;
                const dayMemory = memories.find(m => m.date === dateStr);
                const isToday = dateStr === todayStr;
                const hasImage = dayMemory && dayMemory.images && dayMemory.images.length > 0;

                return (
                  <div 
                    key={day} 
                    onClick={() => handleDayClick(dateStr, dayMemory)}
                    className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all overflow-hidden cursor-pointer
                      ${isToday ? 'ring-2 ring-slate-400 bg-white shadow-sm' : 'bg-slate-100/40'}
                      ${dayMemory ? 'shadow-xs hover:scale-105' : 'hover:bg-slate-200/50'}
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

          {/* 待辦事項區塊 */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 shadow-xs border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-slate-500" /> 備忘規劃事項
              </h3>
              <button onClick={() => setAddingTodo(!addingTodo)} className="text-slate-600 bg-slate-200/60 p-1.5 rounded-full hover:bg-slate-300 transition-colors">
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
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative p-6 pt-10 border border-slate-100">
              <button onClick={() => setSelectedDateModal(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full text-slate-500 z-20">
                <X size={18} />
              </button>

              {(() => {
                const entry = memories.find(m => m.date === selectedDateModal);
                if (!entry) return null;
                
                const isUrl = entry.music?.startsWith('http');
                const musicLink = isUrl ? entry.music : `https://www.youtube.com/results?search_query=${encodeURIComponent(entry.music || '')}`;

                return (
                  <div className="space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar pb-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-3 mt-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-slate-700 tracking-wide">{entry.date.replace(/-/g, '.')}</h2>
                        <button onClick={() => {
                          setMemoryDraft({...entry});
                          setEditingMemoryId(entry.id);
                          setSelectedDateModal(null);
                          setCurrentView('add_memory');
                        }} className="text-slate-400 hover:text-amber-600 transition-colors bg-slate-100 p-1.5 rounded-full shadow-sm">
                          <Edit2 size={14} />
                        </button>
                      </div>
                      <SvgOrb moodId={entry.mood} size="sm" customClass="shadow-sm" />
                    </div>
                    
                    {entry.images && entry.images.length > 0 && (
                      <div className="flex overflow-x-auto gap-3 snap-x no-scrollbar pb-2">
                        {entry.images.map((img, idx) => (
                           <img key={idx} src={img} className="w-[85%] flex-shrink-0 snap-center h-48 object-cover rounded-2xl shadow-sm border border-slate-100" alt={`手帳照片 ${idx+1}`} />
                        ))}
                      </div>
                    )}
                    
                    {entry.music && (
                      <a href={musicLink} target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-3 rounded-2xl hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="relative w-14 h-14 rounded-full bg-slate-900 shadow-lg border-4 border-slate-800 group-hover:animate-[spin_3s_linear_infinite] flex items-center justify-center flex-shrink-0">
                              <div className="absolute inset-1 rounded-full border border-slate-700/50"></div>
                              <div className="absolute inset-2.5 rounded-full border border-slate-700/50"></div>
                              <div className="w-5 h-5 rounded-full bg-amber-400 border border-slate-800 flex items-center justify-center">
                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                              </div>
                           </div>
                           <div className="flex-1 overflow-hidden pr-2">
                             <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">
                                <Music size={12} className="text-amber-500" /> BGM
                             </div>
                             <p className="text-sm text-slate-700 font-bold truncate group-hover:text-amber-600 transition-colors">
                               {isUrl ? "🎵 點擊播放專屬音樂" : entry.music}
                             </p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:scale-110 transition-all flex-shrink-0">
                             <Play size={14} className="ml-0.5" />
                           </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-100 rounded-full opacity-20 blur-xl"></div>
                      </a>
                    )}

                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-sm text-slate-600 leading-loose whitespace-pre-wrap font-medium">{entry.text || '今天沒有留下文字內容...'}</p>
                    </div>
                    
                    <div className="flex gap-4 text-xs font-bold text-slate-400 pt-2 px-1">
                      {entry.weather === 'sun' && <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md"><Sun size={14}/> 晴朗</span>}
                      {entry.weather === 'cloud' && <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md"><Cloud size={14}/> 多雲</span>}
                      {entry.weather === 'rain' && <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md"><CloudRain size={14}/> 雨天</span>}
                      {entry.weather === 'snow' && <span className="flex items-center gap-1 bg-sky-50 text-sky-600 px-2 py-1 rounded-md"><Snowflake size={14}/> 下雪</span>}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        // ... existing code ...
        {/* 點擊空白日期彈出快速動作選單 */}
        {actionMenuDate && (
          <div className="absolute inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex flex-col justify-end">
             <div className="bg-white rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-[slideUp_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800">{actionMenuDate.replace(/-/g, '.')}</h3>
                   <button onClick={() => setActionMenuDate(null)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={18}/></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => {
                      setMemoryDraft({ date: actionMenuDate, text: '', mood: null, weather: 'sun', music: '', period: 'none', images: [] });
                      setCurrentView('add_memory');
                      setActionMenuDate(null);
                   }} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-amber-50 transition-colors">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><Smile size={24}/></div>
                      <span className="text-sm font-bold text-slate-700">寫日記</span>
                   </button>
                   <button onClick={() => {
                      setFinanceDraft({ date: actionMenuDate, amount: '', category: '飲食', note: '', type: 'expense' });
                      setCurrentView('add_finance');
                      setActionMenuDate(null);
                   }} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-50 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><DollarSign size={24}/></div>
                      <span className="text-sm font-bold text-slate-700">記一筆帳</span>
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    );
  };

  // --- 統計數據頁面 ---
  const renderStats = () => {
    const currentYear = displayDate.getFullYear();
    const currentMonth = displayDate.getMonth() + 1;
    const currentMonthPrefix = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    
    // 篩選當前月份的記帳資料，加入防呆檢查確保資料結構完整
    const monthFinances = finances.filter(f => f && f.date && f.date.startsWith(currentMonthPrefix));
    
    // 分別計算收入與支出 (強制轉為數字，防止出現 NaN 當機)
    const totalExpense = monthFinances.filter(f => !f.type || f.type === 'expense').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalIncome = monthFinances.filter(f => f.type === 'income').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const balance = totalIncome - totalExpense;

    // 計算各「支出」分類佔比
    const financeData = monthFinances.filter(f => !f.type || f.type === 'expense').reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + (Number(f.amount) || 0);
        return acc;
    }, {});

    let cumulativePercent = 0;
    const gradientStops = Object.entries(financeData).map(([cat, amount]) => {
        // 加入 > 0 的判斷，避免除以零產生數學錯誤(NaN)導致畫面崩潰
        const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
        const start = cumulativePercent;
        cumulativePercent += percent;
        return `${CATEGORY_COLORS[cat] || '#94A3B8'} ${start}% ${cumulativePercent}%`;
    });
    const pieGradient = `conic-gradient(${gradientStops.length > 0 ? gradientStops.join(', ') : '#f1f5f9 0% 100%'})`;

    return (
      <div className="flex-1 overflow-y-auto pb-24 relative bg-slate-50 px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold text-slate-800 tracking-wide">數據統計</h1>
           <div className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
              {currentYear} 年 {currentMonth} 月
           </div>
        </div>

        <div className="flex justify-center bg-slate-200/60 p-1 rounded-xl mb-6">
          <button onClick={() => setStatsTab('mood')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statsTab === 'mood' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'}`}>情緒玻璃球</button>
          <button onClick={() => setStatsTab('finance')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statsTab === 'finance' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'}`}>記帳開銷分析</button>
        </div>

        {statsTab === 'mood' ? (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">月度情緒統計分佈</h3>
            <div className="space-y-4">
              {Object.keys(MOODS).map(k => {
                const count = memories.filter(m => m.mood === k && m.date.startsWith(currentMonthPrefix)).length;
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-10">{MOODS[k].name}</span>
                    <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: MOODS[k].dark, width: `${count ? Math.min(count * 20, 100) : 5}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400 font-bold">{count} 顆</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* 總計與結餘區塊 */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
                 <h3 className="text-xs font-bold text-slate-400 mb-1">本月總支出</h3>
                 <p className="text-lg font-black text-slate-700">NT$ {totalExpense}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
                 <h3 className="text-xs font-bold text-slate-400 mb-1">本月總收入</h3>
                 <p className="text-lg font-black text-emerald-500">NT$ {totalIncome}</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 shadow-md flex justify-between items-center text-white">
               <span className="text-sm font-bold opacity-80">本月結餘</span>
               <span className="text-xl font-black">{balance > 0 ? '+' : ''}{balance}</span>
            </div>

            {/* 支出圓餅圖區塊 */}
            {totalExpense > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-bold text-slate-500 mb-4">支出佔比分析</h3>
                  
                  <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner" style={{ background: pieGradient }}>
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                        <PieChart className="text-slate-300 opacity-50" size={32} />
                      </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                      {Object.entries(financeData).map(([cat, amount]) => (
                        <div key={cat} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: CATEGORY_COLORS[cat] || '#94A3B8' }}></span>
                          {cat} <span className="text-slate-400">({Math.round((amount/totalExpense)*100)}%)</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 記帳明細列表 */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-700 mb-2 border-b border-slate-50 pb-2">收支明細</h3>
              {monthFinances.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">本月尚無記帳紀錄</p>
              ) : (
                monthFinances.sort((a,b) => new Date(b.date) - new Date(a.date)).map(f => {
                  const isIncome = f.type === 'income';
                  return (
                    <div key={f.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS[f.category] || '#94A3B8' }}></span>
                          <span className="font-bold text-slate-700 text-xs mr-2">{f.category}</span>
                          <span className="text-[10px] text-slate-400">{f.date}</span>
                        </div>
                        <span className="text-slate-500 text-xs pl-4">{f.note || '未備註'}</span>
                      </div>
                      <span className={`font-bold ${isIncome ? 'text-emerald-500' : 'text-slate-700'}`}>
                        {isIncome ? '+' : '-'}${f.amount}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 大腦儲藏室 (動態記憶星球) ---
  const renderStorage = () => {
    // 將所有記憶依據「年-月」進行分組
    const memoriesByMonth = memories.reduce((acc, m) => {
      if (!m || !m.date) return acc;
      const month = m.date.substring(0, 7); // 取出 YYYY-MM
      if (!acc[month]) acc[month] = [];
      acc[month].push(m);
      return acc;
    }, {});

    // 將月份由新到舊排序
    const sortedMonths = Object.keys(memoriesByMonth).sort((a, b) => b.localeCompare(a));

    return (
      <div className="flex-1 flex flex-col bg-slate-900 h-full overflow-y-auto text-white p-6 pt-12 pb-24">
         <div className="flex justify-between items-start mb-6">
           <div>
             <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><Sparkles className="text-amber-400" size={24} /> 記憶星系庫</h1>
             <p className="text-xs text-slate-400">每月的心情軌跡，將凝結成獨特的專屬星球</p>
           </div>
         </div>

         {/* 宇宙命名區塊 (保留原本的命名功能，升級為宇宙名稱) */}
         <div className="bg-slate-800/40 rounded-2xl p-4 mb-8 flex items-center justify-between border border-slate-700/50 shadow-sm">
           <span className="text-xs text-slate-400 font-bold">我的專屬宇宙命名</span>
           <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={planetName} 
                onChange={(e) => setPlanetName(e.target.value)} 
                className="bg-transparent text-sm font-bold text-amber-100 text-right outline-none border-b border-transparent focus:border-amber-400 w-32 transition-colors" 
                placeholder="未命名宇宙"
              />
              <Edit2 size={12} className="text-slate-500" />
           </div>
         </div>

         {sortedMonths.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Archive size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold">目前宇宙還是空蕩蕩的...</p>
              <p className="text-xs mt-2">去寫下第一篇日記創造星球吧！</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 gap-4">
               {sortedMonths.map(month => {
                  const monthMems = memoriesByMonth[month];
                  const [year, m] = month.split('-');
                  
                  return (
                     <div key={month} className="bg-gradient-to-b from-slate-800/80 to-slate-800/30 rounded-3xl p-5 border border-slate-700/50 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
                        <div className="w-24 h-24 rounded-full bg-slate-900 shadow-[0_0_20px_rgba(0,0,0,0.8)] mb-4 relative flex items-center justify-center">
                           
                           {/* 星球本體 (設為 overflow-hidden 確保顏色不出界) */}
                           <div className="absolute inset-0 rounded-full overflow-hidden">
                             <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                                {monthMems.map((mem, idx) => {
                                   const x = (idx * 137) % 120 - 10; 
                                   const y = (idx * 251) % 120 - 10;
                                   const size = 50 + ((idx * 73) % 60); 
                                   return (
                                     <div
                                        key={mem.id}
                                        className="absolute rounded-full blur-[8px] opacity-80"
                                        style={{
                                           backgroundColor: MOODS[mem.mood]?.dark || '#94A3B8',
                                           width: `${size}%`,
                                           height: `${size}%`,
                                           top: `${y}%`,
                                           left: `${x}%`,
                                        }}
                                     />
                                   )
                                })}
                             </div>
                             {/* 球體立體光影 */}
                             <div className="absolute inset-0 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.9),inset_4px_4px_10px_rgba(255,255,255,0.3)] pointer-events-none z-10"></div>
                           </div>
                           
                           {/* 星環裝飾 (超過 5 篇記憶解鎖星環) */}
                           {monthMems.length >= 5 && (
                              <div className="absolute w-[150%] h-[35%] border-[3px] border-white/10 rounded-[100%] rotate-12 z-20 shadow-[0_0_15px_rgba(255,255,255,0.15)] pointer-events-none"></div>
                           )}
                        </div>
                        
                        <h3 className="text-sm font-black text-slate-100 tracking-wider">{year}.{m}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">匯聚 {monthMems.length} 顆記憶</p>
                     </div>
                  )
               })}
            </div>
         )}
      </div>
    );
  };

  const hideNav = ['add_memory', 'add_finance'].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center overflow-hidden font-sans text-slate-800">
      <div className="w-full max-w-md bg-white h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden sm:border-8 border-slate-800">
        
        {currentView === 'home' && renderHome()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'storage' && renderStorage()}
        {currentView === 'profile' && renderProfile()}
        {currentView === 'add_memory' && renderAddMemory()}
        {currentView === 'add_finance' && renderAddFinance()}

        {showAddMenu && !hideNav && (
          <div className="absolute inset-0 z-40 bg-slate-900/30 backdrop-blur-sm flex flex-col justify-end pb-32 items-center transition-all animate-[fadeIn_0.2s_ease-out]">
            <div className="flex gap-8 mb-4 z-50">
              <button onClick={() => { 
                setShowAddMenu(false); 
                setEditingMemoryId(null);
                setMemoryDraft({ date: todayStr, text: '', mood: null, weather: 'sun', music: '', period: 'none', images: [] });
                setCurrentView('add_memory'); 
              }} className="flex flex-col items-center gap-2 hover:-translate-y-2 transition-transform">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-lg"><Smile size={24} /></div>
                <span className="text-xs font-bold text-white bg-slate-800/60 px-3 py-1 rounded-full backdrop-blur-md">寫日記</span>
              </button>
              <button onClick={() => { 
                 setShowAddMenu(false); 
                 setFinanceDraft({ date: todayStr, amount: '', category: '飲食', note: '', type: 'expense' });
                 setCurrentView('add_finance'); 
              }} className="flex flex-col items-center gap-2 hover:-translate-y-2 transition-transform">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg"><DollarSign size={24} /></div>
                <span className="text-xs font-bold text-white bg-slate-800/60 px-3 py-1 rounded-full backdrop-blur-md">記帳</span>
              </button>
            </div>
            <div className="absolute inset-0 bg-transparent" onClick={() => setShowAddMenu(false)}></div>
          </div>
        )}

        {!hideNav && (
          <div className={`absolute bottom-0 left-0 right-0 border-t z-30 px-6 py-4 pb-8 sm:pb-6 flex justify-between items-center transition-colors
            ${currentView === 'storage' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/90 border-slate-100 backdrop-blur-xl'}
          `}>
            <button onClick={() => setCurrentView('home')} className={`p-1.5 flex flex-col items-center gap-0.5 transition-colors ${currentView === 'home' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              <Home size={22} /><span className="text-[10px]">日曆</span>
            </button>
            <button onClick={() => setCurrentView('stats')} className={`p-1.5 flex flex-col items-center gap-0.5 transition-colors ${currentView === 'stats' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              <PieChart size={22} /><span className="text-[10px]">統計</span>
            </button>
            <div className="relative -top-6">
              <button onClick={() => setShowAddMenu(!showAddMenu)} className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg shadow-slate-300/50 transition-all duration-300 ${showAddMenu ? 'bg-slate-600 rotate-45 scale-90 shadow-none' : 'bg-slate-800 hover:scale-105'}`}>
                <Plus size={28} />
              </button>
            </div>
            <button onClick={() => setCurrentView('storage')} className={`p-1.5 flex flex-col items-center gap-0.5 transition-colors ${currentView === 'storage' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
              <Archive size={22} /><span className="text-[10px]">星球</span>
            </button>
            <button onClick={() => setCurrentView('profile')} className={`p-1.5 flex flex-col items-center gap-0.5 transition-colors ${currentView === 'profile' ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              <User size={22} /><span className="text-[10px]">我的</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}