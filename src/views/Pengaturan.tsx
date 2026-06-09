import { useState } from 'react';

export default function Pengaturan() {
  const [useDigitalSignature, setUseDigitalSignature] = useState(false);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Pengaturan Aplikasi</h2>
      
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-base text-slate-700">Pengaturan Logo Rapor</h3>
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold text-center px-1">Tut Wuri Handayani</span>
              </div>
              <div className="text-sm text-slate-600 flex-1">
                  <p className="leading-relaxed">Secara default, logo yang tercetak pada halaman Jilid dan Rapor adalah Tut Wuri Handayani. Anda dapat menggantinya dengan logo sekolah atau lambang daerah masing-masing.</p>
                  <button className="mt-3 bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm">
                      Pilih Logo Baru
                  </button>
              </div>
          </div>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base text-slate-700">Tanda Tangan Digital</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={useDigitalSignature} onChange={(e) => setUseDigitalSignature(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
          </div>
          
          <div className="text-sm text-slate-600 mb-4">Aktifkan opsi ini untuk menyisipkan tanda tangan digital (gambar) langsung di halaman cetak rapor, menghemat waktu tanda tangan manual.</div>
          
          {useDigitalSignature && (
            <div className="mt-5 pt-5 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-slate-500 mb-4 font-medium">Unggah file gambar (disarankan berformat PNG transparan) untuk tanda tangan guru dan kepala sekolah.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Tanda Tangan Wali Kelas</p>
                        <div className="w-full h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 mb-4 hover:bg-slate-100 transition-colors cursor-pointer">
                            <span className="text-slate-400 text-xs font-medium">Belum ada file</span>
                        </div>
                        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 w-full transition-colors">
                            Unggah TTD Guru
                        </button>
                    </div>
                    <div className="text-center p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Tanda Tangan Kepala Sekolah</p>
                        <div className="w-full h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 mb-4 hover:bg-slate-100 transition-colors cursor-pointer">
                            <span className="text-slate-400 text-xs font-medium">Belum ada file</span>
                        </div>
                        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 w-full transition-colors">
                            Unggah TTD Kepsek
                        </button>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
