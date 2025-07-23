import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { 
  scaleVariants, 
  shakeVariants
} from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';

export interface AnimatedFeedbackProps {
  /** Type of feedback */
  type?: 'success' | 'error' | 'loading';
  /** Show the feedback */
  visible?: boolean;
  /** Feedback message */
  message?: string;
  /** Duration before auto-hiding (ms) */
  duration?: number;
  /** Callback when feedback hides */
  onHide?: () => void;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom className */
  className?: string;
}

interface RippleProps {
  /** Show ripple effect */
  show: boolean;
  /** X position of ripple */
  x: number;
  /** Y position of ripple */
  y: number;
  /** Color of ripple */
  color?: string;
}

const FeedbackContainer = styled(motion.div)<{ $type: 'success' | 'error' | 'loading' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  
  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          background: #F6FFED;
          color: #389E0D;
          border: 1px solid #B7EB8F;
        `;
      case 'error':
        return `
          background: #FFF2F0;
          color: #CF1322;
          border: 1px solid #FFCCC7;
        `;
      case 'loading':
        return `
          background: #F0F5FF;
          color: #0958D9;
          border: 1px solid #ADC6FF;
        `;
    }
  }}
`;

const IconContainer = styled(motion.span)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const LoadingDot = styled(motion.span)`
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  margin: 0 1px;
`;

const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
`;

const RippleCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
`;

// Animation variants
const successIconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0, 
    transition: { 
      type: 'spring' as const, 
      stiffness: 500, 
      damping: 25 
    } 
  },
};

const loadingDotVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const rippleVariants = {
  initial: { scale: 0, opacity: 1 },
  animate: { 
    scale: 4, 
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

/**
 * Ripple - Creates a ripple effect on click
 */
export const Ripple: React.FC<RippleProps> = ({ 
  show, 
  x, 
  y, 
  color = 'rgba(255, 255, 255, 0.6)' 
}) => {
  const variants = useAnimationVariants(rippleVariants);

  if (!show) return null;

  return (
    <RippleContainer>
      <RippleCircle
        variants={variants}
        initial="initial"
        animate="animate"
        style={{
          left: x - 10,
          top: y - 10,
          width: 20,
          height: 20,
          background: color,
        }}
      />
    </RippleContainer>
  );
};

/**
 * AnimatedFeedback - Provides animated feedback for user actions
 * 
 * @example
 * ```tsx
 * <AnimatedFeedback 
 *   type="success" 
 *   visible={showSuccess}
 *   message="Action completed!"
 *   duration={3000}
 *   onHide={() => setShowSuccess(false)}
 * />
 * ```
 */
export const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({
  type = 'success',
  visible = false,
  message,
  duration = 3000,
  onHide,
  icon,
  className,
}) => {
  // const fadeAnimation = useAnimationVariants(fadeVariants);
  const scaleAnimation = useAnimationVariants(scaleVariants);
  const shakeAnimation = useAnimationVariants(shakeVariants);
  
  const [shouldShow, setShouldShow] = useState(visible);

  useEffect(() => {
    setShouldShow(visible);
  }, [visible]);

  useEffect(() => {
    if (shouldShow && duration > 0) {
      const timer = setTimeout(() => {
        setShouldShow(false);
        onHide?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [shouldShow, duration, onHide]);

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return (
          <IconContainer
            variants={successIconVariants}
            initial="hidden"
            animate="visible"
          >
            <CheckOutlined />
          </IconContainer>
        );
      case 'error':
        return (
          <IconContainer
            variants={shakeAnimation}
            animate="shake"
          >
            <CloseCircleOutlined />
          </IconContainer>
        );
      case 'loading':
        return (
          <IconContainer>
            {[0, 1, 2].map((i) => (
              <LoadingDot
                key={i}
                variants={loadingDotVariants}
                animate="animate"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </IconContainer>
        );
      default:
        return null;
    }
  };

  const containerVariants = type === 'error' 
    ? { ...scaleAnimation, ...shakeAnimation }
    : scaleAnimation;

  return (
    <AnimatePresence>
      {shouldShow && (
        <FeedbackContainer
          $type={type}
          className={className}
          variants={containerVariants}
          initial="hidden"
          animate={type === 'error' ? ['visible', 'shake'] : 'visible'}
          exit="exit"
        >
          {getIcon()}
          {message && <span>{message}</span>}
        </FeedbackContainer>
      )}
    </AnimatePresence>
  );
};


export default AnimatedFeedback;