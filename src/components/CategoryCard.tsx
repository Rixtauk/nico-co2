
import React from 'react';
import { cn } from '@/lib/utils';
import { CategoryInfo } from '@/types/calculatorTypes';
import * as LucideIcons from 'lucide-react';

interface CategoryCardProps {
  category: CategoryInfo;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const CategoryCard = ({ 
  category, 
  isSelected = false, 
  onClick, 
  className 
}: CategoryCardProps) => {
  const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] || LucideIcons.Circle;

  return (
    <div 
      className={cn(
        "relative p-6 rounded-xl transition-all duration-300 cursor-pointer eco-hover-effect",
        isSelected ? "glass-card ring-2 ring-eco-green shadow-lg" : "bg-white shadow-sm hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "absolute top-0 right-0 w-2 h-16 rounded-tr-xl transition-opacity duration-300",
          category.color,
          isSelected ? "opacity-100" : "opacity-50"
        )}
      />
      
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            category.color
          )}>
            <IconComponent size={20} />
          </div>
          <h3 className="ml-3 text-lg font-semibold">{category.title}</h3>
        </div>
        
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>
      
      {isSelected && (
        <div className="absolute bottom-3 right-3 text-eco-green">
          <LucideIcons.CheckCircle size={18} />
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
