import React from 'react';
import LoadingSpinner from './loading-spinner';

const AuthLoader = ({ message = "Checking authentication..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-background border rounded-lg shadow-lg">
        <LoadingSpinner size="xl" />
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AuthLoader; 