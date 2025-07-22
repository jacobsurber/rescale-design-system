import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';
import styled from 'styled-components';

export interface CardProps extends AntCardProps {
  variant?: 'default' | 'elevated' | 'outlined';
}

const StyledCard = styled(AntCard)<CardProps>`
  &.ant-card {
    border-radius: 8px;
    transition: all 0.3s ease;
    
    ${({ variant }) => {
      switch (variant) {
        case 'elevated':
          return `
            border: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
            
            &:hover {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
          `;
        case 'outlined':
          return `
            border: 1px solid #f0f0f0;
            box-shadow: none;
            
            &:hover {
              border-color: #1890ff;
            }
          `;
        default:
          return `
            border: 1px solid #f0f0f0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          `;
      }
    }}
  }
`;

export const Card: React.FC<CardProps> = ({ variant = 'default', ...props }) => {
  return <StyledCard {...props} variant={variant} />;
};

export default Card;