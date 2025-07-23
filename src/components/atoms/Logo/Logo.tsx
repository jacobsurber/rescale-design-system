import React from 'react';
import styled, { css } from 'styled-components';
import { designTokens } from '../../../theme/tokens';
import { Icon } from '../Icon';
import { logoSizes, softwareLogoMap, type LogoSize } from './Logo.constants';

export type { LogoSize };
export type LogoVariant = 'default' | 'square' | 'rounded' | 'circle';


export interface LogoProps {
  /** Logo source - can be URL, software name, or React component */
  src?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Software name for automatic logo mapping */
  software?: string;
  /** Alternative text for accessibility */
  alt: string;
  /** Logo size */
  size?: LogoSize;
  /** Visual variant */
  variant?: LogoVariant;
  /** Custom width (overrides size) */
  width?: string | number;
  /** Custom height (overrides size) */
  height?: string | number;
  /** Whether the logo is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void;
  /** Whether to show loading state */
  loading?: boolean;
  /** Fallback content when logo fails to load */
  fallback?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

// Get size styles
const getSizeStyles = (size: LogoSize) => {
  const sizeConfig = logoSizes[size];
  
  return css`
    width: ${sizeConfig.width};
    height: ${sizeConfig.height};
    font-size: ${sizeConfig.fontSize}px;
  `;
};

// Get variant styles
const getVariantStyles = (variant: LogoVariant) => {
  switch (variant) {
    case 'square':
      return css`
        border-radius: 0;
      `;
    case 'rounded':
      return css`
        border-radius: ${designTokens.borderRadius.md}px;
      `;
    case 'circle':
      return css`
        border-radius: 50%;
      `;
    default:
      return css`
        border-radius: ${designTokens.borderRadius.sm}px;
      `;
  }
};

const LogoContainer = styled.div<{
  $size: LogoSize;
  $variant: LogoVariant;
  $clickable: boolean;
  $customWidth?: string | number;
  $customHeight?: string | number;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.easeInOut};
  
  ${({ $size, $customWidth, $customHeight }) => {
    if ($customWidth || $customHeight) {
      return css`
        width: ${typeof $customWidth === 'number' ? `${$customWidth}px` : $customWidth || 'auto'};
        height: ${typeof $customHeight === 'number' ? `${$customHeight}px` : $customHeight || 'auto'};
      `;
    }
    return getSizeStyles($size);
  }}
  
  ${({ $variant }) => getVariantStyles($variant)}
  
  ${({ $clickable }) => $clickable && css`
    cursor: pointer;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: ${designTokens.shadows.sm};
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    &:focus {
      outline: 2px solid ${designTokens.colors.interaction.focusOutline};
      outline-offset: 2px;
    }
  `}
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const LogoSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: inherit;
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

/**
 * Logo - Versatile logo component for brand and software logos
 * 
 * Features:
 * - Automatic software logo mapping with fallback icons
 * - Multiple size variants with consistent proportions
 * - Support for images, components, and icon fallbacks
 * - Loading states and error handling
 * - Clickable variants with hover effects
 * - Full accessibility support
 */
export const Logo: React.FC<LogoProps> = React.memo(({
  src,
  software,
  alt,
  size = 'md',
  variant = 'default',
  width,
  height,
  clickable = false,
  onClick,
  loading = false,
  fallback,
  className,
  style,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  
  const handleClick = (event: React.MouseEvent) => {
    if (clickable && onClick) {
      onClick(event);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event as React.MouseEvent);
    }
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  // Determine what to render
  const renderContent = () => {
    if (loading) {
      return <LogoSkeleton />;
    }
    
    // If we have a React component as src
    if (src && typeof src !== 'string') {
      const Component = src;
      return <Component />;
    }
    
    // If we have an image URL and it hasn't errored
    if (src && typeof src === 'string' && !imageError) {
      return (
        <LogoImage
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      );
    }
    
    // If we have a software name, use the mapped icon
    if (software) {
      const logoInfo = softwareLogoMap[software.toLowerCase()] || softwareLogoMap.unknown;
      return (
        <Icon 
          name={logoInfo.icon}
          size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'md' ? 'md' : size === 'lg' ? 'lg' : 'xl'}
          color={logoInfo.color || 'inherit'}
        />
      );
    }
    
    // Show fallback if provided
    if (fallback) {
      return fallback;
    }
    
    // Final fallback - default icon
    return (
      <Icon 
        name={softwareLogoMap.default.icon}
        size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'md' ? 'md' : size === 'lg' ? 'lg' : 'xl'}
        color="inherit"
      />
    );
  };
  
  return (
    <LogoContainer
      {...props}
      className={className}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : 'img'}
      aria-label={alt}
      $size={size}
      $variant={variant}
      $clickable={clickable}
      $customWidth={width}
      $customHeight={height}
    >
      {renderContent()}
      {imageLoading && src && typeof src === 'string' && !imageError && (
        <LogoSkeleton />
      )}
    </LogoContainer>
  );
});

Logo.displayName = 'Logo';

export default Logo;