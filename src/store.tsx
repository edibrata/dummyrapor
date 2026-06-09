import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateSekolah: (data: Partial<AppState['sekolah']>) => void;
  updateState: <K extends keyof AppState>(key: K, data: AppState[K]) => void;
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
    <AppContext.Provider value={{ state, setState, updateSekolah, updateState }}>
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
