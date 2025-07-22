import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';
import styled from 'styled-components';

export interface CardProps extends Omit<AntCardProps, 'variant'> {
  variant?: 'default' | 'elevated' | 'outlined';
}

const StyledCard = styled(AntCard)<CardProps>`
  &.ant-card {
    border-radius: var(--rescale-radius-lg);
    transition: all var(--rescale-duration-slow) var(--rescale-easing-ease-in-out);
    
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

export const Card: React.FC<CardProps> = ({ variant = 'default', ...props }) => {
  return <StyledCard {...props} variant={variant} />;
};

export default Card;