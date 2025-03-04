
export interface UserData {
  email: string;
  name?: string;
}

export type CategoryKey = 'energy' | 'transportation' | 'waste' | 'food' | 'lifestyle';

export interface CategoryData {
  energy: EnergyData;
  transportation: TransportationData;
  waste: WasteData;
  food: FoodData;
  lifestyle: LifestyleData;
}

export interface EnergyData {
  electricityUsage: number; // kWh per month
  naturalGasUsage: number; // therms/cubic meters per month
  heatingOilUsage: number; // gallons/liters per month
  renewablePercentage: number; // percentage of renewable energy
}

export interface TransportationData {
  vehicleType: string; // car, SUV, truck, motorcycle, none
  fuelType: string; // gasoline, diesel, electric, hybrid
  milesDriven: number; // miles/km per week
  publicTransportFrequency: number; // days per week
  flightsPerYear: number; // number of flights annually
}

export interface WasteData {
  wasteProduced: number; // pounds/kg per week
  recyclingPercentage: number; // percentage of waste recycled
  compostPercentage: number; // percentage of waste composted
}

export interface FoodData {
  dietType: string; // omnivore, flexitarian, vegetarian, vegan
  localFoodPercentage: number; // percentage of locally-sourced food
  organicFoodPercentage: number; // percentage of organic food
  foodWastePercentage: number; // percentage of food wasted
}

export interface LifestyleData {
  shoppingFrequency: number; // 1-10 scale
  electronicsUsage: number; // 1-10 scale
  homeSize: number; // square feet/meters
  householdMembers: number; // number of people in household
}

export interface EmissionsResult {
  totalEmissions: number; // in kg CO2e per year
  energyEmissions: number;
  transportationEmissions: number;
  wasteEmissions: number;
  foodEmissions: number;
  lifestyleEmissions: number;
  nationalAverage: number;
  globalAverage: number;
  parisTargets: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  category: CategoryKey;
  title: string;
  description: string;
  potentialSavings: number; // kg CO2e per year
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CategoryInfo {
  key: CategoryKey;
  title: string;
  description: string;
  icon: string;
  color: string;
}
