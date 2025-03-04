
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

const ProgressBar = ({ 
  currentStep, 
  totalSteps, 
  labels = [], 
  className 
}: ProgressBarProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Calculate the percentage
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  // Animate the progress change
  useEffect(() => {
    // Start with the current value
    const startValue = animatedProgress;
    // Get the target value
    const endValue = percentage;
    // Calculate distance
    const distance = endValue - startValue;
    // Start time
    const startTime = performance.now();
    // Duration of animation in ms
    const duration = 500;
    
    // Animation function
    const animateProgress = (timestamp: number) => {
      // Calculate elapsed time
      const elapsed = timestamp - startTime;
      // Calculate progress (0 to 1)
      const progress = Math.min(elapsed / duration, 1);
      // Apply easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      // Calculate current value
      const current = startValue + distance * eased;
      // Update state
      setAnimatedProgress(current);
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    // Start animation
    requestAnimationFrame(animateProgress);
  }, [percentage]);

  return (
    <div className={cn("w-full px-4", className)}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-eco-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
      
      {labels && labels.length > 0 && (
        <div className="relative w-full mt-2 flex justify-between">
          {labels.map((label, index) => {
            const isActive = index < currentStep;
            const isCurrent = index === currentStep - 1;
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center"
                style={{ position: 'absolute', left: `${(index / (labels.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
              >
                <div 
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    isActive ? "bg-eco-green" : "bg-gray-300",
                    isCurrent && "ring-2 ring-eco-green ring-opacity-50"
                  )}
                />
                <span 
                  className={cn(
                    "text-xs font-medium mt-1 transition-colors",
                    isActive ? "text-eco-dark" : "text-eco-gray",
                    isCurrent && "font-semibold"
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
