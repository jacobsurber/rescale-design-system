import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { buttonVariants } from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';
import { designTokens } from '../../../theme/tokens';
import { buttonSizes, type ButtonSize, type ButtonVariant } from './Button.constants';

export type { ButtonSize, ButtonVariant };
export type ButtonShape = 'default' | 'round' | 'circle';

export interface ButtonProps extends Omit<AntButtonProps, 'variant' | 'size' | 'shape'> {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button shape */
  shape?: ButtonShape;
  /** Whether this is an icon-only button */
  iconOnly?: boolean;
  /** Disable animations for this button */
  disableAnimations?: boolean;
  /** Whether button is in loading state with custom text */
  loadingText?: string;
  /** Custom width (useful for consistent button groups) */
  width?: string | number;
  /** Whether to show focus ring on keyboard focus */
  showFocusRing?: boolean;
}

const MotionButton = motion(AntButton);

// Variant styles using design tokens
const getVariantStyles = (variant: ButtonVariant) => {
  const { colors } = designTokens;
  
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${colors.brand.brandBlue};
        border-color: ${colors.brand.brandBlue};
        color: ${colors.neutral.white};
        
        &:hover:not(:disabled) {
          background-color: ${colors.brand.darkBlue};
          border-color: ${colors.brand.darkBlue};
          color: ${colors.neutral.white};
        }
        
        &:active:not(:disabled) {
          background-color: ${colors.brand.darkBlue};
          border-color: ${colors.brand.darkBlue};
        }
        
        &:focus:not(:disabled) {
          border-color: ${colors.brand.brandBlue};
          box-shadow: ${colors.interaction.focus};
        }
      `;
      
    case 'secondary':
      return css`
        background-color: ${colors.neutral.gray100};
        border-color: ${colors.neutral.grayBorder};
        color: ${colors.semantic.text.primary};
        
        &:hover:not(:disabled) {
          background-color: ${colors.neutral.grayBorderLight};
          border-color: ${colors.brand.darkBlue};
          color: ${colors.semantic.text.primary};
        }
        
        &:active:not(:disabled) {
          background-color: ${colors.neutral.grayBorderLight};
          border-color: ${colors.brand.brandBlue};
        }
        
        &:focus:not(:disabled) {
          border-color: ${colors.brand.brandBlue};
          box-shadow: ${colors.interaction.focus};
        }
      `;
      
    case 'ghost':
      return css`
        background-color: transparent;
        border-color: ${colors.neutral.grayBorder};
        color: ${colors.semantic.text.primary};
        
        &:hover:not(:disabled) {
          border-color: ${colors.brand.brandBlue};
          color: ${colors.brand.brandBlue};
          background-color: ${colors.brand.lightBlue};
        }
        
        &:active:not(:disabled) {
          border-color: ${colors.brand.darkBlue};
          color: ${colors.brand.darkBlue};
        }
        
        &:focus:not(:disabled) {
          border-color: ${colors.brand.brandBlue};
          box-shadow: ${colors.interaction.focus};
        }
      `;
      
    case 'text':
      return css`
        background-color: transparent;
        border: none;
        color: ${colors.brand.brandBlue};
        
        &:hover:not(:disabled) {
          background-color: ${colors.brand.lightBlue};
          color: ${colors.brand.darkBlue};
        }
        
        &:active:not(:disabled) {
          background-color: ${colors.brand.lightBlue};
          color: ${colors.brand.darkBlue};
        }
        
        &:focus:not(:disabled) {
          box-shadow: ${colors.interaction.focus};
        }
      `;
      
    case 'danger':
      return css`
        background-color: ${colors.status.error};
        border-color: ${colors.status.error};
        color: ${colors.neutral.white};
        
        &:hover:not(:disabled) {
          background-color: ${colors.semantic.status.error.dark};
          border-color: ${colors.semantic.status.error.dark};
          color: ${colors.neutral.white};
        }
        
        &:active:not(:disabled) {
          background-color: ${colors.semantic.status.error.dark};
          border-color: ${colors.semantic.status.error.dark};
        }
        
        &:focus:not(:disabled) {
          border-color: ${colors.status.error};
          box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
        }
      `;
      
    case 'success':
      return css`
        background-color: ${colors.status.success};
        border-color: ${colors.status.success};
        color: ${colors.neutral.white};
        
        &:hover:not(:disabled) {
          background-color: ${colors.semantic.status.success.dark};
          border-color: ${colors.semantic.status.success.dark};
          color: ${colors.neutral.white};
        }
        
        &:active:not(:disabled) {
          background-color: ${colors.semantic.status.success.dark};
          border-color: ${colors.semantic.status.success.dark};
        }
        
        &:focus:not(:disabled) {
          border-color: ${colors.status.success};
          box-shadow: 0 0 0 2px rgba(80, 200, 120, 0.1);
        }
      `;
      
    case 'warning':
      return css`
        background-color: ${colors.status.warning};
        border-color: ${colors.status.warning};
        color: ${colors.neutral.white};
        
        &:hover:not(:disabled) {
          background-color: ${colors.semantic.status.warning.dark};
          border-color: ${colors.semantic.status.warning.dark};
          color: ${colors.neutral.white};
        }
        
        &:active:not(:disabled) {
          background-color: ${colors.semantic.status.warning.dark};
          border-color: ${colors.semantic.status.warning.dark};
        }
        
        &:focus:not(:disabled) {
          border-color: ${colors.status.warning};
          box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.1);
        }
      `;
      
    default:
      return '';
  }
};

// Size styles using design tokens
const getSizeStyles = (size: ButtonSize, iconOnly: boolean = false) => {
  const sizeConfig = buttonSizes[size];
  
  return css`
    height: ${sizeConfig.height};
    padding: ${iconOnly ? '0' : sizeConfig.padding};
    font-size: ${sizeConfig.fontSize}px;
    border-radius: ${sizeConfig.borderRadius}px;
    font-weight: ${designTokens.typography.fontWeight.medium};
    
    ${iconOnly && css`
      width: ${sizeConfig.height};
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `}
    
    .anticon {
      font-size: ${sizeConfig.iconSize};
    }
    
    &.ant-btn-loading .anticon:not(.anticon-loading) {
      font-size: ${sizeConfig.iconSize};
    }
  `;
};

const StyledButton = styled(MotionButton)<ButtonProps & { $variant: ButtonVariant; $size: ButtonSize }>`
  &.ant-btn {
    transition: all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.easeInOut};
    transform-origin: center;
    will-change: transform;
    position: relative;
    
    /* Apply size styles */
    ${({ $size, iconOnly }) => getSizeStyles($size, iconOnly)}
    
    /* Apply variant styles */
    ${({ $variant }) => getVariantStyles($variant)}
    
    /* Custom width */
    ${({ width }) => width && css`
      width: ${typeof width === 'number' ? `${width}px` : width};
    `}
    
    /* Disabled state */
    &:disabled,
    &.ant-btn-disabled {
      background-color: ${designTokens.colors.semantic.background.disabled} !important;
      border-color: ${designTokens.colors.semantic.border.secondary} !important;
      color: ${designTokens.colors.semantic.text.disabled} !important;
      cursor: not-allowed;
    }
    
    /* Focus ring for accessibility */
    ${({ showFocusRing }) => showFocusRing && css`
      &:focus-visible {
        outline: 2px solid ${designTokens.colors.interaction.focusOutline};
        outline-offset: 2px;
      }
    `}
    
    /* Loading state with custom text */
    &.ant-btn-loading {
      cursor: not-allowed;
    }
  }
`;

/**
 * Button - Enhanced button component with comprehensive variant system
 * 
 * Features:
 * - Complete size system (xs, sm, md, lg, xl)
 * - Full variant coverage (primary, secondary, ghost, text, danger, success, warning)
 * - Icon-only button support
 * - Custom loading text
 * - Accessibility enhancements
 * - Consistent design token usage
 * - Animation support
 */
export const Button: React.FC<ButtonProps> = React.memo(({ 
  variant = 'primary', 
  size = 'md',
  shape = 'default',
  iconOnly = false,
  disableAnimations = false,
  loadingText,
  showFocusRing = true,
  loading,
  children,
  ...props 
}) => {
  const variants = useAnimationVariants(buttonVariants);
  
  // Determine Ant Design props
  const antType = variant === 'primary' ? 'primary' : 'default';
  const antSize = size === 'xs' ? 'small' : size === 'sm' ? 'small' : size === 'md' ? 'middle' : 'large';
  
  const animationProps = disableAnimations 
    ? {} 
    : {
        variants,
        initial: "initial",
        whileHover: "hover",
        whileTap: "tap",
      };
  
  // Handle loading text
  const buttonContent = loading && loadingText ? loadingText : children;
  
  return (
    <StyledButton 
      {...props} 
      {...animationProps}
      type={antType}
      size={antSize}
      shape={shape}
      loading={loading}
      iconOnly={iconOnly}
      showFocusRing={showFocusRing}
      $variant={variant}
      $size={size}
    >
      {buttonContent}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;