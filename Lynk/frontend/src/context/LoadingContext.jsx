import{ createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean) || globalLoading;
  }, [loadingStates, globalLoading]);

  const clearLoading = useCallback((key) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
  }, []);

  const setGlobalLoadingState = useCallback((isLoading) => {
    setGlobalLoading(isLoading);
  }, []);

  // Auto-clear loading states after a timeout (optional)
  const setLoadingWithTimeout = useCallback((key, isLoading, timeout = 30000) => {
    setLoading(key, isLoading);
    
    if (isLoading && timeout) {
      setTimeout(() => {
        setLoading(key, false);
      }, timeout);
    }
  }, [setLoading]);

  const value = {
    setLoading,
    setLoadingWithTimeout,
    isLoading,
    isAnyLoading,
    clearLoading,
    clearAllLoading,
    setGlobalLoadingState,
    globalLoading,
    loadingStates
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 