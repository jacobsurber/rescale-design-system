import React from 'react';
import styled, { css } from 'styled-components';
import { designTokens } from '../../../theme/tokens';
import * as AntIcons from '@ant-design/icons';

// Icon size definitions using design tokens
export const iconSizes = {
  xs: {
    size: '12px',
    fontSize: 12,
  },
  sm: {
    size: '14px', 
    fontSize: 14,
  },
  md: {
    size: '16px',
    fontSize: 16,
  },
  lg: {
    size: '20px',
    fontSize: 20,
  },
  xl: {
    size: '24px',
    fontSize: 24,
  },
  '2xl': {
    size: '32px',
    fontSize: 32,
  },
} as const;

export type IconSize = keyof typeof iconSizes;
export type IconColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'disabled' | 'inherit';

// Common Ant Design icon names for type safety
export type AntIconName = keyof typeof AntIcons;

export interface IconProps {
  /** Ant Design icon name */
  name: AntIconName;
  /** Icon size */
  size?: IconSize;
  /** Icon color theme */
  color?: IconColor | string;
  /** Whether the icon should spin */
  spin?: boolean;
  /** Whether the icon should rotate */
  rotate?: number;
  /** Additional CSS class */
  className?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  /** Whether the icon is clickable (adds hover effects) */
  clickable?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Aria label for accessibility */
  'aria-label'?: string;
}

// Get color value based on theme
const getIconColor = (color: IconColor | string) => {
  const { colors } = designTokens;
  
  switch (color) {
    case 'primary':
      return colors.brand.brandBlue;
    case 'secondary':
      return colors.semantic.text.secondary;
    case 'success':
      return colors.status.success;
    case 'warning':
      return colors.status.warning;
    case 'error':
      return colors.status.error;
    case 'disabled':
      return colors.semantic.text.disabled;
    case 'inherit':
      return 'inherit';
    default:
      // If it's a custom color string, use it directly
      return typeof color === 'string' ? color : colors.semantic.text.primary;
  }
};

// Get size styles
const getSizeStyles = (size: IconSize) => {
  const sizeConfig = iconSizes[size];
  
  return css`
    font-size: ${sizeConfig.fontSize}px;
    width: ${sizeConfig.size};
    height: ${sizeConfig.size};
    line-height: 1;
  `;
};

const StyledIcon = styled.span<{
  $size: IconSize;
  $color: IconColor | string;
  $clickable: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => getIconColor($color)};
  transition: all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.easeInOut};
  
  ${({ $size }) => getSizeStyles($size)}
  
  ${({ $clickable }) => $clickable && css`
    cursor: pointer;
    border-radius: ${designTokens.borderRadius.sm}px;
    padding: 2px;
    
    &:hover {
      background-color: ${designTokens.colors.interaction.hover};
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    &:focus {
      outline: 2px solid ${designTokens.colors.interaction.focusOutline};
      outline-offset: 2px;
    }
  `}
  
  .anticon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/**
 * Icon - Standardized icon component wrapping Ant Design icons
 * 
 * Features:
 * - Consistent sizing system (xs, sm, md, lg, xl, 2xl)
 * - Theme-aware color system
 * - Hover and active states for clickable icons
 * - Spinning and rotation support
 * - Full TypeScript support for icon names
 * - Accessibility features
 */
export const Icon: React.FC<IconProps> = React.memo(({
  name,
  size = 'md',
  color = 'inherit',
  spin = false,
  rotate,
  clickable = false,
  className,
  onClick,
  style,
  'aria-label': ariaLabel,
  ...props
}) => {
  // Get the Ant Design icon component
  const AntIconComponent = AntIcons[name] as React.ComponentType<any>;
  
  if (!AntIconComponent) {
    console.warn(`Icon "${name}" not found in @ant-design/icons`);
    return null;
  }
  
  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (clickable && onClick) {
      onClick(event);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event as any);
    }
  };
  
  return (
    <StyledIcon
      {...props}
      className={className}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : 'img'}
      aria-label={ariaLabel || (clickable ? `${name} button` : name)}
      $size={size}
      $color={color}
      $clickable={clickable}
    >
      <AntIconComponent 
        spin={spin}
        rotate={rotate}
      />
    </StyledIcon>
  );
});

Icon.displayName = 'Icon';

export default Icon;