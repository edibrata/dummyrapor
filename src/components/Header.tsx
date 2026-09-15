import { useAppStore } from '@/store';
import { Menu, CheckCircle2, RefreshCw, CloudOff } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  onOpenDevProfile?: () => void;
}

export default function Header({ toggleSidebar, onOpenDevProfile }: HeaderProps) {
  const { state, syncStatus } = useAppStore();
  const { sekolah } = state;

  return (
    <header className="main-header bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md h-14 flex items-center px-4 md:px-6 justify-between sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-white focus:outline-none p-1.5 rounded-md hover:bg-blue-800 transition-colors cursor-pointer group relative"
        >
          <Menu size={20} />
          <span className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800">Toggle Sidebar</span>
        </button>
        <div>
          
          <p className="text-white font-bold text-sm md:text-base flex items-center gap-2">
            Aplikasi Rapor Kurikulum Merdeka
            <span 
              className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-800 text-blue-100 border border-blue-600 uppercase tracking-widest cursor-pointer hover:bg-blue-900 transition-colors"
              onClick={onOpenDevProfile}
            >
              <img src="https://raw.githubusercontent.com/edibrata/image/main/FotoEdiBrata.jpg" className="w-3 h-3 rounded-full object-cover" /> 
              Edi Brata
            </span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Quiet Sync Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full bg-blue-800 border border-blue-600 cursor-default group relative">
          <span className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800">
            {syncStatus === 'synced' ? 'Semua perubahan tersimpan di Cloud' : syncStatus === 'syncing' ? 'Menyimpan data ke Cloud...' : 'Gagal menyimpan, periksa koneksi!'}
          </span>
          
          {syncStatus === 'synced' && (
            <>
              <CheckCircle2 size={13} className="text-blue-200" /> 
              <span className="text-blue-100">Tersimpan</span>
            </>
          )}
          {syncStatus === 'syncing' && (
            <>
              <RefreshCw size={13} className="text-blue-300 animate-spin" /> 
              <span className="text-white">Menyimpan...</span>
            </>
          )}
          {syncStatus === 'error' && (
            <>
              <CloudOff size={13} className="text-rose-400" /> 
              <span className="text-rose-200">Offline</span>
            </>
          )}
        </div>

        <div className="text-right hidden md:block border-l border-blue-600 pl-6">
          <p className="text-xs font-bold text-white">{sekolah.nama}</p>
          <p className="text-[10px] text-blue-200">Semester {sekolah.semester} {sekolah.tahunAjaran} | Kelas {sekolah.kelas} (Fase {sekolah.fase})</p>
        </div>
      </div>
    </header>
  );
}
