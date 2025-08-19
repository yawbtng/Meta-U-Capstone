import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ 
  size = 'default', 
  className = '',
  text = 'Loading...',
  showText = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        {showText && text && (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 