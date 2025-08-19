import Navigation from './Navigation';
import GlobalLoadingIndicator from './GlobalLoadingIndicator';

const AppLayout = ({ children }) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <Navigation />
      <main className="flex-1">{children}</main>
      <GlobalLoadingIndicator />
      <footer className="w-full border-t py-4 text-center text-sm text-muted-foreground bg-background/95 mt-auto">
        © {currentYear} Lynk • Meta U Capstone Project
      </footer>
    </div>
  );
};

export default AppLayout; 