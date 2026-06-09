import { useAppStore } from '@/store';
import { 
  Users, BookOpen, GraduationCap, CalendarDays, 
  MapPin, CheckCircle2, Award, ArrowRight, Activity, Lightbulb, School
} from 'lucide-react';

export default function DashboardView() {
  const { state } = useAppStore();
  const { sekolah, siswaList } = state;

  const totalSiswa = siswaList?.length || 0;
  const isSetupComplete = sekolah.nama && sekolah.npsn && sekolah.tahunAjaran;

  const stats = [
    {
      label: 'Tahun Ajaran',
      value: sekolah.tahunAjaran || '-',
      icon: <CalendarDays size={24} className="text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700'
    },
    {
      label: 'Kelas & Fase',
      value: `Kelas ${sekolah.kelas || '-'} (${sekolah.fase || '-'})`,
      icon: <BookOpen size={24} className="text-amber-500" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700'
    },
    {
      label: 'Ruang Rombel',
      value: sekolah.ruangRombel === 'satu' || !sekolah.ruangRombel ? 'Hanya Satu' : sekolah.ruangRombel,
      icon: <GraduationCap size={24} className="text-purple-500" />,
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700'
    },
    {
      label: 'Total Murid',
      value: totalSiswa.toString(),
      icon: <Users size={24} className="text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="mb-8 p-8 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl translate-y-20 -translate-x-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold tracking-widest uppercase text-indigo-100 border border-white/20">
                Dashboard Utama
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              Selamat Datang di Rapor Merdeka
            </h1>
            <p className="text-indigo-100/90 max-w-xl text-base leading-relaxed">
              Platform modern manajemen rapor akademik Kurikulum Merdeka. 
              Kelola data dasar, nilai sumatif, hingga cetak rapor dengan visualisasi yang mudah.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 shrink-0">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
               <School size={24} />
             </div>
             <div>
               <h3 className="font-bold text-white text-base tracking-tight leading-none mb-1.5">{sekolah.nama || 'Nama Sekolah Belum Diatur'}</h3>
               <p className="text-indigo-200 text-sm flex items-center gap-1.5">
                 <MapPin size={14} /> NPSN: {sekolah.npsn || '-'}
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <p className="text-slate-500 text-[13px] font-semibold">{stat.label}</p>
              <div className={`w-10 h-10 ${stat.bg} ${stat.text} rounded-xl flex items-center justify-center border ${stat.border} group-hover:scale-110 transition-transform`}>
                <div className="scale-75">{stat.icon}</div>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Activity size={20} className="text-indigo-600" />
             Status Kesiapan Rapor
           </h3>
           
           <div className="space-y-4">
             <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className={`mt-0.5 rounded-full bg-white p-1 shadow-sm ${isSetupComplete ? 'text-emerald-500' : 'text-indigo-500'}`}>
                  {isSetupComplete ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-indigo-900 mb-1">Data Dasar Sekolah</h4>
                  <p className="text-[13px] text-indigo-700/80 leading-relaxed mb-3">Pastikan profil sekolah, kepala sekolah, dan data pendukung sudah lengkap untuk keperluan pencetakan dokumen.</p>
                  {!isSetupComplete && (
                    <button className="text-[13px] font-semibold text-indigo-600 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                      Lengkapi Sekarang <ArrowRight size={14} />
                    </button>
                  )}
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-70">
                <div className="mt-0.5 rounded-full bg-white p-1 shadow-sm text-slate-400">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-transparent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-700 mb-1">Tujuan Pembelajaran</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">Tentukan Tujuan Pembelajaran yang akan dinilai di semester ini untuk setiap mata pelajaran.</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-70">
                <div className="mt-0.5 rounded-full bg-white p-1 shadow-sm text-slate-400">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-transparent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-700 mb-1">Input Nilai Murid</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">Rekapitulasi perhitungan nilai intrakurikuler dan ekstrakurikuler.</p>
                </div>
             </div>
           </div>
        </div>

        <div className="bg-gradient-to-b from-amber-50 to-orange-50/30 p-8 rounded-3xl border border-amber-100/60 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-[0.08]">
             <Award size={100} />
           </div>
           <div className="relative z-10 flex flex-col h-full">
             <div className="w-12 h-12 bg-white/60 text-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-amber-100/50">
               <Lightbulb size={24} />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Tips Cepat</h3>
             <p className="text-slate-600 text-[13px] leading-relaxed mb-6 flex-1">
               Mulailah dengan memastikan semua data siswa sudah dimasukkan pada menu <strong className="text-slate-700">Data Murid</strong>. Kemudian lanjutkan dengan pemetaan mata pelajaran dan TP sebelum Anda mulai mengisi nilai sumatif.
             </p>
             <button className="w-full py-2.5 bg-white border border-amber-200/60 text-amber-700 font-bold rounded-xl shadow-sm hover:bg-amber-50 transition-colors text-[13px]">
               Lihat Petunjuk Lengkap
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
