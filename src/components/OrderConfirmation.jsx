import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({isOpen,onClose}) => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Start animation after a brief delay to ensure mount
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 100);

    // Navigate to menu page after animation
    const navigationTimer = setTimeout(() => {
      navigate('/menu');
    }, 2500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div 
        className={`
          relative
          rounded-full
          p-8
          bg-green-100
          transform
          transition-all
          duration-500
          ease-out
          ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        `}
      >
        <div 
          className={`
            transform
            transition-all
            duration-500
            ease-out
            ${animate ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}
          `}
        >
          <Check 
            size={48} 
            className="text-green-600" 
            strokeWidth={3}
          />
        </div>
      </div>
      
      <h2 
        className={`
          mt-6
          text-2xl
          font-semibold
          text-gray-800
          transform
          transition-all
          duration-500
          ease-out
          ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        Order Confirmed!
      </h2>
      
      <p 
        className={`
          mt-2
          text-gray-600
          transform
          transition-all
          duration-500
          ease-out
          delay-150
          ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        Redirecting to menu...
      </p>
    </div>
  );
};

// Add required keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes checkmark {
    from {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default OrderConfirmation;