import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import LoadingSpinner from '../ui/loading-spinner';

const GlobalLoadingIndicator = () => {
  const { isAnyLoading } = useLoading();

  if (!isAnyLoading()) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <LoadingSpinner size="sm" text="Loading..." showText={true} />
      </div>
    </div>
  );
};

export default GlobalLoadingIndicator; 