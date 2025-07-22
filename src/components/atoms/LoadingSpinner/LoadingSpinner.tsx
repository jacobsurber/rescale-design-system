import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { spinnerVariants } from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'small' | 'medium' | 'large' | number;
  /** Color of the spinner */
  color?: string;
  /** Whether to show as overlay */
  overlay?: boolean;
  /** Custom className */
  className?: string;
}

interface StyledSpinnerProps {
  $size: number;
  $color: string;
  $overlay: boolean;
}

const SpinnerContainer = styled.div<{ $overlay: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ $overlay }) => $overlay && `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
    z-index: 100;
  `}
`;

const Spinner = styled(motion.div)<StyledSpinnerProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid transparent;
  border-top: 2px solid ${({ $color }) => $color};
  border-radius: 50%;
  will-change: transform;
`;

const SPINNER_SIZES = {
  small: 16,
  medium: 24,
  large: 32,
};

/**
 * LoadingSpinner - A customizable loading spinner with smooth animation
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="medium" />
 * <LoadingSpinner size={40} color="#1890ff" overlay />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#1890ff',
  overlay = false,
  className,
}) => {
  const variants = useAnimationVariants(spinnerVariants);
  
  const spinnerSize = typeof size === 'number' ? size : SPINNER_SIZES[size];

  return (
    <SpinnerContainer $overlay={overlay} className={className}>
      <Spinner
        $size={spinnerSize}
        $color={color}
        $overlay={overlay}
        variants={variants}
        animate="animate"
      />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;