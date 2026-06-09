import { useAppStore } from '@/store';
import { Menu, ZoomIn, ZoomOut, Type } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  layoutZoom: number;
  setLayoutZoom: (zoom: number | ((prev: number) => number)) => void;
  fontZoom: number;
  setFontZoom: (zoom: number | ((prev: number) => number)) => void;
}

export default function Header({ toggleSidebar, layoutZoom, setLayoutZoom, fontZoom, setFontZoom }: HeaderProps) {
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
      
      <div className="flex items-center gap-4">
        {/* Zoom Controls */}
        <div className="hidden md:flex items-center gap-4 border-r border-slate-200 pr-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setLayoutZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded shadow-sm transition-all"
              title="Perkecil Layar"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-[10px] font-bold text-slate-600 w-8 text-center">{Math.round(layoutZoom * 100)}%</span>
            <button 
              onClick={() => setLayoutZoom(prev => Math.min(2, prev + 0.1))}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded shadow-sm transition-all"
              title="Perbesar Layar"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
             <button 
              onClick={() => setFontZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded shadow-sm transition-all"
              title="Perkecil Teks"
            >
              <Type size={14} />
            </button>
            <span className="text-[10px] font-bold text-slate-600 w-8 text-center">{Math.round(fontZoom * 100)}%</span>
            <button 
              onClick={() => setFontZoom(prev => Math.min(2, prev + 0.1))}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded shadow-sm transition-all"
              title="Perbesar Teks"
            >
              <Type size={18} />
            </button>
          </div>
        </div>

        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-indigo-600">{sekolah.nama}</p>
          <p className="text-[10px] text-slate-400">Semester {sekolah.semester} {sekolah.tahunAjaran} | Kelas {sekolah.kelas} (Fase {sekolah.fase})</p>
        </div>
      </div>
    </header>
  );
}
