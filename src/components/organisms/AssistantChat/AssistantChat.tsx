import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Drawer, 
  Input, 
  Button, 
  Avatar, 
  Divider,
  Spin,
  Typography,
  Badge,
  Select,
} from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  CloseOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { TextArea } = Input;
const { Text } = Typography;

export interface ChatMessage {
  /** Message ID */
  id: string;
  /** Message content */
  content: string;
  /** Message sender */
  sender: 'user' | 'assistant';
  /** Message timestamp */
  timestamp: Date;
  /** Whether message is being typed */
  typing?: boolean;
  /** Message metadata */
  metadata?: Record<string, any>;
}

export type AssistantChatTheme = 'default' | 'figma' | 'custom';

export interface AssistantChatThemeConfig {
  floatButton?: {
    width?: string;
    height?: string;
    backgroundColor?: string;
    boxShadow?: string;
    borderRadius?: string;
  };
  drawer?: {
    width?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
  header?: {
    backgroundColor?: string;
    padding?: string;
    borderBottom?: string;
  };
  message?: {
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
  };
}

export interface AssistantChatProps {
  /** Whether chat is initially open */
  defaultOpen?: boolean;
  /** Chat position */
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  /** Theme variant */
  theme?: AssistantChatTheme;
  /** Custom theme configuration */
  themeConfig?: AssistantChatThemeConfig;
  /** Chat messages */
  messages?: ChatMessage[];
  /** Whether assistant is typing */
  isTyping?: boolean;
  /** Whether chat is loading */
  loading?: boolean;
  /** Assistant name */
  assistantName?: string;
  /** Assistant avatar */
  assistantAvatar?: string | React.ReactNode;
  /** User avatar */
  userAvatar?: string | React.ReactNode;
  /** Placeholder text for input */
  placeholder?: string;
  /** Maximum message length */
  maxLength?: number;
  /** Whether to show unread count badge */
  showUnreadBadge?: boolean;
  /** Number of unread messages */
  unreadCount?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Callback when message is sent */
  onSendMessage?: (message: string) => void;
  /** Callback when chat is opened/closed */
  onToggle?: (open: boolean) => void;
  /** Callback when chat is cleared */
  onClear?: () => void;
}

const ChatDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 400px !important;
    max-width: calc(100vw - 32px);
    background: #FFFFFF;
    border-radius: 12px 0 0 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  }
  
  .ant-drawer-header {
    padding: 16px 20px;
    border-bottom: 1px solid #F0F0F0;
    background: #FFFFFF;
    position: relative;
  }
  
  .ant-drawer-body {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    background: #FFFFFF;
  }
  
  .ant-drawer-close {
    display: none;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0272C3;
  font-size: 16px;
  
  &:hover {
    background: #F3F7FF;
  }
`;

const AssistantBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: #FFFFFF;
  border: 1px solid #0272C3;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #0272C3;
  
  .logo-icon {
    width: 16px;
    height: 16px;
    background: #0272C3;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 8px;
    
    &::before {
      content: '☁️';
      font-size: 10px;
    }
  }
`;

const UserAvatar = styled(Avatar)`
  background-color: #0272C3;
  color: white;
  font-weight: 500;
`;

const AssistantAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0272C3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  flex-shrink: 0;
  
  &::before {
    content: '\u2601\ufe0f';
    font-size: 14px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--rescale-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-4);
`;

const MessageGroup = styled.div<{ $sender: string }>`
  display: flex;
  gap: var(--rescale-space-2);
  align-items: flex-start;
  ${props => props.$sender === 'user' && 'flex-direction: row-reverse;'}
`;

const MessageBubble = styled.div<{ $sender: string }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  font-family: 'Roboto', sans-serif;
  
  ${props => props.$sender === 'user' 
    ? `
      background: #0272C3;
      color: white;
      border-bottom-right-radius: 4px;
      margin-left: auto;
    ` 
    : `
      background: #F3F7FF;
      color: #000000;
      border-bottom-left-radius: 4px;
      border: 1px solid #E6F3FF;
    `
  }
`;

const MessageTimestamp = styled.div<{ $sender: string }>`
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-500);
  margin-top: var(--rescale-space-1);
  ${props => props.$sender === 'user' && 'text-align: right;'}
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  padding: var(--rescale-space-3);
  color: var(--rescale-color-gray-600);
  font-size: var(--rescale-font-size-sm);
  font-style: italic;
`;

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
  }
  
  .ant-select-selection-item {
    color: #0272C3;
    font-weight: 500;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: var(--rescale-space-2);
  align-items: flex-end;
`;

const MessageInput = styled(Input)`
  flex: 1;
  border-radius: 8px;
  border: 1px solid #0272C3;
  padding: 12px 16px;
  font-size: 14px;
  
  &.ant-input {
    height: 44px;
  }
  
  &::placeholder {
    color: #8F99B8;
  }
  
  &:focus {
    border-color: #0272C3;
    box-shadow: 0 0 0 2px rgba(2, 114, 195, 0.1);
  }
`;

const SendButton = styled(Button)`
  flex-shrink: 0;
  height: 44px;
  width: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0272C3;
  border-color: #0272C3;
  
  &:hover {
    background: #025AA3;
    border-color: #025AA3;
  }
  
  &:focus {
    background: #025AA3;
    border-color: #025AA3;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--rescale-space-4);
  color: var(--rescale-color-gray-600);
  text-align: center;
  padding: var(--rescale-space-8);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: var(--rescale-color-gray-400);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--rescale-space-2);
`;

// Theme configurations
const getThemeConfig = (theme: AssistantChatTheme, customConfig?: AssistantChatThemeConfig): AssistantChatThemeConfig => {
  const themes = {
    default: {},
    figma: {
      floatButton: {
        width: '56px',
        height: '56px',
        backgroundColor: '#0272c3',
        boxShadow: '0 4px 12px rgba(2, 114, 195, 0.4)',
        borderRadius: '50%',
      },
      drawer: {
        width: '400px',
        backgroundColor: '#f3f7ff',
        borderRadius: '12px',
      },
      header: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderBottom: '1px solid #dfdfdf',
      },
      message: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
      },
    },
    custom: customConfig || {},
  };
  
  return { ...themes[theme], ...customConfig };
};

export const AssistantChat: React.FC<AssistantChatProps> = ({
  defaultOpen = false,
  position = 'bottomRight',
  theme = 'default',
  themeConfig,
  messages = [],
  isTyping = false,
  loading = false,
  assistantName = 'Rescale Assistant',
  assistantAvatar = <RobotOutlined />,
  userAvatar = <UserOutlined />,
  placeholder = 'Ask me anything about your simulations...',
  maxLength = 1000,
  showUnreadBadge = true,
  unreadCount = 0,
  className,
  style,
  onSendMessage,
  onToggle,
  onClear,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get theme configuration
  const currentTheme = getThemeConfig(theme, themeConfig);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (!message || loading) return;
    
    onSendMessage?.(message);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const renderMessage = (message: ChatMessage) => (
    <MessageGroup key={message.id} $sender={message.sender}>
      {message.sender === 'user' ? (
        <UserAvatar size={32}>JD</UserAvatar>
      ) : (
        <AssistantAvatar />
      )}
      <div>
        <MessageBubble $sender={message.sender}>
          {message.content}
        </MessageBubble>
        <MessageTimestamp $sender={message.sender}>
          {formatTimestamp(message.timestamp)}
        </MessageTimestamp>
      </div>
    </MessageGroup>
  );

  const floatButton = (
    <Badge count={showUnreadBadge ? unreadCount : 0} size="small">
      <FloatButton
        icon={<MessageOutlined />}
        onClick={handleToggle}
        style={{ 
          width: 56, 
          height: 56,
          ...style,
        }}
        className={className}
      />
    </Badge>
  );

  return (
    <>
      {floatButton}
      
      <ChatDrawer
        title={
          <ChatHeader>
            <CloseButton onClick={() => handleToggle()}>
              ✕
            </CloseButton>
            <AssistantBadge>
              <div className="logo-icon"></div>
              Assistant
            </AssistantBadge>
          </ChatHeader>
        }
        placement={position.includes('Right') ? 'right' : 'left'}
        open={open}
        onClose={() => handleToggle()}
        closable={false}
        mask={false}
        style={{ position: 'absolute' }}
      >
        {messages.length === 0 && !isTyping ? (
          <EmptyState>
            <EmptyIcon>
              <RobotOutlined />
            </EmptyIcon>
            <div>
              <Text strong>Hi! I'm your Rescale Assistant</Text>
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary">
                  I can help you with job management, troubleshooting, and platform questions.
                </Text>
              </div>
            </div>
          </EmptyState>
        ) : (
          <MessagesContainer>
            {messages.map(renderMessage)}
            
            {isTyping && (
              <MessageGroup $sender="assistant">
                <AssistantAvatar />
                <TypingIndicator>
                  <Spin size="small" />
                  {assistantName} is typing...
                </TypingIndicator>
              </MessageGroup>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>
        )}
        
        <InputContainer>
          <InputSection>
            <InputRow>
              <MessageInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Rescale Assistant..."
                maxLength={maxLength}
                disabled={loading}
              />
              <SendButton
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || loading}
                loading={loading}
              />
            </InputRow>
            <ContextRow>
              <span>Context</span>
              <ContextSelect
                defaultValue="jobs"
                size="small"
                style={{ width: 80 }}
                options={[
                  { value: 'jobs', label: 'Jobs' },
                  { value: 'workflows', label: 'Workflows' },
                  { value: 'general', label: 'General' },
                ]}
              />
            </ContextRow>
          </InputSection>
        </InputContainer>
      </ChatDrawer>
    </>
  );
};

export default AssistantChat;