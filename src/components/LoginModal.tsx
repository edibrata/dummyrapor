import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginModal() {
  const [npsn, setNpsn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateSekolah, updateState, setState } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
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

      // Map the returned data, checking if it's inside a data_payload JSON column
      const payload = data.data_payload ? { ...data, ...data.data_payload } : data || {};
      const sekolahUpdates: any = {};
      
      // Normalize payload keys for easier matching (to handle case sensitivities or dashes)
      const normalizedPayload: Record<string, any> = {};
      Object.keys(payload).forEach(key => {
        normalizedPayload[key.toLowerCase().trim().replace(/-/g, '_')] = payload[key];
      });

      // Helper function to find a value by multiple possible key names
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
        sekolahUpdates.allowedKelas = classes;
      } else if (typeof classes === 'string' && classes.includes(',')) {
        sekolahUpdates.allowedKelas = classes.split(',').map(s => s.trim());
      } else if (typeof classes === 'string' || typeof classes === 'number') {
        sekolahUpdates.allowedKelas = [classes];
      }

      console.log('Normalized DB Payload:', normalizedPayload);
      console.log('Mapped Updates:', sekolahUpdates);
      
      // Load data from aplikasirapor if it exists (get the latest modified payload)
      const { data: appData, error: appError } = await supabase
        .from('aplikasirapor')
        .select('*')
        .like('npsn', `${npsn.trim()}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!appError && appData && appData.data_payload) {
        // App state exists, merge and set
        setState(prev => ({
          ...appData.data_payload,
          isAuthenticated: true,
          sekolah: {
            ...appData.data_payload.sekolah,
            ...sekolahUpdates, // overrides with the latest baseline from registrasirapor
          }
        }));
      } else {
        // First login, just set baseline and authenticate
        updateSekolah(sekolahUpdates);
        updateState('isAuthenticated', true);
      }

    } catch (err: any) {
      setError('Terjadi kesalahan jaringan atau database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8">
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

          <form onSubmit={handleLogin} className="space-y-6">
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
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Mencari Data...
                </>
              ) : (
                'Masuk & Sinkronisasi'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
