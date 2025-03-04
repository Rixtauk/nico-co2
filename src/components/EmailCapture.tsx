
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserData } from '@/types/calculatorTypes';
import { toast } from '@/components/ui/sonner';
import { Icons } from 'lucide-react';

interface EmailCaptureProps {
  onSubmit: (userData: UserData) => Promise<void>;
  isLoading: boolean;
}

const EmailCapture = ({ onSubmit, isLoading }: EmailCaptureProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    
    try {
      await onSubmit({ email, name });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Email submission error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 animate-scale-in">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-eco-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-eco-green"
          >
            <path d="M22 2H2v20h20V2z" />
            <path d="M22 2L12 12 2 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Get Your Results</h2>
        <p className="text-gray-500">
          Enter your email to view your detailed carbon footprint results and personalized recommendations.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:input-focused"
          />
        </div>
        
        <div>
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`focus:input-focused ${emailError ? 'border-red-500' : ''}`}
            required
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-eco-green hover:bg-eco-light-green text-white transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'View My Results'
          )}
        </Button>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>We respect your privacy and will never share your information.</p>
        </div>
      </form>
    </div>
  );
};

export default EmailCapture;
