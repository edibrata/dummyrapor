import { useAppStore } from '@/store';
import { Menu, CloudUpload, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { state, syncToDatabase } = useAppStore();
  const { sekolah } = state;
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncDone(false);
    try {
      await syncToDatabase();
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 3000);
    } catch (error) {
      alert('Gagal menyimpan data ke server.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="main-header bg-white border-b border-slate-200 h-16 flex items-center px-6 md:px-8 justify-between sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-indigo-600 focus:outline-none p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group relative"
        >
          <Menu size={20} />
          <span className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800">Toggle Sidebar</span>
        </button>
        <div>
          <h2 className="text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Dashboard &rsaquo; {sekolah.nama}</h2>
          <p className="text-slate-800 font-bold text-base md:text-lg flex items-center gap-2">
            Aplikasi Rapor Kurikulum Merdeka
            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest"><img src="https://placehold.co/40x40/4f46e5/ffffff?text=EB" className="w-3 h-3 rounded-full" /> Edi Brata</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition text-white px-4 cursor-pointer focus:outline-none group relative ${isSyncing ? 'bg-indigo-400 border-indigo-400 cursor-not-allowed' : syncDone ? 'bg-emerald-500 border-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600'}`}
        >
          <span className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-slate-800">Simpan data ke server</span>
          {syncDone ? (
            <>
              <CheckCircle2 size={14} /> Tersimpan
            </>
          ) : (
            <>
              <CloudUpload size={14} className={isSyncing ? 'animate-bounce' : ''} />
              {isSyncing ? 'Menyimpan...' : 'Simpan ke Cloud'}
            </>
          )}
        </button>

        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-indigo-600">{sekolah.nama}</p>
          <p className="text-[10px] text-slate-400">Semester {sekolah.semester} {sekolah.tahunAjaran} | Kelas {sekolah.kelas} (Fase {sekolah.fase})</p>
        </div>
      </div>
    </header>
  );
}
