import { useAppStore } from '@/store';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { state } = useAppStore();
  const { sekolah } = state;

  return (
    <header className="main-header bg-white border-b border-slate-200 h-16 flex items-center px-6 md:px-8 justify-between sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-indigo-600 focus:outline-none p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Dashboard &rsaquo; {sekolah.nama}</h2>
          <p className="text-slate-800 font-bold text-base md:text-lg">Aplikasi Rapor Kurikulum Merdeka</p>
        </div>
      </div>
      
      <div className="text-right hidden md:block">
        <p className="text-xs font-bold text-indigo-600">{sekolah.nama}</p>
        <p className="text-[10px] text-slate-400">Semester {sekolah.semester} {sekolah.tahunAjaran} | Kelas {sekolah.kelas} (Fase {sekolah.fase})</p>
      </div>
    </header>
  );
}
