import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading', variant = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const variants = {
    default: {
      spinner: {
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }
      },
      dot: {
        opacity: [0.4, 1, 0.4],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    dots: {
      y: [-4, 4, -4],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            className={`bg-orange-500 rounded-full ${sizeClasses[size]}`}
            animate={variants.pulse}
          />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`bg-orange-500 rounded-full ${sizeClasses.small}`}
                animate={variants.dots}
                transition={{
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <motion.div
              className={`border-4 border-orange-200 border-t-orange-500 rounded-full ${sizeClasses[size]}`}
              animate={variants.default.spinner}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={variants.default.dot}
            >
              <div className={`bg-orange-500 rounded-full ${size === 'small' ? 'w-1 h-1' : 'w-2 h-2'}`} />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {renderLoadingIndicator()}
      {text && (
        <motion.p
          className="text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ text }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

// Loading skeleton for content
export const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-4 p-4">
      <motion.div
        className="h-8 bg-gray-200 rounded-md w-3/4"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded-md w-full"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded-md w-5/6"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

export default LoadingSpinner;