import React from 'react';
import Navigation from './Navigation';
import GlobalLoadingIndicator from './GlobalLoadingIndicator';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <GlobalLoadingIndicator />
    </div>
  );
};

export default AppLayout; 