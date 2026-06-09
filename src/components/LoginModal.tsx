import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';
import { Lock, AlertCircle, Loader2, ArrowRight, Home, Plus, FolderOpen } from 'lucide-react';

export default function LoginModal() {
  const [step, setStep] = useState<1 | 2>(1);
  const [npsn, setNpsn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateSekolah, updateState, setState } = useAppStore();
  
  // State for step 2
  const [baselineData, setBaselineData] = useState<any>(null);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<any[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    tahunAjaran: '',
    semester: '1',
    kelas: '',
    rombel: ''
  });

  const handleVerifyNpsn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!npsn.trim()) {
      setError('NPSN tidak boleh kosong');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: sbError } = await supabase
        .from('registrasirapor')
        .select('*')
        .eq('data_payload->>npsn', npsn.trim())
        .single();

      if (sbError || !data) {
        console.error(sbError);
        setError('NPSN tidak ditemukan di database. Anda tidak memiliki akses ke aplikasi ini.');
        setIsLoading(false);
        return;
      }

      // Map the returned data
      const payload = data.data_payload ? { ...data, ...data.data_payload } : data || {};
      const sekolahUpdates: any = {};
      
      const normalizedPayload: Record<string, any> = {};
      Object.keys(payload).forEach(key => {
        normalizedPayload[key.toLowerCase().trim().replace(/-/g, '_')] = payload[key];
      });

      const findVal = (...keys: string[]) => {
        for (const k of keys) {
          if (normalizedPayload[k.replace(/-/g, '_')] !== undefined) return normalizedPayload[k.replace(/-/g, '_')];
        }
        return undefined;
      };

      const valNama = findVal('nama lengkap sekolah', 'nama_sekolah', 'nama sekolah', 'nama_lengkap', 'nama');
      if (valNama) sekolahUpdates.nama = valNama;

      const valNpsn = findVal('npsn', 'npsn_sekolah');
      if (valNpsn) sekolahUpdates.npsn = valNpsn;

      const valAlamat = findVal('jalan / blok / rt rw', 'alamat', 'alamat lengkap', 'alamat_lengkap');
      if (valAlamat) sekolahUpdates.alamat = valAlamat;
      
      const valJenisWilayah = findVal('desa/kelurahan', 'desa_kelurahan_jenis', 'jenis wilayah', 'jenis_wilayah');
      if (valJenisWilayah) sekolahUpdates.desaKelurahanJenis = valJenisWilayah.toString().toLowerCase();
      
      const valNamaDesaKel = findVal('nama desa/kelurahan', 'desa_kelurahan_nama', 'nama desa/kel.', 'nama_desa_kelurahan', 'desa_kelurahan', 'desa', 'kelurahan');
      if (valNamaDesaKel) sekolahUpdates.desaKelurahanNama = valNamaDesaKel;
      
      const valKecamatan = findVal('kecamatan', 'nama kecamatan');
      if (valKecamatan) sekolahUpdates.kecamatan = valKecamatan;
      
      const valTipeDaerah = findVal('kabupaten/kota', 'kabupaten_kota_jenis', 'tipe daerah', 'tipe_daerah', 'jenis_kabupaten_kota');
      if (valTipeDaerah) sekolahUpdates.kabupatenKotaJenis = valTipeDaerah.toString().toLowerCase();
      
      const valNamaKabKota = findVal('nama kabupaten/kota', 'kabupaten_kota_nama', 'nama kab/kota', 'nama_kab_kota', 'kab_kota');
      if (valNamaKabKota) sekolahUpdates.kabupatenKotaNama = valNamaKabKota;
      
      const valProvinsi = findVal('provinsi', 'nama_provinsi', 'nama provinsi');
      if (valProvinsi) sekolahUpdates.provinsi = valProvinsi;

      const classes = findVal('fase / kelas utama', 'kelas', 'fase', 'fase_kelas_utama');
      if (Array.isArray(classes)) {
        sekolahUpdates.allowedKelas = classes.map(String);
      } else if (typeof classes === 'string' && classes.includes(',')) {
        sekolahUpdates.allowedKelas = classes.split(',').map(s => s.trim());
      } else if (typeof classes === 'string' || typeof classes === 'number') {
        sekolahUpdates.allowedKelas = [classes.toString()];
      }

      setBaselineData(sekolahUpdates);

      // Now fetch existing workspaces for this NPSN from aplikasirapor
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('aplikasirapor')
        .select('npsn, data_payload->sekolah')
        .like('npsn', `${npsn.trim()}_%`)
        .order('created_at', { ascending: false });

      if (!workspacesError && workspacesData) {
        setAvailableWorkspaces(workspacesData);
      }

      setStep(2);

    } catch (err: any) {
      setError('Terjadi kesalahan jaringan atau database.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkspace = async (workspaceNpsn: string) => {
    setIsLoading(true);
    try {
      const { data: appData, error: appError } = await supabase
        .from('aplikasirapor')
        .select('*')
        .eq('npsn', workspaceNpsn)
        .single();
        
      if (!appError && appData && appData.data_payload) {
        setState(prev => ({
          ...appData.data_payload,
          isAuthenticated: true,
          sekolah: {
            ...appData.data_payload.sekolah,
            ...baselineData,
          }
        }));
      } else {
        setError('Gagal memuat data ruang kerja.');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan memuat data ruang kerja.');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspace.tahunAjaran || !newWorkspace.semester || !newWorkspace.kelas || !newWorkspace.rombel) {
      setError('Harap lengkapi semua isian ruang kerja baru.');
      return;
    }
    
    // First login, just set baseline and authenticate
    updateSekolah({
        ...baselineData,
        tahunAjaran: newWorkspace.tahunAjaran,
        semester: newWorkspace.semester,
        kelas: newWorkspace.kelas,
        rombel: newWorkspace.rombel
    });
    updateState('isAuthenticated', true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8">
          
          {step === 1 && (
              <>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex flex-center items-center justify-center mb-6">
                <Lock size={24} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Autentikasi Aplikasi</h2>
              <p className="text-sm text-slate-500 mb-8">
                Silakan masukkan NPSN sekolah Anda untuk sinkronisasi data dasar dan membuka kunci akses pelaporan.
              </p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyNpsn} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="npsn" className="block text-sm font-semibold text-slate-700">NPSN</label>
                  <input
                    id="npsn"
                    type="text"
                    placeholder="Masukkan 8 Digit NPSN"
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center py-3 px-4 rounded-lg transition-colors focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Verifikasi NPSN <ArrowRight size={18} className="ml-2" /></>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
             <>
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => { setStep(1); setIsCreatingNew(false); }} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                        <ArrowRight size={16} className="rotate-180" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Pilih Ruang Kerja</h2>
                        <p className="text-xs text-slate-500">{baselineData?.nama} ({npsn})</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                    </div>
                )}

                {!isCreatingNew ? (
                    <div className="space-y-4">
                        {availableWorkspaces.length > 0 && (
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Lanjutkan Pekerjaan</label>
                                {availableWorkspaces.map((ws, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => loadWorkspace(ws.npsn)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                                <FolderOpen size={18} />
                                            </div>
                                            <div>
                                                 <p className="font-semibold text-slate-800">Kelas {ws.sekolah?.kelas} - {ws.sekolah?.rombel}</p>
                                                 <p className="text-xs text-slate-500">{ws.sekolah?.tahunAjaran} | Smt {ws.sekolah?.semester}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-100">
                             <button
                                onClick={() => setIsCreatingNew(true)}
                                className="w-full border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 font-medium flex items-center justify-center py-3 px-4 rounded-xl transition-all focus:outline-none"
                            >
                                <Plus size={18} className="mr-2" />
                                Buat Ruang Kerja Baru
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={createNewWorkspace} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 mb-2">
                        <label className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-indigo-100 pb-2">Identitas Ruang Kelas</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">Tahun Ajaran</label>
                                <input required type="text" placeholder="2023/2024" value={newWorkspace.tahunAjaran} onChange={(e) => setNewWorkspace({...newWorkspace, tahunAjaran: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">Semester</label>
                                <select value={newWorkspace.semester} onChange={(e) => setNewWorkspace({...newWorkspace, semester: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                                    <option value="1">1 (Ganjil)</option>
                                    <option value="2">2 (Genap)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">Kelas</label>
                                <select required value={newWorkspace.kelas} onChange={(e) => setNewWorkspace({...newWorkspace, kelas: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                                    <option value="">Pilih</option>
                                    {baselineData?.allowedKelas?.map((k: string) => (
                                         <option key={k} value={k}>{k}</option>
                                    ))}
                                    {(!baselineData?.allowedKelas || baselineData?.allowedKelas.length === 0) && (
                                        <>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">Rombel</label>
                                <select required value={newWorkspace.rombel} onChange={(e) => setNewWorkspace({...newWorkspace, rombel: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                                    <option value="">Pilih</option>
                                    <option value="satu">Hanya Satu (Default)</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                        </div>

                         <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                             <button
                                type="button"
                                onClick={() => setIsCreatingNew(false)}
                                className="flex-1 border bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 font-semibold flex items-center justify-center py-2.5 px-4 rounded-lg transition-colors focus:outline-none"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center py-2.5 px-4 rounded-lg transition-colors focus:outline-none shadow-sm"
                            >
                                Masuk Aplikasi
                            </button>
                        </div>
                    </form>
                )}
             </>
          )}
        </div>
      </div>
    </div>
  );
}
