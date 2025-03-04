
import { 
  CategoryData, 
  EmissionsResult, 
  EnergyData, 
  TransportationData, 
  WasteData, 
  FoodData, 
  LifestyleData,
  Recommendation
} from '../types/calculatorTypes';

// Emission factors
const EMISSIONS_FACTORS = {
  // Energy (kg CO2e per unit)
  electricity: 0.5, // kg CO2e per kWh (varies by country/region)
  naturalGas: 5.3, // kg CO2e per therm
  heatingOil: 10.15, // kg CO2e per gallon
  
  // Transportation
  carEmissions: {
    gasoline: 0.404, // kg CO2e per mile
    diesel: 0.429, // kg CO2e per mile
    hybrid: 0.202, // kg CO2e per mile
    electric: 0.1, // kg CO2e per mile (depends on grid)
  },
  publicTransport: 0.16, // kg CO2e per mile
  flight: 200, // kg CO2e per flight hour (average)
  
  // Waste
  waste: 0.5, // kg CO2e per pound of waste
  
  // Food (kg CO2e per day)
  diet: {
    omnivore: 7.4,
    flexitarian: 5.3,
    vegetarian: 3.8,
    vegan: 2.9,
  },
  
  // Lifestyle
  shopping: 0.5, // kg CO2e per point on 1-10 scale, per day
  electronics: 0.3, // kg CO2e per point on 1-10 scale, per day
  homeSize: 0.005, // kg CO2e per square foot per year
};

// Reference values
const REFERENCE_VALUES = {
  nationalAverage: 16000, // kg CO2e per year (US average)
  globalAverage: 5000, // kg CO2e per year
  parisTargets: 3000, // kg CO2e per year to meet Paris Agreement
};

export function calculateEmissions(data: CategoryData): EmissionsResult {
  // Calculate emissions for each category
  const energyEmissions = calculateEnergyEmissions(data.energy);
  const transportationEmissions = calculateTransportationEmissions(data.transportation);
  const wasteEmissions = calculateWasteEmissions(data.waste);
  const foodEmissions = calculateFoodEmissions(data.food);
  const lifestyleEmissions = calculateLifestyleEmissions(data.lifestyle);
  
  // Calculate total emissions
  const totalEmissions = energyEmissions + transportationEmissions + wasteEmissions + foodEmissions + lifestyleEmissions;
  
  // Generate recommendations based on the data
  const recommendations = generateRecommendations(data, totalEmissions);
  
  return {
    totalEmissions,
    energyEmissions,
    transportationEmissions,
    wasteEmissions,
    foodEmissions,
    lifestyleEmissions,
    nationalAverage: REFERENCE_VALUES.nationalAverage,
    globalAverage: REFERENCE_VALUES.globalAverage,
    parisTargets: REFERENCE_VALUES.parisTargets,
    recommendations,
  };
}

function calculateEnergyEmissions(data: EnergyData): number {
  const electricityEmissions = data.electricityUsage * EMISSIONS_FACTORS.electricity * 12 * (1 - data.renewablePercentage / 100);
  const naturalGasEmissions = data.naturalGasUsage * EMISSIONS_FACTORS.naturalGas * 12;
  const heatingOilEmissions = data.heatingOilUsage * EMISSIONS_FACTORS.heatingOil * 12;
  
  return electricityEmissions + naturalGasEmissions + heatingOilEmissions;
}

function calculateTransportationEmissions(data: TransportationData): number {
  // Calculate vehicle emissions
  let vehicleEmissions = 0;
  if (data.vehicleType !== 'none') {
    const fuelFactor = EMISSIONS_FACTORS.carEmissions[data.fuelType as keyof typeof EMISSIONS_FACTORS.carEmissions];
    vehicleEmissions = data.milesDriven * fuelFactor * 52; // Weekly to yearly
  }
  
  // Calculate public transport emissions
  const publicTransportEmissions = data.publicTransportFrequency * 15 * EMISSIONS_FACTORS.publicTransport * 52; // Assuming 15 miles per day
  
  // Calculate flight emissions
  const flightEmissions = data.flightsPerYear * 3 * EMISSIONS_FACTORS.flight; // Assuming average 3 hours per flight
  
  return vehicleEmissions + publicTransportEmissions + flightEmissions;
}

function calculateWasteEmissions(data: WasteData): number {
  const recyclingReduction = data.recyclingPercentage / 100;
  const compostReduction = data.compostPercentage / 100;
  const netWastePercentage = 1 - recyclingReduction - compostReduction;
  
  return data.wasteProduced * EMISSIONS_FACTORS.waste * netWastePercentage * 52; // Weekly to yearly
}

function calculateFoodEmissions(data: FoodData): number {
  const dietFactor = EMISSIONS_FACTORS.diet[data.dietType as keyof typeof EMISSIONS_FACTORS.diet];
  const localFoodReduction = data.localFoodPercentage * 0.005; // 0.5% reduction per percentage point
  const organicFoodReduction = data.organicFoodPercentage * 0.002; // 0.2% reduction per percentage point
  const foodWasteAddition = data.foodWastePercentage * 0.01; // 1% addition per percentage point
  
  const adjustedDietFactor = dietFactor * (1 - localFoodReduction - organicFoodReduction + foodWasteAddition);
  
  return adjustedDietFactor * 365; // Daily to yearly
}

function calculateLifestyleEmissions(data: LifestyleData): number {
  const shoppingEmissions = data.shoppingFrequency * EMISSIONS_FACTORS.shopping * 365;
  const electronicsEmissions = data.electronicsUsage * EMISSIONS_FACTORS.electronics * 365;
  const homeSizeEmissions = data.homeSize * EMISSIONS_FACTORS.homeSize / Math.max(1, data.householdMembers);
  
  return shoppingEmissions + electronicsEmissions + homeSizeEmissions;
}

function generateRecommendations(data: CategoryData, totalEmissions: number): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Energy recommendations
  if (data.energy.renewablePercentage < 50) {
    recommendations.push({
      category: 'energy',
      title: 'Switch to Renewable Energy',
      description: 'Consider switching to a renewable energy provider or installing solar panels.',
      potentialSavings: data.energy.electricityUsage * EMISSIONS_FACTORS.electricity * 12 * 0.5, // 50% reduction
      difficulty: 'medium',
    });
  }
  
  // Transportation recommendations
  if (data.transportation.vehicleType !== 'none' && data.transportation.fuelType !== 'electric') {
    recommendations.push({
      category: 'transportation',
      title: 'Consider an Electric Vehicle',
      description: 'Your next vehicle purchase could be electric to significantly reduce emissions.',
      potentialSavings: data.transportation.milesDriven * 
        (EMISSIONS_FACTORS.carEmissions[data.transportation.fuelType as keyof typeof EMISSIONS_FACTORS.carEmissions] - 
         EMISSIONS_FACTORS.carEmissions.electric) * 52,
      difficulty: 'hard',
    });
  }
  
  if (data.transportation.publicTransportFrequency < 3 && data.transportation.vehicleType !== 'none') {
    recommendations.push({
      category: 'transportation',
      title: 'Use Public Transportation',
      description: 'Try using public transportation more frequently to reduce driving emissions.',
      potentialSavings: data.transportation.milesDriven * 0.2 * 
        EMISSIONS_FACTORS.carEmissions[data.transportation.fuelType as keyof typeof EMISSIONS_FACTORS.carEmissions] * 52, // 20% reduction in driving
      difficulty: 'easy',
    });
  }
  
  // Waste recommendations
  if (data.waste.recyclingPercentage < 70) {
    recommendations.push({
      category: 'waste',
      title: 'Increase Recycling',
      description: 'Try to recycle more of your waste to reduce landfill emissions.',
      potentialSavings: data.waste.wasteProduced * EMISSIONS_FACTORS.waste * 0.2 * 52, // 20% more recycling
      difficulty: 'easy',
    });
  }
  
  // Food recommendations
  if (data.food.dietType === 'omnivore') {
    recommendations.push({
      category: 'food',
      title: 'Reduce Meat Consumption',
      description: 'Try having meat-free days to reduce your dietary carbon footprint.',
      potentialSavings: (EMISSIONS_FACTORS.diet.omnivore - EMISSIONS_FACTORS.diet.flexitarian) * 365,
      difficulty: 'medium',
    });
  }
  
  // Lifestyle recommendations
  if (data.lifestyle.shoppingFrequency > 5) {
    recommendations.push({
      category: 'lifestyle',
      title: 'Shop More Sustainably',
      description: 'Try buying less and choosing sustainable, long-lasting products.',
      potentialSavings: (data.lifestyle.shoppingFrequency - 5) * EMISSIONS_FACTORS.shopping * 365 * 0.5,
      difficulty: 'medium',
    });
  }
  
  // Sort recommendations by potential savings (highest first)
  return recommendations.sort((a, b) => b.potentialSavings - a.potentialSavings).slice(0, 5);
}

// Helper function to get default values for each category
export function getDefaultCategoryData(): CategoryData {
  return {
    energy: {
      electricityUsage: 500, // kWh per month
      naturalGasUsage: 50, // therms per month
      heatingOilUsage: 0, // gallons per month
      renewablePercentage: 0, // percentage
    },
    transportation: {
      vehicleType: 'car',
      fuelType: 'gasoline',
      milesDriven: 200, // miles per week
      publicTransportFrequency: 0, // days per week
      flightsPerYear: 2,
    },
    waste: {
      wasteProduced: 20, // pounds per week
      recyclingPercentage: 30, // percentage
      compostPercentage: 0, // percentage
    },
    food: {
      dietType: 'omnivore',
      localFoodPercentage: 10, // percentage
      organicFoodPercentage: 10, // percentage
      foodWastePercentage: 20, // percentage
    },
    lifestyle: {
      shoppingFrequency: 5, // 1-10 scale
      electronicsUsage: 5, // 1-10 scale
      homeSize: 1500, // square feet
      householdMembers: 2, // people
    },
  };
}

// Helper function to get display units
export function getDisplayUnits(): { [key: string]: string } {
  return {
    electricityUsage: 'kWh/month',
    naturalGasUsage: 'therms/month',
    heatingOilUsage: 'gallons/month',
    renewablePercentage: '%',
    milesDriven: 'miles/week',
    publicTransportFrequency: 'days/week',
    flightsPerYear: 'flights/year',
    wasteProduced: 'lbs/week',
    recyclingPercentage: '%',
    compostPercentage: '%',
    localFoodPercentage: '%',
    organicFoodPercentage: '%',
    foodWastePercentage: '%',
    homeSize: 'sq ft',
    householdMembers: 'people',
  };
}

// Get category info (titles, descriptions, icons)
export function getCategoryInfo() {
  return {
    energy: {
      key: 'energy',
      title: 'Energy Use',
      description: 'Your home energy consumption including electricity, gas, and heating oil.',
      icon: 'home',
      color: 'bg-yellow-400',
    },
    transportation: {
      key: 'transportation',
      title: 'Transportation',
      description: 'Your travel patterns by car, public transit, and air.',
      icon: 'car',
      color: 'bg-blue-500',
    },
    waste: {
      key: 'waste',
      title: 'Waste',
      description: 'Your household waste generation and recycling habits.',
      icon: 'recycle',
      color: 'bg-eco-green',
    },
    food: {
      key: 'food',
      title: 'Food Choices',
      description: 'Your diet type and food consumption patterns.',
      icon: 'apple',
      color: 'bg-red-500',
    },
    lifestyle: {
      key: 'lifestyle',
      title: 'Lifestyle',
      description: 'Your shopping habits, electronics usage, and housing situation.',
      icon: 'shopping-bag',
      color: 'bg-purple-500',
    },
  };
}
