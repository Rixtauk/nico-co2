
import { useState, useEffect } from 'react';
import { CategoryData, CategoryKey, EmissionsResult } from '@/types/calculatorTypes';
import { getDefaultCategoryData, getCategoryInfo, calculateEmissions, getDisplayUnits } from '@/utils/calculationUtils';
import CategoryCard from './CategoryCard';
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

interface CalculatorFormProps {
  onComplete: (results: EmissionsResult) => void;
}

const CalculatorForm = ({ onComplete }: CalculatorFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CategoryData>(getDefaultCategoryData());
  const [currentCategory, setCurrentCategory] = useState<CategoryKey>('energy');
  
  const categoryInfo = getCategoryInfo();
  const displayUnits = getDisplayUnits();
  const categoryOrder: CategoryKey[] = ['energy', 'transportation', 'waste', 'food', 'lifestyle'];
  
  const totalSteps = categoryOrder.length + 1;
  const stepLabels = ['Start', ...categoryOrder.map(cat => categoryInfo[cat].title), 'Finish'];
  
  const handleInputChange = (category: CategoryKey, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  const handleCategorySelect = (category: CategoryKey) => {
    setCurrentCategory(category);
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      
      if (currentStep < categoryOrder.length) {
        setCurrentCategory(categoryOrder[currentStep]);
      } else if (currentStep === categoryOrder.length) {
        // We're at the final step, calculate results
        const results = calculateEmissions(formData);
        onComplete(results);
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      if (currentStep <= categoryOrder.length + 1) {
        setCurrentCategory(categoryOrder[currentStep - 2]);
      }
    }
  };

  const getInputField = (category: CategoryKey, field: string, label: string) => {
    const value = formData[category][field as keyof typeof formData[typeof category]];
    const unit = displayUnits[field] || '';
    
    if (typeof value === 'string' && ['vehicleType', 'fuelType', 'dietType'].includes(field)) {
      let options: { value: string; label: string }[] = [];
      
      if (field === 'vehicleType') {
        options = [
          { value: 'car', label: 'Car' },
          { value: 'SUV', label: 'SUV' },
          { value: 'truck', label: 'Truck' },
          { value: 'motorcycle', label: 'Motorcycle' },
          { value: 'none', label: 'No Vehicle' },
        ];
      } else if (field === 'fuelType') {
        options = [
          { value: 'gasoline', label: 'Gasoline' },
          { value: 'diesel', label: 'Diesel' },
          { value: 'electric', label: 'Electric' },
          { value: 'hybrid', label: 'Hybrid' },
        ];
      } else if (field === 'dietType') {
        options = [
          { value: 'omnivore', label: 'Omnivore (Regular meat)' },
          { value: 'flexitarian', label: 'Flexitarian (Occasional meat)' },
          { value: 'vegetarian', label: 'Vegetarian (No meat)' },
          { value: 'vegan', label: 'Vegan (No animal products)' },
        ];
      }
      
      return (
        <div className="mb-4" key={field}>
          <Label htmlFor={field} className="block mb-2 text-sm font-medium">{label}</Label>
          <Select
            value={value.toString()}
            onValueChange={(newValue) => handleInputChange(category, field, newValue)}
          >
            <SelectTrigger id={field} className="w-full">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    } else if (typeof value === 'number' && ['shoppingFrequency', 'electronicsUsage'].includes(field)) {
      // Use slider for 1-10 scales
      const displayValue = Math.round(value);
      const labels = {
        shoppingFrequency: {
          1: 'Rarely',
          5: 'Average',
          10: 'Frequently'
        },
        electronicsUsage: {
          1: 'Minimal',
          5: 'Average',
          10: 'Heavy'
        }
      };
      
      return (
        <div className="mb-6" key={field}>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor={field} className="text-sm font-medium">{label}</Label>
            <span className="text-sm font-medium">
              {field === 'shoppingFrequency' && labels.shoppingFrequency[displayValue as keyof typeof labels.shoppingFrequency]}
              {field === 'electronicsUsage' && labels.electronicsUsage[displayValue as keyof typeof labels.electronicsUsage]}
              {!['shoppingFrequency', 'electronicsUsage'].includes(field) && displayValue}
            </span>
          </div>
          <Slider
            id={field}
            min={1}
            max={10}
            step={1}
            value={[value]}
            onValueChange={(values) => handleInputChange(category, field, values[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      );
    } else if (
      typeof value === 'number' && 
      ['renewablePercentage', 'recyclingPercentage', 'compostPercentage', 'localFoodPercentage', 'organicFoodPercentage', 'foodWastePercentage'].includes(field)
    ) {
      // Use slider for percentages
      return (
        <div className="mb-6" key={field}>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor={field} className="text-sm font-medium">{label}</Label>
            <span className="text-sm font-medium">{Math.round(value)}%</span>
          </div>
          <Slider
            id={field}
            min={0}
            max={100}
            step={5}
            value={[value]}
            onValueChange={(values) => handleInputChange(category, field, values[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      );
    } else {
      // Default: use number input
      return (
        <div className="mb-4" key={field}>
          <Label htmlFor={field} className="block mb-2 text-sm font-medium">{label}</Label>
          <div className="relative">
            <Input
              id={field}
              type="number"
              min={0}
              value={value.toString()}
              onChange={(e) => handleInputChange(category, field, parseFloat(e.target.value) || 0)}
              className="pr-16 focus:input-focused"
            />
            {unit && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                {unit}
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  
  const renderCategoryContent = (category: CategoryKey) => {
    const categoryFields: { [key in CategoryKey]: { field: string; label: string }[] } = {
      energy: [
        { field: 'electricityUsage', label: 'Monthly Electricity Usage' },
        { field: 'naturalGasUsage', label: 'Monthly Natural Gas Usage' },
        { field: 'heatingOilUsage', label: 'Monthly Heating Oil Usage' },
        { field: 'renewablePercentage', label: 'Renewable Energy Percentage' },
      ],
      transportation: [
        { field: 'vehicleType', label: 'Primary Vehicle Type' },
        { field: 'fuelType', label: 'Fuel Type' },
        { field: 'milesDriven', label: 'Weekly Miles Driven' },
        { field: 'publicTransportFrequency', label: 'Days Using Public Transport per Week' },
        { field: 'flightsPerYear', label: 'Flights per Year' },
      ],
      waste: [
        { field: 'wasteProduced', label: 'Weekly Waste Produced' },
        { field: 'recyclingPercentage', label: 'Percentage of Waste Recycled' },
        { field: 'compostPercentage', label: 'Percentage of Waste Composted' },
      ],
      food: [
        { field: 'dietType', label: 'Diet Type' },
        { field: 'localFoodPercentage', label: 'Percentage of Locally-Sourced Food' },
        { field: 'organicFoodPercentage', label: 'Percentage of Organic Food' },
        { field: 'foodWastePercentage', label: 'Percentage of Food Wasted' },
      ],
      lifestyle: [
        { field: 'shoppingFrequency', label: 'Shopping Frequency' },
        { field: 'electronicsUsage', label: 'Electronics Usage' },
        { field: 'homeSize', label: 'Home Size' },
        { field: 'householdMembers', label: 'Household Members' },
      ],
    };
    
    return (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-1">{categoryInfo[category].title}</h2>
        <p className="text-gray-600 mb-6">{categoryInfo[category].description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {categoryFields[category].map(({ field, label }) => (
            getInputField(category, field, label)
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        labels={stepLabels}
        className="mb-8" 
      />
      
      {currentStep === 1 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-eco-green bg-opacity-10">
            <Icons.ActivitySquare className="h-10 w-10 text-eco-green" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Calculate Your Carbon Footprint</h1>
          <p className="text-gray-600 max-w-lg mx-auto mb-8">
            Answer a few questions about your lifestyle and habits to estimate your carbon footprint and get personalized recommendations to reduce your impact.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {categoryOrder.map((cat) => (
              <CategoryCard 
                key={cat}
                category={categoryInfo[cat]}
                isSelected={false}
                className="h-full"
              />
            ))}
          </div>
          
          <Button 
            onClick={handleNext} 
            className="bg-eco-green hover:bg-eco-light-green text-white px-10 py-6 rounded-xl h-auto text-lg"
          >
            <span>Start Assessment</span>
            <Icons.ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      ) : currentStep <= categoryOrder.length ? (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {renderCategoryContent(currentCategory)}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="space-x-2"
            >
              <Icons.ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <Button 
              onClick={handleNext}
              className="bg-eco-green hover:bg-eco-light-green text-white space-x-2"
            >
              <span>{currentStep === categoryOrder.length ? 'Calculate Results' : 'Next'}</span>
              <Icons.ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CalculatorForm;
