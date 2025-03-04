
import { EmissionsResult, CategoryInfo } from '../types/calculatorTypes';

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function preparePieChartData(emissions: EmissionsResult): ChartData[] {
  return [
    { name: 'Energy', value: emissions.energyEmissions, color: '#FFD43B' },
    { name: 'Transportation', value: emissions.transportationEmissions, color: '#4C9AFF' },
    { name: 'Waste', value: emissions.wasteEmissions, color: '#00E676' },
    { name: 'Food', value: emissions.foodEmissions, color: '#FF5252' },
    { name: 'Lifestyle', value: emissions.lifestyleEmissions, color: '#9C27B0' },
  ];
}

export function prepareBarChartData(emissions: EmissionsResult) {
  return [
    {
      name: 'Your Footprint',
      value: emissions.totalEmissions,
      fill: '#00E676',
    },
    {
      name: 'National Average',
      value: emissions.nationalAverage,
      fill: '#4C9AFF',
    },
    {
      name: 'Global Average',
      value: emissions.globalAverage,
      fill: '#FFD43B',
    },
    {
      name: 'Paris Target',
      value: emissions.parisTargets,
      fill: '#FF5252',
    },
  ];
}

export function getEmissionLevel(totalEmissions: number): {
  level: 'low' | 'moderate' | 'high' | 'very-high';
  color: string;
  description: string;
} {
  if (totalEmissions <= 3000) {
    return {
      level: 'low',
      color: '#00E676',
      description: 'Your carbon footprint is relatively low and meets Paris Agreement targets.',
    };
  } else if (totalEmissions <= 5000) {
    return {
      level: 'moderate',
      color: '#FFD43B',
      description: 'Your carbon footprint is below the global average but still above Paris targets.',
    };
  } else if (totalEmissions <= 10000) {
    return {
      level: 'high',
      color: '#FF9800',
      description: 'Your carbon footprint is above global average but below national average.',
    };
  } else {
    return {
      level: 'very-high',
      color: '#FF5252',
      description: 'Your carbon footprint is high, exceeding both national and global averages.',
    };
  }
}

export function getEquivalencies(totalEmissions: number): { description: string; value: string }[] {
  const equivalencies = [
    {
      description: 'Trees needed to offset',
      value: Math.round(totalEmissions / 22) + ' trees',
    },
    {
      description: 'Miles driven by an average car',
      value: Math.round(totalEmissions * 2.5) + ' miles',
    },
    {
      description: 'Smartphone charges',
      value: Math.round(totalEmissions * 3000) + ' charges',
    },
    {
      description: 'Hours of LED TV watching',
      value: Math.round(totalEmissions * 330) + ' hours',
    },
  ];
  return equivalencies;
}
