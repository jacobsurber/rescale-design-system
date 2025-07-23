import React from 'react';
import styled, { css } from 'styled-components';
import { designTokens } from '../../../theme/tokens';
import { Icon } from '../Icon';
import type { AntIconName } from '../Icon';

// Logo size definitions using design tokens
export const logoSizes = {
  xs: {
    width: '16px',
    height: '16px',
    fontSize: 12,
  },
  sm: {
    width: '24px',
    height: '24px', 
    fontSize: 14,
  },
  md: {
    width: '32px',
    height: '32px',
    fontSize: 16,
  },
  lg: {
    width: '48px',
    height: '48px',
    fontSize: 20,
  },
  xl: {
    width: '64px',
    height: '64px',
    fontSize: 24,
  },
  '2xl': {
    width: '96px',
    height: '96px',
    fontSize: 32,
  },
} as const;

export type LogoSize = keyof typeof logoSizes;
export type LogoVariant = 'default' | 'square' | 'rounded' | 'circle';

// Software logo mappings - fallback to icons when actual logos aren't available
export const softwareLogoMap: Record<string, { icon: AntIconName; color?: string }> = {
  // CAE/Simulation Software
  'ansys': { icon: 'ExperimentOutlined', color: '#ffb000' },
  'fluent': { icon: 'ExperimentOutlined', color: '#ffb000' },
  'abaqus': { icon: 'BuildOutlined', color: '#0066cc' },
  'star-ccm': { icon: 'ThunderboltOutlined', color: '#ff6b35' },
  'openfoam': { icon: 'CloudOutlined', color: '#2e86de' },
  'nastran': { icon: 'ApartmentOutlined', color: '#00a8ff' },
  'ls-dyna': { icon: 'RocketOutlined', color: '#ee5a24' },
  'comsol': { icon: 'ExperimentOutlined', color: '#0984e3' },
  
  // Computing Platforms
  'matlab': { icon: 'FunctionOutlined', color: '#0076a8' },
  'python': { icon: 'CodeOutlined', color: '#3776ab' },
  'r': { icon: 'BarChartOutlined', color: '#276dc3' },
  
  // Visualization & Analysis
  'paraview': { icon: 'EyeOutlined', color: '#46aef7' },
  'pymol': { icon: 'MedicineBoxOutlined', color: '#006400' },
  'gaussview': { icon: 'AtomicOutlined', color: '#ff7675' },
  
  // Other Engineering Tools
  'cst': { icon: 'RadarChartOutlined', color: '#a29bfe' },
  'hfss': { icon: 'WifiOutlined', color: '#fd79a8' },
  'wrf': { icon: 'CloudOutlined', color: '#00b894' },
  'gromacs': { icon: 'MedicineBoxOutlined', color: '#00cec9' },
  'ncl': { icon: 'BarChartOutlined', color: '#fdcb6e' },
  
  // Default fallbacks
  'default': { icon: 'AppstoreOutlined', color: undefined },
  'unknown': { icon: 'QuestionCircleOutlined', color: '#8c8c8c' },
};

export interface LogoProps {
  /** Logo source - can be URL, software name, or React component */
  src?: string | React.ComponentType<any>;
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
      onClick(event as any);
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