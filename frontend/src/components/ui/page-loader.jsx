import LoadingSpinner from './loading-spinner';

const PageLoader = ({ 
  text = 'Loading page...',
  className = '',
  showOverlay = true 
}) => {
  if (showOverlay) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-lg font-medium text-foreground">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg font-medium text-foreground">{text}</p>
      </div>
    </div>
  );
};

export default PageLoader; 