import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { cardVariants } from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';

export interface CardProps extends Omit<AntCardProps, 'variant'> {
  variant?: 'default' | 'elevated' | 'outlined';
  /** Enable hover animations */
  animateOnHover?: boolean;
  /** Disable all animations */
  disableAnimations?: boolean;
}

const MotionCard = motion(AntCard);

const StyledCard = styled(MotionCard)<CardProps>`
  &.ant-card {
    border-radius: var(--rescale-radius-lg);
    transition: all var(--rescale-duration-slow) var(--rescale-easing-ease-in-out);
    transform-origin: center;
    will-change: transform, box-shadow;
    
    ${({ variant }) => {
      switch (variant) {
        case 'elevated':
          return `
            border: none;
            box-shadow: var(--rescale-shadow-md);
            
            &:hover {
              box-shadow: var(--rescale-shadow-lg);
            }
          `;
        case 'outlined':
          return `
            border: 1px solid var(--rescale-color-gray-300);
            box-shadow: none;
            
            &:hover {
              border-color: var(--rescale-color-brand-blue);
            }
          `;
        default:
          return `
            border: 1px solid var(--rescale-color-gray-300);
            box-shadow: var(--rescale-shadow-sm);
          `;
      }
    }}
  }
`;

export const Card: React.FC<CardProps> = ({ 
  variant = 'default', 
  animateOnHover = true,
  disableAnimations = false,
  ...props 
}) => {
  const variants = useAnimationVariants(cardVariants);
  
  const animationProps = (disableAnimations || !animateOnHover) 
    ? {} 
    : {
        variants,
        initial: "initial",
        whileHover: "hover",
      };
  
  return (
    <StyledCard 
      {...props} 
      {...animationProps}
      variant={variant}
      animateOnHover={animateOnHover}
      disableAnimations={disableAnimations}
    />
  );
};

export default Card;