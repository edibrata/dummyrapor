import { useState } from 'react';
import { useAppStore } from '@/store';
import { INITIAL_STATE } from '@/constants';
import { 
  School, Users, Calendar, Camera, FolderPlus, 
  Target, PenTool, Activity, CheckSquare, 
  BookOpen, FileSpreadsheet, Printer, Book, Contact, 
  Archive, ArrowRightLeft, PieChart, Bot, Lightbulb, 
  Settings, UserCircle, Star, FolderGit2, ChevronDown, ChevronRight, LogOut, LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ activeView, setActiveView, isOpen }: SidebarProps) {
  const { updateState, updateSekolah } = useAppStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Utama': true,
    'Master Data': true,
    'Akademik & Penilaian': true,
    'Output/Cetak': true,
    'Fitur Professional': false,
    'Sistem': false
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };
  
  const handleLogout = () => {
    updateState('isAuthenticated', false);
    updateSekolah(INITIAL_STATE.sekolah);
    setActiveView('dashboard');
  };

  const menuGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> }
      ]
    },
    {
      title: 'Master Data',
      items: [
        { id: 'data-sekolah', label: 'Data Dasar', icon: <School size={18} /> },
        { id: 'kegiatan-akademik', label: 'Kegiatan Akademik', icon: <Calendar size={18} /> },
        { id: 'data-siswa', label: 'Data Murid', icon: <Users size={18} /> },
        { id: 'foto-murid', label: 'Foto Murid', icon: <Camera size={18} /> },
        { id: 'data-pendukung', label: 'Data Pendukung', icon: <FolderPlus size={18} /> },
      ]
    },
    {
      title: 'Akademik & Penilaian',
      items: [
        { id: 'tujuan-pembelajaran', label: 'Tujuan Pembelajaran', icon: <Target size={18} /> },
        { id: 'input-nilai', label: 'Nilai Intrakurikuler', icon: <PenTool size={18} /> },
        { id: 'sesuaikan-capaian', label: 'Sesuaikan Capaian', icon: <CheckSquare size={18} /> },
        { id: 'nilai-ekskul', label: 'Nilai Ekstrakurikuler', icon: <Activity size={18} /> },
        { id: 'data-projek', label: 'Data Projek (P5)', icon: <FolderGit2 size={18} /> },
        { id: 'nilai-projek', label: 'Nilai Kokurikuler (P5)', icon: <Star size={18} /> },
        { id: 'leger', label: 'Leger Nilai', icon: <FileSpreadsheet size={18} /> },
      ]
    },
    {
      title: 'Output/Cetak',
      items: [
        { id: 'jilid-identitas', label: 'Jilid & Identitas', icon: <Book size={18} /> },
        { id: 'biodata-murid', label: 'Biodata Murid', icon: <Contact size={18} /> },
        { id: 'cetak-rapor', label: 'Cetak Rapor', icon: <Printer size={18} /> },
        { id: 'lampiran-buku-induk', label: 'Lampiran Buku Induk', icon: <Archive size={18} /> },
        { id: 'keterangan-pindah', label: 'Keterangan Pindah', icon: <ArrowRightLeft size={18} /> },
      ]
    },
    {
      title: 'Fitur Professional',
      items: [
        { id: 'dashboard-analitik', label: 'Dashboard Analitik', icon: <PieChart size={18} /> },
        { id: 'ai-assistant', label: 'AI Assistant', icon: <Bot size={18} /> },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { id: 'petunjuk', label: 'Petunjuk Penggunaan', icon: <Lightbulb size={18} /> },
        { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
        { id: 'profil-pengembang', label: 'Profil Pengembang', icon: <UserCircle size={18} /> },
      ]
    }
  ];

  return (
    <aside className={`sidebar bg-indigo-900 text-slate-100 flex flex-col h-screen sticky top-0 shadow-xl overflow-hidden transition-all duration-300 ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0'}`}>
      <div className="p-6 border-b border-indigo-800/50 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-indigo-900 shadow-inner">
            <BookOpen size={24} />
          </div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">Rapor Merdeka <span className="text-amber-400 block text-xs">SD v5.0 PRO • Edi Brata</span></h1>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-2">
            <button 
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none group opacity-90 hover:opacity-100"
            >
              <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">
                {group.title}
              </p>
              {expandedGroups[group.title] ? (
                <ChevronDown size={14} className="text-indigo-400 group-hover:text-amber-400 transition-colors" />
              ) : (
                <ChevronRight size={14} className="text-indigo-400 group-hover:text-amber-400 transition-colors" />
              )}
            </button>
            
            <div 
              className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                expandedGroups[group.title] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        activeView === item.id 
                          ? 'bg-indigo-700/50 border border-white/10 text-white shadow-sm font-medium translate-x-1' 
                          : 'hover:bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </nav>
      
      <div className="p-4 bg-indigo-950/80 border-t border-indigo-800/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white ring-2 ring-indigo-400/30">AD</div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Admin Pusat</p>
            <p className="text-[10px] text-indigo-300/70">EduDev 2026</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 -mr-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          title="Ganti Sekolah/Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
