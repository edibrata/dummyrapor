import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateSekolah: (data: Partial<AppState['sekolah']>) => void;
  updateState: <K extends keyof AppState>(key: K, data: AppState[K]) => void;
  syncToDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'rapor_kumer_state';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from LS', e);
    }
    return INITIAL_STATE;
  });

  const syncToDatabase = async () => {
    if (!state.isAuthenticated || !state.sekolah?.npsn) return;
    try {
      const { error } = await supabase
        .from('aplikasirapor')
        .upsert(
          { 
            npsn: state.sekolah.npsn, 
            data_payload: state 
          },
          { onConflict: 'npsn' }
        );
      if (error) {
        console.error("Error syncing to Supabase", error);
        throw error;
      }
    } catch (error) {
      console.error("Error syncing to Supabase", error);
      throw error;
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    // Only run once on mount to get baseline changes from registrasirapor
    const fetchLatestBaseline = async () => {
      // Need getting current state from function closure initially
      let currentState = state;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
           currentState = JSON.parse(saved);
        }
      } catch(e) {}
      
      if (!currentState.isAuthenticated || !currentState.sekolah?.npsn) return;

      try {
        const { data: dbData, error: dbError } = await supabase
          .from('registrasirapor')
          .select('*')
          .eq('data_payload->>npsn', currentState.sekolah.npsn.trim())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (dbError || !dbData || !dbData.data_payload) return;

        const payload = dbData.data_payload;
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

        const sekolahUpdates: Partial<AppState['sekolah']> = {};

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

        if (Object.keys(sekolahUpdates).length > 0) {
          setState((prev) => ({
            ...prev,
            sekolah: { ...prev.sekolah, ...sekolahUpdates }
          }));
        }

      } catch (err) {
        console.error("Error fetching latest baseline:", err);
      }
    };

    fetchLatestBaseline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateSekolah = (data: Partial<AppState['sekolah']>) => {
    setState((prev) => ({
      ...prev,
      sekolah: { ...prev.sekolah, ...data },
    }));
  };

  const updateState = <K extends keyof AppState>(key: K, data: AppState[K]) => {
    setState((prev) => ({ ...prev, [key]: data }));
  };

  return (
    <AppContext.Provider value={{ state, setState, updateSekolah, updateState, syncToDatabase }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
