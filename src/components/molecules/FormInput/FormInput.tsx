import React from 'react';
import { Input, Form, Typography } from 'antd';
import type { InputProps } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styled from 'styled-components';
import { designTokens } from '../../../theme/tokens';

const { Text } = Typography;

// Styled wrapper for consistent spacing and styling
const StyledFormItem = styled(Form.Item)`
  margin-bottom: ${designTokens.spacing[6]}px;
  
  .ant-form-item-label {
    padding-bottom: ${designTokens.spacing[1]}px;
    
    > label {
      font-weight: ${designTokens.typography.fontWeight.medium};
      color: ${designTokens.colors.semantic.text.primary};
      font-size: ${designTokens.typography.fontSize.sm}px;
    }
  }
  
  .ant-input,
  .ant-input-password {
    border-radius: ${designTokens.borderRadius.base}px;
    border-color: ${designTokens.colors.semantic.border.primary};
    font-size: ${designTokens.typography.fontSize.base}px;
    padding: ${designTokens.spacing[2]}px ${designTokens.spacing[3]}px;
    
    &:focus,
    &:focus-within {
      border-color: ${designTokens.colors.brand.brandBlue};
      box-shadow: ${designTokens.shadows.focus};
    }
    
    &::placeholder {
      color: ${designTokens.colors.semantic.text.placeholder};
      font-size: ${designTokens.typography.fontSize.sm}px;
    }
  }
  
  .ant-form-item-explain-error {
    font-size: ${designTokens.typography.fontSize.xs}px;
    color: ${designTokens.colors.status.error};
    margin-top: ${designTokens.spacing[1]}px;
  }
  
  .ant-form-item-explain-success {
    font-size: ${designTokens.typography.fontSize.xs}px;
    color: ${designTokens.colors.status.success};
    margin-top: ${designTokens.spacing[1]}px;
  }
`;

const HelperText = styled(Text)`
  font-size: ${designTokens.typography.fontSize.xs}px;
  color: ${designTokens.colors.semantic.text.muted};
  display: block;
  margin-top: ${designTokens.spacing[1]}px;
`;

export interface FormInputProps extends Omit<InputProps, 'size'> {
  /** Form field name for validation */
  name?: string;
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Input type - text, email, password, etc. */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  /** Input size */
  size?: 'small' | 'middle' | 'large';
  /** Error message to display */
  error?: string;
  /** Success message to display */
  successMessage?: string;
  /** Whether to show character count */
  showCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Additional validation rules */
  rules?: any[];
  /** Form item extra props */
  formItemProps?: any;
}

/**
 * FormInput - Standardized input component with consistent styling and validation
 * 
 * Features:
 * - Consistent design token styling
 * - Built-in label and helper text
 * - Validation state styling
 * - Password visibility toggle
 * - Character counting
 * - Accessibility support
 */
export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  helperText,
  required = false,
  type = 'text',
  size = 'middle',
  error,
  successMessage,
  showCount = false,
  maxLength,
  rules = [],
  formItemProps = {},
  ...inputProps
}) => {
  // Build validation rules
  const validationRules = [
    ...(required ? [{ required: true, message: `${label || 'This field'} is required` }] : []),
    ...(type === 'email' ? [{ type: 'email', message: 'Please enter a valid email address' }] : []),
    ...(maxLength ? [{ max: maxLength, message: `Cannot exceed ${maxLength} characters` }] : []),
    ...rules,
  ];

  // Determine validation status
  const validateStatus = error ? 'error' : successMessage ? 'success' : undefined;

  // Choose the right input component based on type
  const renderInput = () => {
    if (type === 'password') {
      return (
        <Input.Password
          {...inputProps}
          size={size}
          maxLength={maxLength}
          showCount={showCount}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      );
    }

    return (
      <Input
        {...inputProps}
        type={type}
        size={size}
        maxLength={maxLength}
        showCount={showCount}
      />
    );
  };

  return (
    <StyledFormItem
      name={name}
      label={label}
      required={required}
      rules={validationRules}
      validateStatus={validateStatus}
      help={error || successMessage}
      {...formItemProps}
    >
      {renderInput()}
      {helperText && !error && !successMessage && (
        <HelperText>{helperText}</HelperText>
      )}
    </StyledFormItem>
  );
};

export default FormInput;