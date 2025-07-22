import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { shimmerVariants } from '../../../utils/animations';
import { useAnimationVariants } from '../../../providers/MotionProvider';

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Variant of skeleton */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** Whether to show shimmer animation */
  animate?: boolean;
  /** Custom className */
  className?: string;
  /** Array of skeleton items for complex layouts */
  lines?: number;
}

interface StyledSkeletonProps {
  $width: string | number;
  $height: string | number;
  $variant: SkeletonProps['variant'];
  $animate: boolean;
}

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonBase = styled.div<StyledSkeletonProps>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  position: relative;
  overflow: hidden;
  
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'text':
        return `
          height: 1em;
          border-radius: 4px;
        `;
      case 'circular':
        return `
          border-radius: 50%;
        `;
      case 'rounded':
        return `
          border-radius: 8px;
        `;
      case 'rectangular':
      default:
        return `
          border-radius: 4px;
        `;
    }
  }}
  
  ${({ $animate }) => $animate && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.8),
        transparent
      );
      animation: shimmer 1.5s infinite linear;
    }
    
    @keyframes shimmer {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(100%);
      }
    }
  `}
`;

const ShimmerOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
`;

/**
 * Skeleton - Loading placeholder with optional shimmer animation
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" width="200px" />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height="120px" />
 * <Skeleton lines={3} />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  variant = 'rectangular',
  animate = true,
  className,
  lines = 1,
}) => {
  const shimmerAnimation = useAnimationVariants(shimmerVariants);

  if (lines > 1) {
    return (
      <SkeletonContainer className={className}>
        {Array.from({ length: lines }, (_, index) => (
          <SkeletonBase
            key={index}
            $width={index === lines - 1 ? '60%' : width}
            $height={variant === 'text' ? '1em' : height}
            $variant={variant}
            $animate={false}
          >
            {animate && (
              <ShimmerOverlay
                variants={shimmerAnimation}
                initial="initial"
                animate="animate"
              />
            )}
          </SkeletonBase>
        ))}
      </SkeletonContainer>
    );
  }

  return (
    <SkeletonBase
      $width={width}
      $height={height}
      $variant={variant}
      $animate={false}
      className={className}
    >
      {animate && (
        <ShimmerOverlay
          variants={shimmerAnimation}
          initial="initial"
          animate="animate"
        />
      )}
    </SkeletonBase>
  );
};

export default Skeleton;