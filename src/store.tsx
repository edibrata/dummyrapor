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
    
    // Create Composite Key: NPSN_TahunAjaran_Semester_Kelas_Rombel
    const compositeNpsn = `${state.sekolah.npsn}_${state.sekolah.tahunAjaran || ''}_${state.sekolah.semester || ''}_${state.sekolah.kelas || ''}_${state.sekolah.rombel || ''}`.replace(/\s+/g, '-');

    try {
      const { error } = await supabase
        .from('aplikasirapor')
        .upsert(
          { 
            npsn: compositeNpsn, 
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
