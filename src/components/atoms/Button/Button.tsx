import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { buttonVariants } from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';

export interface ButtonProps extends Omit<AntButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  /** Disable animations for this button */
  disableAnimations?: boolean;
}

const MotionButton = motion(AntButton);

const StyledButton = styled(MotionButton)<ButtonProps>`
  &.ant-btn {
    border-radius: var(--rescale-radius-base);
    font-weight: var(--rescale-font-weight-medium);
    transition: all var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
    transform-origin: center;
    will-change: transform;
    
    ${({ variant }) => {
      switch (variant) {
        case 'secondary':
          return `
            background-color: var(--rescale-color-gray-100);
            border-color: var(--rescale-color-gray-300);
            color: var(--rescale-color-gray-900);
            
            &:hover {
              background-color: var(--rescale-color-gray-300);
              border-color: var(--rescale-color-gray-500);
              color: var(--rescale-color-gray-900);
            }
          `;
        case 'ghost':
          return `
            background-color: transparent;
            border-color: var(--rescale-color-gray-300);
            color: var(--rescale-color-gray-900);
            
            &:hover {
              border-color: var(--rescale-color-brand-blue);
              color: var(--rescale-color-brand-blue);
            }
          `;
        case 'text':
          return `
            background-color: transparent;
            border: none;
            color: var(--rescale-color-brand-blue);
            
            &:hover {
              background-color: var(--rescale-color-light-blue);
              color: var(--rescale-color-dark-blue);
            }
          `;
        default:
          return '';
      }
    }}
  }
`;

export const Button: React.FC<ButtonProps> = React.memo(({ 
  variant = 'primary', 
  type, 
  disableAnimations = false,
  ...props 
}) => {
  const variants = useAnimationVariants(buttonVariants);
  const buttonType = variant === 'primary' ? 'primary' : type || 'default';
  
  const animationProps = disableAnimations 
    ? {} 
    : {
        variants,
        initial: "initial",
        whileHover: "hover",
        whileTap: "tap",
      };
  
  return (
    <StyledButton 
      {...props} 
      {...animationProps}
      type={buttonType} 
      variant={variant}
    />
  );
});

Button.displayName = 'Button';

export default Button;