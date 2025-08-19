import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

export const useLoadingState = (key, autoClear = true) => {
  const { setLoading, isLoading, clearLoading } = useLoading();

  // Auto-clear loading state when component unmounts
  useEffect(() => {
    if (autoClear) {
      return () => {
        clearLoading(key);
      };
    }
  }, [key, clearLoading, autoClear]);

  return {
    isLoading: isLoading(key),
    setLoading: (loading) => setLoading(key, loading),
    clearLoading: () => clearLoading(key)
  };
};


export const useAsyncLoading = (key) => {
  const { setLoading, isLoading, clearLoading } = useLoading();

  const withLoading = async (asyncFn) => {
    try {
      setLoading(key, true);
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  };

  return {
    isLoading: isLoading(key),
    withLoading,
    setLoading: (loading) => setLoading(key, loading),
    clearLoading: () => clearLoading(key)
  };
}; 