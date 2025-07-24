import React, { useState, useRef } from 'react';
import { Input, Button, Select } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const InputContainer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #F0F0F0;
  background: #FFFFFF;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const MessageInput = styled(Input.TextArea)`
  flex: 1;
  border-radius: 8px;
  border: 1px solid #0272C3;
  padding: 12px 16px;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  min-height: 44px;
  max-height: 120px;
  resize: none;
  
  &::placeholder {
    color: #8F99B8;
  }
  
  &:focus {
    border-color: #0272C3;
    box-shadow: 0 0 0 2px rgba(2, 114, 195, 0.1);
  }
  
  &.ant-input {
    padding: 12px 16px;
  }
`;

const SendButton = styled(Button)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0272C3;
  border-color: #0272C3;
  flex-shrink: 0;
  
  &:hover {
    background: #025AA3;
    border-color: #025AA3;
  }
  
  &:focus {
    background: #025AA3;
    border-color: #025AA3;
  }
  
  &:disabled {
    background: #F0F0F0;
    border-color: #D9D9D9;
    color: #BFBFBF;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const ContextRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #8F99B8;
`;

const ContextSelect = styled(Select)`
  .ant-select-selector {
    border: 1px solid #0272C3 !important;
    border-radius: 4px;
    background: #FFFFFF;
    height: 24px;
  }
  
  .ant-select-selection-item {
    color: #0272C3;
    font-weight: 500;
    font-size: 12px;
    line-height: 22px;
  }
  
  .ant-select-arrow {
    color: #0272C3;
  }
`;

export interface ChatInputProps {
  /** Input placeholder text */
  placeholder?: string;
  /** Maximum message length */
  maxLength?: number;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether send is loading */
  loading?: boolean;
  /** Context options for dropdown */
  contextOptions?: Array<{ value: string; label: string }>;
  /** Selected context value */
  selectedContext?: string;
  /** Whether to show context selector */
  showContextSelector?: boolean;
  /** Callback when message is sent */
  onSendMessage?: (message: string, context?: string) => void;
  /** Callback when context changes */
  onContextChange?: (context: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Ask Rescale Assistant...',
  maxLength = 1000,
  disabled = false,
  loading = false,
  contextOptions = [
    { value: 'jobs', label: 'Jobs' },
    { value: 'workflows', label: 'Workflows' },
    { value: 'general', label: 'General' },
  ],
  selectedContext = 'jobs',
  showContextSelector = true,
  onSendMessage,
  onContextChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [currentContext, setCurrentContext] = useState(selectedContext);
  const inputRef = useRef<any>(null);

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (!message || loading || disabled) return;
    
    onSendMessage?.(message, currentContext);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContextChange = (value: string) => {
    setCurrentContext(value);
    onContextChange?.(value);
  };

  const canSend = inputValue.trim().length > 0 && !loading && !disabled;

  return (
    <InputContainer>
      <InputSection>
        <InputRow>
          <MessageInput
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <SendButton
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!canSend}
            loading={loading}
          />
        </InputRow>
        {showContextSelector && (
          <ContextRow>
            <span>Context</span>
            <ContextSelect
              value={currentContext}
              onChange={handleContextChange}
              size="small"
              style={{ width: 80 }}
              options={contextOptions}
            />
          </ContextRow>
        )}
      </InputSection>
    </InputContainer>
  );
};

export default ChatInput;