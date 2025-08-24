import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MatchingScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const MatchingScore = ({ score, size = 'md' }: MatchingScoreProps) => {
  const percentage = Math.round(score * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-success-600 bg-success-100';
    if (score >= 0.6) return 'text-warning-600 bg-warning-100';
    return 'text-error-600 bg-error-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    if (score >= 0.4) return 'Fair Match';
    return 'Poor Match';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="w-5 h-5" />;
    if (score >= 0.4) return <Minus className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="text-center"
    >
      <div className="relative inline-block">
        {/* Circular Progress */}
        <div className={`relative ${sizeClasses[size]} rounded-full border-4 border-gray-200 flex items-center justify-center`}>
          <motion.div
            initial={{ strokeDasharray: '0 100' }}
            animate={{ strokeDasharray: `${percentage} 100` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${score >= 0.8 ? '#22c55e' : score >= 0.6 ? '#f59e0b' : '#ef4444'} ${percentage * 3.6}deg, #e5e7eb 0deg)`,
            }}
          />
          <div className="relative z-10 bg-white rounded-full w-full h-full flex items-center justify-center">
            <span className="font-bold text-gray-900">{percentage}%</span>
          </div>
        </div>

        {/* Score Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className={`absolute -top-2 -right-2 p-2 rounded-full ${getScoreColor(score)}`}
        >
          {getScoreIcon(score)}
        </motion.div>
      </div>

      {/* Score Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="mt-4"
      >
        <h3 className="font-semibold text-gray-900">{getScoreLabel(score)}</h3>
        <p className="text-sm text-gray-600">Matching Score</p>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="mt-4 space-y-2"
      >
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Skills Match</span>
          <span className="font-medium text-gray-900">
            {Math.round(score * 85)}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Experience Match</span>
          <span className="font-medium text-gray-900">
            {Math.round(score * 90)}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cultural Fit</span>
          <span className="font-medium text-gray-900">
            {Math.round(score * 75)}%
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MatchingScore;
