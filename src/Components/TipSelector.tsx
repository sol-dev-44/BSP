// components/TipSelector.tsx - Reusable tip selection component
import React from 'react';
import { motion } from 'framer-motion';

interface TipSelectorProps {
  selectedAmount: number; // Amount in cents
  onAmountChange: (amount: number) => void; // Amount in cents
  predefinedAmounts?: number[]; // Amounts in cents
  allowCustom?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'grid';
  showZeroOption?: boolean;
  className?: string;
}

const TipSelector: React.FC<TipSelectorProps> = ({
  selectedAmount,
  onAmountChange,
  predefinedAmounts = [1000, 2000, 3000, 4000, 5000], // $10, $20, $30, $40, $50
  allowCustom = true,
  disabled = false,
  size = 'md',
  layout = 'grid',
  showZeroOption = true,
  className = ''
}) => {
  // Local state for custom input to avoid conflicts
  const [customInput, setCustomInput] = React.useState('');
  // Size configurations
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base'
  };

  // Layout configurations
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-3 sm:grid-cols-5 gap-2'
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomInput(value);
    
    // Convert to cents and notify parent
    const numValue = parseFloat(value) || 0;
    onAmountChange(Math.round(numValue * 100));
  };

  const handlePredefinedAmountSelect = (amount: number) => {
    onAmountChange(amount);
    // Clear custom input when predefined amount is selected
    setCustomInput('');
  };

  const isCustomAmount = !predefinedAmounts.includes(selectedAmount) && selectedAmount !== 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Predefined Amount Buttons */}
      <div className={layoutClasses[layout]}>
        {/* Zero/No Tip Option */}
        {showZeroOption && (
          <motion.button
            type="button"
            onClick={() => handlePredefinedAmountSelect(0)}
            disabled={disabled}
            className={`
              ${sizeClasses[size]} rounded-lg border-2 transition-all font-medium
              ${selectedAmount === 0
                ? 'border-gray-400 bg-gray-50 text-gray-700'
                : 'border-gray-300 hover:border-green-300 bg-white text-gray-900'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            No Tip
          </motion.button>
        )}

        {/* Predefined Amount Buttons */}
        {predefinedAmounts.map((amount) => (
          <motion.button
            key={amount}
            type="button"
            onClick={() => handlePredefinedAmountSelect(amount)}
            disabled={disabled}
            className={`
              ${sizeClasses[size]} rounded-lg border-2 transition-all font-medium
              ${selectedAmount === amount
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-green-300 bg-white text-gray-900'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            ${(amount / 100).toFixed(0)}
          </motion.button>
        ))}
      </div>

      {/* Custom Amount Input */}
      {allowCustom && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Tip Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              placeholder="Enter custom amount"
              min="0"
              step="0.01"
              disabled={disabled}
              value={customInput}
              onChange={handleCustomAmountChange}
              className={`
                w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-green-500 focus:border-green-500
                bg-white text-gray-900 placeholder-gray-500
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
          </div>
        </div>
      )}

      {/* Selected Amount Display */}
      {selectedAmount > 0 && (
        <motion.div 
          className="bg-green-50 p-3 rounded-lg border border-green-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm font-semibold text-green-800">
              Tip Amount: ${(selectedAmount / 100).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Your crew will greatly appreciate this! 🚤
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TipSelector;

// Usage Examples:

// 1. Basic usage in a form
/*
const [tipAmount, setTipAmount] = useState(0);

<TipSelector
  selectedAmount={tipAmount}
  onAmountChange={setTipAmount}
/>
*/

// 2. Compact horizontal layout
/*
<TipSelector
  selectedAmount={tipAmount}
  onAmountChange={setTipAmount}
  layout="horizontal"
  size="sm"
  showZeroOption={false}
/>
*/

// 3. Custom predefined amounts
/*
<TipSelector
  selectedAmount={tipAmount}
  onAmountChange={setTipAmount}
  predefinedAmounts={[1500, 2500, 3500]} // $15, $25, $35
  allowCustom={false}
/>
*/

// 4. Integration with existing reservation form
/*
// In CustomerForm.tsx, replace the tip section with:
<div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
  <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
    <span className="text-lg mr-2">🚤</span>
    Tip Your Crew (Optional)
  </h5>
  <p className="text-sm text-gray-600 mb-4">
    Show appreciation for exceptional service with a tip for your crew!
  </p>
  
  <TipSelector
    selectedAmount={formData.tip_amount || 0}
    onAmountChange={(amount) => onChange('tip_amount', amount)}
    layout="grid"
    size="md"
  />
</div>
*/