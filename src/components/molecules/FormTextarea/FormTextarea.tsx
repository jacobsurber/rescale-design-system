import React from 'react';
import { Input, Form, Typography } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import styled from 'styled-components';
import { designTokens } from '../../../theme/tokens';

const { TextArea } = Input;
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
  
  .ant-input {
    border-radius: ${designTokens.borderRadius.base}px;
    border-color: ${designTokens.colors.semantic.border.primary};
    font-size: ${designTokens.typography.fontSize.base}px;
    padding: ${designTokens.spacing[3]}px;
    line-height: ${designTokens.typography.lineHeight.normal};
    
    &:focus,
    &:focus-within {
      border-color: ${designTokens.colors.brand.brandBlue};
      box-shadow: ${designTokens.shadows.focus};
    }
    
    &::placeholder {
      color: ${designTokens.colors.semantic.text.placeholder};
      font-size: ${designTokens.typography.fontSize.sm}px;
    }
    
    &.ant-input-disabled {
      background-color: ${designTokens.colors.semantic.background.disabled};
      color: ${designTokens.colors.semantic.text.disabled};
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

export interface FormTextareaProps extends Omit<TextAreaProps, 'size'> {
  /** Form field name for validation */
  name?: string;
  /** Textarea label */
  label?: string;
  /** Helper text below textarea */
  helperText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Textarea size */
  size?: 'small' | 'middle' | 'large';
  /** Error message to display */
  error?: string;
  /** Success message to display */
  successMessage?: string;
  /** Whether to show character count */
  showCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows */
  maxRows?: number;
  /** Additional validation rules */
  rules?: any[];
  /** Form item extra props */
  formItemProps?: any;
  /** Whether textarea can be resized */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * FormTextarea - Standardized textarea component with consistent styling and validation
 * 
 * Features:
 * - Consistent design token styling
 * - Built-in label and helper text
 * - Validation state styling
 * - Character counting
 * - Auto-resizing capability
 * - Accessibility support
 */
export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  label,
  helperText,
  required = false,
  size = 'middle',
  error,
  successMessage,
  showCount = false,
  maxLength,
  minRows = 3,
  maxRows,
  rules = [],
  formItemProps = {},
  resize = 'vertical',
  ...textareaProps
}) => {
  // Build validation rules
  const validationRules = [
    ...(required ? [{ required: true, message: `${label || 'This field'} is required` }] : []),
    ...(maxLength ? [{ max: maxLength, message: `Cannot exceed ${maxLength} characters` }] : []),
    ...rules,
  ];

  // Determine validation status
  const validateStatus = error ? 'error' : successMessage ? 'success' : undefined;

  // Calculate rows based on size
  const getRows = () => {
    if (textareaProps.rows) return textareaProps.rows;
    
    switch (size) {
      case 'small': return Math.max(minRows, 2);
      case 'large': return Math.max(minRows, 4);
      default: return minRows;
    }
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
      <TextArea
        {...textareaProps}
        rows={getRows()}
        maxLength={maxLength}
        showCount={showCount}
        autoSize={maxRows ? { minRows, maxRows } : { minRows }}
        style={{
          resize,
          ...textareaProps.style,
        }}
      />
      {helperText && !error && !successMessage && (
        <HelperText>{helperText}</HelperText>
      )}
    </StyledFormItem>
  );
};

export default FormTextarea;