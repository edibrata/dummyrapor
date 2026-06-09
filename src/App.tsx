import { useState } from 'react';
import { AppProvider, useAppStore } from '@/store';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DataSekolah from '@/views/DataSekolah';
import DataSiswa from '@/views/DataSiswa';
import TujuanPembelajaranView from '@/views/TujuanPembelajaran';
import InputNilai from '@/views/InputNilai';
import Leger from '@/views/Leger';
import DataProjekView from '@/views/DataProjek';
import NilaiProjek from '@/views/NilaiProjek';
import CetakRapor from '@/views/CetakRapor';
import Placeholder from '@/views/Placeholder';
import ProfilPengembang from '@/views/ProfilPengembang';
import Pengaturan from '@/views/Pengaturan';
import Petunjuk from '@/views/Petunjuk';
import LoginModal from '@/components/LoginModal';
import DashboardView from '@/views/DashboardView';

function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 main-content h-screen overflow-y-auto">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'data-sekolah' && <DataSekolah />}
          {activeView === 'kegiatan-akademik' && <Placeholder title="Kegiatan Akademik" />}
          {activeView === 'data-siswa' && <DataSiswa />}
          {activeView === 'foto-murid' && <Placeholder title="Foto Murid" />}
          {activeView === 'data-pendukung' && <Placeholder title="Data Pendukung" />}

          {activeView === 'tujuan-pembelajaran' && <TujuanPembelajaranView />}
          {activeView === 'input-nilai' && <InputNilai />}
          {activeView === 'sesuaikan-capaian' && <Placeholder title="Lihat & Sesuaikan Capaian" />}
          {activeView === 'nilai-ekskul' && <Placeholder title="Nilai Ekstrakurikuler" />}
          {activeView === 'data-projek' && <DataProjekView />}
          {activeView === 'nilai-projek' && <NilaiProjek />}
          {activeView === 'leger' && <Leger />}

          {activeView === 'jilid-identitas' && <Placeholder title="Jilid & Identitas" />}
          {activeView === 'biodata-murid' && <Placeholder title="Biodata Murid" />}
          {activeView === 'cetak-rapor' && <CetakRapor />}
          {activeView === 'lampiran-buku-induk' && <Placeholder title="Lampiran Buku Induk" />}
          {activeView === 'keterangan-pindah' && <Placeholder title="Keterangan Pindah" />}

          {activeView === 'dashboard-analitik' && <Placeholder title="Dashboard Analitik" />}
          {activeView === 'ai-assistant' && <Placeholder title="AI Assistant" />}

          {activeView === 'petunjuk' && <Petunjuk />}
          {activeView === 'pengaturan' && <Pengaturan />}
          {activeView === 'profil-pengembang' && <ProfilPengembang />}
        </main>
        <footer className="py-5 shrink-0 border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500 font-medium">
            Dikembangkan oleh
            <img src="https://placehold.co/40x40/4f46e5/ffffff?text=EB" alt="Edi Brata" className="w-5 h-5 rounded-full shadow-sm" />
            <span className="font-bold text-slate-700">Edi Brata</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function RootView() {
  const { state } = useAppStore();
  
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 relative">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546410531-b4cafc7b74ba?auto=format&fit=crop&q=80&w=2670')] bg-cover bg-center brightness-[0.25]" />
         <LoginModal />
      </div>
    )
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <RootView />
    </AppProvider>
  );
}
