
import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import CalculatorForm from '@/components/CalculatorForm';
import EmailCapture from '@/components/EmailCapture';
import ResultsView from '@/components/ResultsView';
import { EmissionsResult, UserData } from '@/types/calculatorTypes';
import { calculateEmissions, getDefaultCategoryData } from '@/utils/calculationUtils';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [calculatorState, setCalculatorState] = useState<'form' | 'email' | 'results'>('form');
  const [calculationResults, setCalculationResults] = useState<EmissionsResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFormComplete = useCallback((results: EmissionsResult) => {
    setCalculationResults(results);
    setCalculatorState('email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleEmailSubmit = useCallback(async (userData: UserData) => {
    if (!calculationResults) return;

    setIsSubmitting(true);

    try {
      // Send the data to the webhook
      const response = await fetch('https://hook.eu2.make.com/8e7i073fh1de3mgbhdlhh3l14kueer4b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
          emissions: calculationResults,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      setCalculatorState('results');
      toast.success('Results ready!');
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [calculationResults]);
  
  const handleReset = useCallback(() => {
    setCalculatorState('form');
    setCalculationResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-eco-dark">
              CO<sub>2</sub> <span className="text-gradient">Calculator</span>
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {calculatorState === 'form' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CalculatorForm onComplete={handleFormComplete} />
          </motion.div>
        )}
        
        {calculatorState === 'email' && calculationResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <EmailCapture onSubmit={handleEmailSubmit} isLoading={isSubmitting} />
          </motion.div>
        )}
        
        {calculatorState === 'results' && calculationResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsView results={calculationResults} onReset={handleReset} />
          </motion.div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Measure, understand, and reduce your carbon footprint today.</p>
          <p className="mt-2">© {new Date().getFullYear()} CO₂ Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
