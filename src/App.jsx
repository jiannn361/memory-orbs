import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Plus, PieChart, User, Camera, 
  Sparkles, Coffee, DollarSign, Shirt, 
  ChevronLeft, Check, Image as ImageIcon, Smile,
  Calendar as CalendarIcon, Archive, X, ChevronRight,
  Sun, Cloud, CloudRain, Snowflake, Music, 
  Footprints, Droplets, CheckCircle2, Circle,
  ScanFace, Share2, Edit2, PlaySquare, Type, StickyNote, Trash2, Play, Wallet
} from 'lucide-react';

const MOODS = {
  joy: { id: 'joy', name: '開心', light: '#E2D9C8', dark: '#B5A48C', face: 'joy' },       // 莫蘭迪灰黃
  sadness: { id: 'sadness', name: '悲傷', light: '#D0D7DE', dark: '#7A8B99', face: 'sadness' }, // 莫蘭迪藍灰
  anger: { id: 'anger', name: '憤怒', light: '#E8D3D1', dark: '#A37A74', face: 'anger' },     // 莫蘭迪磚紅
  disgust: { id: 'disgust', name: '厭惡', light: '#D3DDD4', dark: '#839987', face: 'disgust' }, // 莫蘭迪綠灰
};

const INITIAL_MEMORIES = [];
const INITIAL_TODOS = [];

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
  
  // 導入 localStorage
  const [userName, setUserName] = useState(() => localStorage.getItem('memoryorbs_userName') || '小晴');
  const [memories, setMemories] = useState(() => JSON.parse(localStorage.getItem('memoryorbs_memories')) || INITIAL_MEMORIES);
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('memoryorbs_todos')) || INITIAL_TODOS);
  const [finances, setFinances] = useState(() => JSON.parse(localStorage.getItem('memoryorbs_finances')) || []);
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(null); 
  const [planetName, setPlanetName] = useState(() => localStorage.getItem('memoryorbs_planetName') || '未命名的小宇宙');
  const [addingTodo, setAddingTodo] = useState(false);
  
  // 今日日期與當前瀏覽月份
  const todayStr = new Date().toISOString().split('T')[0];
  const [newTodoDraft, setNewTodoDraft] = useState({ text: '', date: todayStr });
  const [viewingMonth, setViewingMonth] = useState(() => {
    const d = new Date(todayStr);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [editingMemoryId, setEditingMemoryId] = useState(null);

  // 監聽存檔
  useEffect(() => { localStorage.setItem('memoryorbs_userName', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('memoryorbs_memories', JSON.stringify(memories)); }, [memories]);
  useEffect(() => { localStorage.setItem('memoryorbs_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('memoryorbs_finances', JSON.stringify(finances)); }, [finances]);
  useEffect(() => { localStorage.setItem('memoryorbs_planetName', planetName); }, [planetName]);

  const [memoryDraft, setMemoryDraft] = useState({
    date: todayStr, text: '', mood: null,
    weather: 'sun', music: '', period: 'none', images: []
  });

  const [financeDraft, setFinanceDraft] = useState({
    date: todayStr, amount: '', category: '飲食', note: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && memoryDraft.images.length < 3) { // 限制最多3張
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

  const removeDraftImage = (indexToRemove) => {
    setMemoryDraft(prev => ({
      ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const [statsTab, setStatsTab] = useState('mood');

  const handlePrevMonth = () => setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1));

  const toggleTodo = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));

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
    const newFinance = { id: Date.now(), ...financeDraft, amount: Number(financeDraft.amount) };
    setFinances([newFinance, ...finances]);
    setFinanceDraft({ date: todayStr, amount: '', category: '飲食', note: '' });
    setCurrentView('home');
  };

  const renderHome = () => {
    const currentYear = viewingMonth.getFullYear();
    const currentMonth = viewingMonth.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
    const currentMonthPrefix = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    const currentMonthMemories = memories.filter(m => m.date.startsWith(currentMonthPrefix));
    const hasActivePeriod = currentMonthMemories.some(m => m.date === todayStr && m.period !== 'none');

    return (
      <div className="flex-1 overflow-y-auto pb-24 relative scroll-smooth">
        <SkyBackground />
        
        <div className="relative z-10 pt-12 px-6 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-wide">生活手帳日誌</h1>
              <div className="flex items-center gap-3 mt-2 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full inline-flex border border-white/60 shadow-sm">
                <button onClick={handlePrevMonth} className="text-slate-400 hover:text-amber-600 transition"><ChevronLeft size={16}/></button>
                <span className="text-sm font-bold text-slate-700 tracking-wider w-20 text-center">{currentYear} / {currentMonth.toString().padStart(2,'0')}</span>
                <button onClick={handleNextMonth} className="text-slate-400 hover:text-amber-600 transition"><ChevronRight size={16}/></button>
              </div>
            </div>
            <button onClick={() => setCurrentView('dump')} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-slate-600 border border-white hover:scale-105 transition mt-1">
              <Share2 size={18} />
            </button>
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
                    key={day} onClick={() => setSelectedDateModal(dateStr)}
                    className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all overflow-hidden cursor-pointer
                      ${isToday ? 'ring-2 ring-slate-400 bg-white shadow-sm' : 'bg-slate-100/40 hover:bg-white hover:shadow-xs'}
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
                {todos.map(todo => {
                  const isPast = new Date(todo.date) < new Date(todayStr);
                  const isToday = todo.date === todayStr;
                  return (
                    <div key={todo.id} className="flex items-start gap-3 group">
                      <div className="mt-0.5" onClick={() => toggleTodo(todo.id)}>
                        {todo.done ? <CheckCircle2 size={18} className="text-slate-400 cursor-pointer"/> : <Circle size={18} className="text-slate-300 cursor-pointer"/>}
                      </div>
                      <div className="flex-1" onClick={() => toggleTodo(todo.id)}>
                        <p className={`text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{todo.text}</p>
                        <p className={`text-[10px] mt-0.5 font-medium ${isPast && !todo.done ? 'text-red-400' : isToday ? 'text-amber-600' : 'text-slate-400'}`}>
                          {isToday ? '今天' : todo.date}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {}
        {selectedDateModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6 animate-fade-in">
            <div className="bg-[#FBF9F4] w-full max-h-[85vh] sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col">
              
              <div className="px-6 pt-8 pb-4 flex justify-between items-center border-b border-slate-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                <h2 className="text-2xl font-black text-slate-700 tracking-wider font-serif">{selectedDateModal.replace(/-/g, '.')}</h2>
                <button onClick={() => setSelectedDateModal(null)} className="p-2 bg-slate-200 hover:bg-slate-300 transition-colors rounded-full text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {/* 日記區塊 */}
                <div>
                  {(() => {
                    const entry = memories.find(m => m.date === selectedDateModal);
                    if (!entry) {
                      return (
                        <button onClick={() => {
                          setMemoryDraft({ date: selectedDateModal, text: '', mood: null, weather: 'sun', music: '', period: 'none', images: [] });
                          setSelectedDateModal(null);
                          setCurrentView('add_memory');
                        }} className="w-full py-6 border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 flex flex-col items-center gap-2 hover:bg-white hover:border-amber-300 hover:text-amber-600 transition-all">
                          <Smile size={24} />
                          <span className="text-sm font-bold tracking-wide">補寫本日手帳</span>
                        </button>
                      );
                    }
                    
                    const isUrl = entry.music?.startsWith('http');
                    const musicLink = isUrl ? entry.music : `https://www.youtube.com/results?search_query=${encodeURIComponent(entry.music)}`;

                    return (
                      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                          <SvgOrb moodId={entry.mood} size="sm" customClass="shadow-sm" />
                          <button onClick={() => {
                            setMemoryDraft({...entry});
                            setEditingMemoryId(entry.id);
                            setSelectedDateModal(null);
                            setCurrentView('add_memory');
                          }} className="text-slate-400 hover:text-amber-600 bg-slate-50 p-2 rounded-full transition-colors">
                            <Edit2 size={14} />
                          </button>
                        </div>

                        {/* 照片輪播 */}
                        {entry.images.length > 0 && (
                          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar pb-4 -mx-1 px-1">
                            {entry.images.map((img, idx) => (
                              <img key={idx} src={img} className="w-[85%] flex-shrink-0 snap-center h-48 object-cover rounded-2xl shadow-sm border border-slate-50" alt="手帳照片" />
                            ))}
                          </div>
                        )}

                        <p className="text-sm text-slate-600 leading-loose whitespace-pre-wrap font-medium mb-6 px-1">{entry.text}</p>

                        {/* 黑膠唱片音樂 */}
                        {entry.music && (
                          <a href={musicLink} target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-3 rounded-2xl hover:shadow-md transition-all group relative overflow-hidden mb-4">
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="relative w-12 h-12 rounded-full bg-slate-900 shadow-md border-[3px] border-slate-800 group-hover:animate-[spin_3s_linear_infinite] flex items-center justify-center flex-shrink-0">
                                  <div className="absolute inset-1 rounded-full border border-slate-700/50"></div>
                                  <div className="absolute inset-2.5 rounded-full border border-slate-700/50"></div>
                                  <div className="w-4 h-4 rounded-full bg-amber-400 border border-slate-800 flex items-center justify-center">
                                     <div className="w-1 h-1 rounded-full bg-slate-900"></div>
                                  </div>
                               </div>
                               <div className="flex-1 overflow-hidden pr-2">
                                 <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                                    <Music size={10} className="text-amber-500" /> BGM
                                 </div>
                                 <p className="text-xs text-slate-700 font-bold truncate group-hover:text-amber-600 transition-colors">
                                   {isUrl ? "🎵 點擊前往播放專屬音樂" : entry.music}
                                 </p>
                               </div>
                               <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-all flex-shrink-0">
                                 <Play size={10} className="ml-0.5" />
                               </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-100 rounded-full opacity-20 blur-xl"></div>
                          </a>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                          {entry.weather === 'sun' && <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl"><Sun size={14}/> 晴朗</span>}
                          {entry.weather === 'cloud' && <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl"><Cloud size={14}/> 多雲</span>}
                          {entry.weather === 'rain' && <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl"><CloudRain size={14}/> 雨天</span>}
                          {entry.weather === 'snow' && <span className="flex items-center gap-1 bg-sky-50 text-sky-600 px-3 py-1.5 rounded-xl"><Snowflake size={14}/> 下雪</span>}
                          {entry.period !== 'none' && <span className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1.5 rounded-xl"><Droplets size={14}/> 經期</span>}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 記帳區塊 */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                    <Wallet size={16} className="text-amber-500"/> 本日開銷
                  </h3>
                  
                  {(() => {
                    const dayFinances = finances.filter(f => f.date === selectedDateModal);
                    return (
                      <div className="space-y-3">
                        {dayFinances.length > 0 ? (
                          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
                            {dayFinances.map(f => (
                              <div key={f.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">{f.category}</span>
                                  <span className="text-slate-600 text-xs truncate max-w-[100px]">{f.note || '未備註'}</span>
                                </div>
                                <span className="font-bold text-slate-700">-${f.amount}</span>
                              </div>
                            ))}
                            <div className="pt-2 flex justify-between items-center text-xs font-bold text-slate-400 border-t border-slate-100">
                              <span>本日總計</span>
                              <span className="text-sm text-slate-700">NT$ {dayFinances.reduce((sum, f) => sum + f.amount, 0)}</span>
                            </div>
                          </div>
                        ) : null}
                        
                        <button onClick={() => {
                          setFinanceDraft({ date: selectedDateModal, amount: '', category: '飲食', note: '' });
                          setSelectedDateModal(null);
                          setCurrentView('add_finance');
                        }} className="w-full py-3.5 bg-amber-50 text-amber-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors">
                          <Plus size={16} /> 補記一筆開銷
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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

  const renderStats = () => (
    <div className="flex-1 overflow-y-auto pb-24 relative bg-slate-50 px-6 pt-12">
      <div className="flex justify-center bg-slate-200/60 p-1 rounded-xl mb-6">
        <button onClick={() => setStatsTab('mood')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statsTab === 'mood' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'}`}>情緒玻璃球</button>
        <button onClick={() => setStatsTab('finance')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statsTab === 'finance' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'}`}>記帳開銷明細</button>
      </div>

      {statsTab === 'mood' ? (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4">總情緒統計分佈</h3>
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

  const renderStorage = () => {
    return (
      <div className="flex-1 flex flex-col bg-slate-900 h-full overflow-y-auto text-white p-6 pt-12">
         <h1 className="text-xl font-bold mb-1 flex items-center gap-2"><Archive className="text-amber-400" /> 大腦儲藏空間</h1>
         <p className="text-xs text-slate-400 mb-8">總結所有情緒的記憶星球</p>

         <div className="space-y-6">
           <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/50 flex flex-col items-center">
              
              <div className="w-40 h-40 rounded-full bg-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                   {memories.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-600 font-bold z-20">尚未形成星雲</div>
                   ) : (
                      memories.map((m, idx) => {
                         const x = (idx * 137) % 120 - 10; 
                         const y = (idx * 251) % 120 - 10;
                         const size = 50 + ((idx * 73) % 60); 
                         
                         return (
                           <div
                              key={m.id}
                              className="absolute rounded-full blur-[10px] opacity-80"
                              style={{
                                 backgroundColor: MOODS[m.mood].dark,
                                 width: `${size}%`,
                                 height: `${size}%`,
                                 top: `${y}%`,
                                 left: `${x}%`,
                              }}
                           />
                         )
                      })
                   )}
                 </div>
                 <div className="absolute inset-0 rounded-full shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.8),inset_5px_5px_15px_rgba(255,255,255,0.4)] pointer-events-none z-10"></div>
              </div>

              <div className="flex items-center gap-2">
                 <input type="text" value={planetName} onChange={(e) => setPlanetName(e.target.value)} className="bg-transparent text-sm font-bold text-white text-center outline-none border-b border-slate-700 focus:border-amber-400 w-36" />
                 <Edit2 size={12} className="text-slate-500" />
              </div>
           </div>
         </div>
      </div>
    );
  };

  const renderAddMemory = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="px-6 pt-12 pb-4 bg-white flex justify-between items-center shadow-xs z-10">
        <button onClick={() => {
          setCurrentView('home');
          setEditingMemoryId(null);
          setMemoryDraft({ date: todayStr, text: '', mood: null, weather: 'sun', music: '', period: 'none', images: [] });
        }} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition"><X size={18} /></button>
        <h2 className="text-sm font-bold text-slate-700">{editingMemoryId ? '編輯生活手帳' : '封存生活記憶'}</h2>
        <button onClick={handleSaveMemory} className="p-2 bg-slate-800 hover:bg-slate-700 transition rounded-full text-white"><Check size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500 flex items-center gap-2"><CalendarIcon size={14}/> 日期時間</span>
           <input type="date" value={memoryDraft.date} onChange={(e) => setMemoryDraft({...memoryDraft, date: e.target.value})} className="outline-none text-sm text-slate-700 bg-transparent font-bold" />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-400 mb-4">選擇這顆記憶的顏色</p>
          <div className="flex justify-center gap-3">
            {Object.keys(MOODS).map(k => (
              <SvgOrb key={k} moodId={k} size="md" isSelected={memoryDraft.mood === k} onClick={() => setMemoryDraft({...memoryDraft, mood: k})} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4 text-xs text-slate-500">
          <div>
             <div className="flex items-center justify-between mb-2">
               <label className="font-bold">手帳照片紀錄</label>
               {memoryDraft.images.length < 3 && (
                 <label htmlFor="photo-upload" className="bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 flex items-center gap-1 cursor-pointer hover:bg-slate-200 transition-colors font-bold">
                   <Camera size={14} /> 新增照片 ({memoryDraft.images.length}/3)
                 </label>
               )}
               <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
             </div>
             
             {memoryDraft.images.length > 0 && (
               <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar pb-1">
                 {memoryDraft.images.map((img, idx) => (
                   <div key={idx} className="relative inline-block flex-shrink-0">
                     <img src={img} alt="預覽" className="h-24 w-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                     <button onClick={() => removeDraftImage(idx)} className="absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full shadow-md"><X size={10} /></button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div className="pt-2">
            <label className="block font-bold mb-1.5 flex items-center gap-1"><Music size={14}/> 專屬背景音樂 (BGM / 網址)</label>
            <input type="text" placeholder="例：APT，或貼上 YouTube 連結..." value={memoryDraft.music} onChange={e => setMemoryDraft({...memoryDraft, music: e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl outline-none text-slate-700 focus:bg-amber-50 transition" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold mb-1.5 flex items-center gap-1"><Droplets size={14} className="text-red-400"/> 生理期紀錄</label>
              <select value={memoryDraft.period} onChange={e => setMemoryDraft({...memoryDraft, period: e.target.value})} className="w-full p-2.5 bg-slate-50 rounded-xl outline-none text-slate-700">
                <option value="none">沒來</option>
                <option value="light">量少</option>
                <option value="normal">正常</option>
                <option value="heavy">量多</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1.5">當日天氣</label>
              <div className="flex justify-between bg-slate-50 p-1.5 rounded-xl">
                {['sun', 'cloud', 'rain', 'snow'].map(w => (
                  <button key={w} onClick={() => setMemoryDraft({...memoryDraft, weather: w})} className={`p-1.5 rounded-lg transition-colors ${memoryDraft.weather === w ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400'}`}>
                    {w === 'sun' && <Sun size={16} />}
                    {w === 'cloud' && <Cloud size={16} />}
                    {w === 'rain' && <CloudRain size={16} />}
                    {w === 'snow' && <Snowflake size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4">
          <textarea placeholder="寫下當下的心情與對話細節..." className="w-full h-32 text-sm outline-none resize-none text-slate-700 placeholder:text-slate-300 leading-relaxed" value={memoryDraft.text} onChange={(e) => setMemoryDraft({...memoryDraft, text: e.target.value})} />
        </div>
      </div>
    </div>
  );

  const renderAddFinance = () => (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="px-6 pt-12 pb-4 bg-white flex justify-between items-center shadow-xs z-10">
        <button onClick={() => setCurrentView('home')} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200"><X size={18} /></button>
        <h2 className="text-sm font-bold text-slate-700">記一筆帳目</h2>
        <button onClick={handleSaveFinance} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white"><Check size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500 flex items-center gap-2"><CalendarIcon size={14}/> 記帳日期</span>
           <input type="date" value={financeDraft.date} onChange={(e) => setFinanceDraft({...financeDraft, date: e.target.value})} className="outline-none text-sm text-slate-700 bg-transparent font-bold" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-100 flex flex-col items-center">
          <label className="block text-xs font-bold text-slate-400 mb-4">輸入支出金額</label>
          <div className="flex items-center text-3xl font-black text-slate-700 border-b-2 border-amber-200 pb-2">
            <span className="text-amber-500 mr-1 text-2xl">NT$</span>
            <input type="number" placeholder="0" autoFocus value={financeDraft.amount} onChange={e => setFinanceDraft({...financeDraft, amount: e.target.value})} className="w-32 bg-transparent outline-none text-center" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-400 mb-2">分類標籤</label>
            <div className="grid grid-cols-4 gap-2">
              {['飲食', '交通', '購物', '娛樂'].map(c => (
                <button key={c} onClick={() => setFinanceDraft({...financeDraft, category: c})} className={`py-2 rounded-xl border font-bold transition-all ${financeDraft.category === c ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <label className="block font-bold text-slate-400 mb-2">備註細節</label>
            <input type="text" placeholder="例如：午餐酪梨吐司..." value={financeDraft.note} onChange={e => setFinanceDraft({...financeDraft, note: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl outline-none text-slate-700 focus:bg-amber-50 transition" />
          </div>
        </div>
      </div>
    </div>
  );

  const [isEditingName, setIsEditingName] = useState(false);

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto pb-24 relative bg-slate-50 px-6 pt-12">
      <h1 className="text-xl font-bold mb-6 text-slate-800 tracking-wide">我的設定</h1>
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 mb-6 flex items-center gap-4">
         <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={32}/></div>
         <div className="flex-1">
           {isEditingName ? (
             <input type="text" autoFocus value={userName} onChange={(e)=>setUserName(e.target.value)} onBlur={() => setIsEditingName(false)} className="text-lg font-bold text-slate-700 bg-slate-50 outline-none w-full border-b border-slate-300 pb-1" />
           ) : (
             <h2 onClick={() => setIsEditingName(true)} className="text-lg font-bold text-slate-700 flex items-center gap-2 cursor-pointer hover:text-amber-600 transition">{userName} <Edit2 size={14} className="text-slate-300"/></h2>
           )}
           <p className="text-xs text-slate-400 mt-1">累積封存了 {memories.length} 顆記憶球</p>
         </div>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-50">
          <div className="flex items-center gap-3"><ScanFace size={18} className="text-slate-500"/><span className="text-sm font-bold text-slate-600">Face ID 隱私鎖定</span></div>
          <div className="w-10 h-6 bg-amber-500 rounded-full flex items-center p-1 justify-end"><div className="w-4 h-4 bg-white rounded-full"></div></div>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-50">
          <div className="flex items-center gap-3"><Archive size={18} className="text-slate-500"/><span className="text-sm font-bold text-slate-600">本機資料匯出備份</span></div>
          <span className="text-xs bg-slate-100 hover:bg-slate-200 cursor-pointer px-3 py-1 rounded-full text-slate-500 font-bold transition">匯出 JSON</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3"><Trash2 size={18} className="text-red-400"/><span className="text-sm font-bold text-red-500">清除本機所有資料</span></div>
        </div>
      </div>
    </div>
  );

  const hideNav = ['add_memory', 'add_finance', 'dump'].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center overflow-hidden font-sans text-slate-800">
      
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}} />

      <div className="w-full max-w-md bg-white h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden sm:border-8 border-slate-800">
        
        {currentView === 'home' && renderHome()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'storage' && renderStorage()}
        {currentView === 'profile' && renderProfile()}
        {currentView === 'add_memory' && renderAddMemory()}
        {currentView === 'add_finance' && renderAddFinance()}
        {currentView === 'dump' && renderScrapbook()}

        {showAddMenu && !hideNav && (
          <div className="absolute inset-0 z-40 bg-slate-900/30 backdrop-blur-sm flex flex-col justify-end pb-32 items-center">
            <div className="flex gap-6 mb-4 z-50">
              <button onClick={() => { 
                setShowAddMenu(false); 
                setEditingMemoryId(null);
                setMemoryDraft({ date: todayStr, text: '', mood: null, weather: 'sun', music: '', period: 'none', images: [] });
                setCurrentView('add_memory'); 
              }} className="flex flex-col items-center gap-1.5 animate-fade-in-up" style={{animationDelay: '0s'}}>
                <div className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl hover:scale-110 transition"><Smile size={24} /></div>
                <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full shadow-md">封存記憶</span>
              </button>
              <button onClick={() => { 
                setShowAddMenu(false); 
                setFinanceDraft({ date: todayStr, amount: '', category: '飲食', note: '' });
                setCurrentView('add_finance'); 
              }} className="flex flex-col items-center gap-1.5 animate-fade-in-up" style={{animationDelay: '0.05s'}}>
                <div className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-xl hover:scale-110 transition"><DollarSign size={24} /></div>
                <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full shadow-md">記一筆帳</span>
              </button>
            </div>
            <div className="absolute inset-0 bg-transparent" onClick={() => setShowAddMenu(false)}></div>
          </div>
        )}

        {!hideNav && (
          <div className={`absolute bottom-0 left-0 right-0 border-t z-30 px-6 py-4 pb-8 sm:pb-6 flex justify-between items-center
            ${currentView === 'storage' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/80 border-white/40 backdrop-blur-xl'}
          `}>
            <button onClick={() => setCurrentView('home')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'home' ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
              <Home size={22} /><span className="text-[9px]">日曆</span>
            </button>
            <button onClick={() => setCurrentView('stats')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'stats' ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
              <PieChart size={22} /><span className="text-[9px]">統計</span>
            </button>
            <div className="relative -top-6">
              <button onClick={() => setShowAddMenu(!showAddMenu)} className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 ${showAddMenu ? 'bg-slate-600 rotate-45 scale-90' : 'bg-slate-800 hover:scale-105'}`}>
                <Plus size={28} />
              </button>
            </div>
            <button onClick={() => setCurrentView('storage')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'storage' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
              <Archive size={22} /><span className="text-[9px]">星球</span>
            </button>
            <button onClick={() => setCurrentView('profile')} className={`p-1.5 flex flex-col items-center gap-0.5 ${currentView === 'profile' ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
              <User size={22} /><span className="text-[9px]">我的</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}