import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { pulseVariants, scaleOnTap } from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';
type StatusVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'processing' 
  | 'pending'
  | 'queued'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'running';

type StatusSize = 'small' | 'default' | 'large';

export interface StatusTagProps {
  /** Status variant determining color scheme */
  variant: StatusVariant;
  /** Text content of the tag */
  children: React.ReactNode;
  /** Size of the tag */
  size?: StatusSize;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Whether to show status dot */
  showDot?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether tag is clickable */
  clickable?: boolean;
  /** Enable pulse animation for running states */
  enablePulse?: boolean;
}

const getStatusColors = (variant: StatusVariant) => {
  const colorMap = {
    success: {
      background: '#F6FFED',
      border: '#B7EB8F',
      text: '#389E0D',
      dot: '#52C41A',
    },
    warning: {
      background: '#FFF7E6',
      border: '#FFD591',
      text: '#D46B08',
      dot: '#FA8C16',
    },
    error: {
      background: '#FFF2F0',
      border: '#FFCCC7',
      text: '#CF1322',
      dot: '#FF4D4F',
    },
    info: {
      background: '#F0F5FF',
      border: '#ADC6FF',
      text: '#0958D9',
      dot: '#1890FF',
    },
    processing: {
      background: '#F0F5FF',
      border: '#ADC6FF',
      text: '#0958D9',
      dot: '#1890FF',
    },
    pending: {
      background: '#FAFAFA',
      border: '#D9D9D9',
      text: '#595959',
      dot: '#8C8C8C',
    },
    queued: {
      background: '#FFF7E6',
      border: '#FFD591',
      text: '#D46B08',
      dot: '#FA8C16',
    },
    completed: {
      background: '#F6FFED',
      border: '#B7EB8F',
      text: '#389E0D',
      dot: '#52C41A',
    },
    failed: {
      background: '#FFF2F0',
      border: '#FFCCC7',
      text: '#CF1322',
      dot: '#FF4D4F',
    },
    cancelled: {
      background: '#FAFAFA',
      border: '#D9D9D9',
      text: '#595959',
      dot: '#8C8C8C',
    },
    running: {
      background: '#E8F2FF',
      border: '#91D5FF',
      text: '#0066CC',
      dot: '#1890FF',
    },
  };

  return colorMap[variant];
};

const getSizeStyles = (size: StatusSize) => {
  const sizeMap = {
    small: {
      height: '20px',
      padding: '0 6px',
      fontSize: '11px',
      iconSize: '12px',
      dotSize: '4px',
    },
    default: {
      height: '24px',
      padding: '0 8px',
      fontSize: '12px',
      iconSize: '14px',
      dotSize: '6px',
    },
    large: {
      height: '28px',
      padding: '0 10px',
      fontSize: '13px',
      iconSize: '16px',
      dotSize: '6px',
    },
  };

  return sizeMap[size];
};

const MotionStatusTag = motion.span;

const StatusTagContainer = styled(MotionStatusTag)<{
  $variant: StatusVariant;
  $size: StatusSize;
  $clickable: boolean;
}>`
  ${({ $variant }) => {
    const colors = getStatusColors($variant);
    return `
      background-color: ${colors.background};
      border: 1px solid ${colors.border};
      color: ${colors.text};
    `;
  }}

  ${({ $size }) => {
    const sizeStyles = getSizeStyles($size);
    return `
      height: ${sizeStyles.height};
      padding: ${sizeStyles.padding};
      font-size: ${sizeStyles.fontSize};
    `;
  }}

  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--rescale-radius-base);
  font-weight: var(--rescale-font-weight-medium);
  font-family: var(--rescale-font-family);
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  transition: all var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
  
  ${({ $clickable }) => $clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--rescale-shadow-sm);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const MotionStatusDot = motion.span;

const StatusDot = styled(MotionStatusDot)<{ $variant: StatusVariant; $size: StatusSize }>`
  ${({ $variant, $size }) => {
    const colors = getStatusColors($variant);
    const sizeStyles = getSizeStyles($size);
    return `
      width: ${sizeStyles.dotSize};
      height: ${sizeStyles.dotSize};
      background-color: ${colors.dot};
    `;
  }}
  
  border-radius: 50%;
  flex-shrink: 0;
`;

const StatusIcon = styled.span<{ $size: StatusSize }>`
  ${({ $size }) => {
    const sizeStyles = getSizeStyles($size);
    return `
      font-size: ${sizeStyles.iconSize};
      line-height: 1;
    `;
  }}
  
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatusText = styled.span`
  flex-shrink: 0;
`;

export const StatusTag: React.FC<StatusTagProps> = ({
  variant,
  children,
  size = 'default',
  icon,
  showDot = false,
  className,
  style,
  onClick,
  clickable = false,
  enablePulse = true,
}) => {
  const pulseAnimation = useAnimationVariants(pulseVariants);
  const tapAnimation = useAnimationVariants(scaleOnTap);
  
  // Determine if we should show pulse animation
  const shouldPulse = enablePulse && (variant === 'running' || variant === 'processing');
  const shouldAnimateTap = clickable;

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <StatusTagContainer
      $variant={variant}
      $size={size}
      $clickable={clickable || Boolean(onClick)}
      className={className}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={typeof children === 'string' ? `Status: ${children}` : undefined}
      variants={shouldAnimateTap ? tapAnimation : undefined}
      whileTap={shouldAnimateTap ? "tap" : undefined}
    >
      {showDot && (
        <StatusDot 
          $variant={variant} 
          $size={size}
          variants={shouldPulse ? pulseAnimation : undefined}
          animate={shouldPulse ? "pulse" : undefined}
        />
      )}
      {icon && <StatusIcon $size={size}>{icon}</StatusIcon>}
      <StatusText>{children}</StatusText>
    </StatusTagContainer>
  );
};

export default StatusTag;