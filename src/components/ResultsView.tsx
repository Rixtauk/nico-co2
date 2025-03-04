
import { useEffect, useState } from 'react';
import { EmissionsResult, Recommendation } from '@/types/calculatorTypes';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { preparePieChartData, prepareBarChartData, getEmissionLevel, getEquivalencies, ChartData } from '@/utils/chartUtils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface ResultsViewProps {
  results: EmissionsResult;
  onReset: () => void;
}

const ResultsView = ({ results, onReset }: ResultsViewProps) => {
  const [pieData, setPieData] = useState<ChartData[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [emissionLevel, setEmissionLevel] = useState<ReturnType<typeof getEmissionLevel>>();
  const [equivalencies, setEquivalencies] = useState<ReturnType<typeof getEquivalencies>>([]);
  
  useEffect(() => {
    // Prepare chart data
    setPieData(preparePieChartData(results));
    setBarData(prepareBarChartData(results));
    setEmissionLevel(getEmissionLevel(results.totalEmissions));
    setEquivalencies(getEquivalencies(results.totalEmissions));
  }, [results]);

  const formatEmission = (value: number) => {
    return value >= 1000 
      ? `${(value / 1000).toFixed(1)} tonnes CO₂e` 
      : `${Math.round(value)} kg CO₂e`;
  };

  if (!emissionLevel) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 animate-fade-in">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-3 py-1 rounded-full bg-opacity-20 text-sm font-medium mb-2"
          style={{ backgroundColor: `${emissionLevel.color}20`, color: emissionLevel.color }}
        >
          {emissionLevel.level === 'low' && 'Excellent'}
          {emissionLevel.level === 'moderate' && 'Good Progress'}
          {emissionLevel.level === 'high' && 'Room for Improvement'}
          {emissionLevel.level === 'very-high' && 'Action Needed'}
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-2"
        >
          Your Carbon Footprint
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [0.9, 1.05, 1] }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ color: emissionLevel.color }}
        >
          {formatEmission(results.totalEmissions)}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          {emissionLevel.description}
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-2">Emissions Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">See where your emissions are coming from</p>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatEmission(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-2">How You Compare</h2>
          <p className="text-sm text-gray-500 mb-4">Your emissions compared to reference values</p>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => value >= 1000 ? `${value/1000}t` : `${value}kg`} 
                />
                <Tooltip 
                  formatter={(value: number) => formatEmission(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Equivalency Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">What Your Emissions Mean</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {equivalencies.map((eq, index) => (
            <Card key={index} className="p-4 bg-white shadow-sm hover:shadow transition-shadow">
              <p className="text-gray-600 text-sm mb-1">{eq.description}</p>
              <p className="text-xl font-semibold">{eq.value}</p>
            </Card>
          ))}
        </div>
      </motion.div>
      
      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.recommendations.map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </div>
      </motion.div>
      
      {/* Action Button */}
      <div className="text-center mt-8">
        <Button 
          onClick={onReset}
          className="bg-eco-dark hover:bg-eco-dark/90 text-white px-8 py-6 h-auto rounded-xl"
        >
          <Icons.RefreshCw className="mr-2 h-4 w-4" />
          <span>Calculate Again</span>
        </Button>
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  
  const categoryIcon = {
    energy: Icons.Home,
    transportation: Icons.Car,
    waste: Icons.Recycle,
    food: Icons.Apple,
    lifestyle: Icons.ShoppingBag,
  };
  
  const Icon = categoryIcon[recommendation.category];
  
  return (
    <Card className="p-5 bg-white shadow-sm eco-hover-effect">
      <div className="flex items-start">
        <div className="bg-opacity-10 p-2 rounded-full mr-3 bg-eco-green">
          <Icon className="h-5 w-5 text-eco-green" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold">{recommendation.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor[recommendation.difficulty]}`}>
              {recommendation.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
          <p className="text-sm font-medium">
            Potential savings: <span className="text-eco-green">{Math.round(recommendation.potentialSavings)} kg CO₂e/year</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ResultsView;
