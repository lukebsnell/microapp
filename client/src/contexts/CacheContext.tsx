import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CacheContextType {
  cacheVersion: number;
  notifyCacheChange: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export function CacheProvider({ children }: { children: ReactNode }) {
  const [cacheVersion, setCacheVersion] = useState(0);

  const notifyCacheChange = useCallback(() => {
    setCacheVersion(prev => prev + 1);
  }, []);

  return (
    <CacheContext.Provider value={{ cacheVersion, notifyCacheChange }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCacheNotification() {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCacheNotification must be used within a CacheProvider');
  }
  return context;
}
