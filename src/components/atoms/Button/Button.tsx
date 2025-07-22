import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import styled from 'styled-components';

export interface ButtonProps extends AntButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
}

const StyledButton = styled(AntButton)<ButtonProps>`
  &.ant-btn {
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    ${({ variant }) => {
      switch (variant) {
        case 'secondary':
          return `
            background-color: #f0f0f0;
            border-color: #f0f0f0;
            color: #262626;
            
            &:hover {
              background-color: #e6e6e6;
              border-color: #e6e6e6;
              color: #262626;
            }
          `;
        case 'ghost':
          return `
            background-color: transparent;
            border-color: #d9d9d9;
            color: #262626;
            
            &:hover {
              border-color: #1890ff;
              color: #1890ff;
            }
          `;
        case 'text':
          return `
            background-color: transparent;
            border: none;
            color: #1890ff;
            
            &:hover {
              background-color: rgba(24, 144, 255, 0.1);
            }
          `;
        default:
          return '';
      }
    }}
  }
`;

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', type, ...props }) => {
  const buttonType = variant === 'primary' ? 'primary' : type || 'default';
  
  return <StyledButton {...props} type={buttonType} variant={variant} />;
};

export default Button;