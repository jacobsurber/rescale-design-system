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
    width: 380px !important;
    max-width: calc(100vw - 32px);
  }
  
  .ant-drawer-header {
    padding: var(--rescale-space-4);
    border-bottom: 1px solid var(--rescale-color-gray-200);
  }
  
  .ant-drawer-body {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
`;

const AssistantInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AssistantName = styled.span`
  font-size: var(--rescale-font-size-base);
  font-weight: var(--rescale-font-weight-semibold);
  color: var(--rescale-color-gray-900);
`;

const AssistantStatus = styled.span`
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-success);
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
  padding: var(--rescale-space-3);
  border-radius: var(--rescale-radius-lg);
  font-size: var(--rescale-font-size-sm);
  line-height: 1.5;
  
  ${props => props.$sender === 'user' 
    ? `
      background: var(--rescale-color-brand-blue);
      color: white;
      border-bottom-right-radius: var(--rescale-radius-xs);
    ` 
    : `
      background: var(--rescale-color-gray-100);
      color: var(--rescale-color-gray-900);
      border-bottom-left-radius: var(--rescale-radius-xs);
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
  padding: var(--rescale-space-4);
  border-top: 1px solid var(--rescale-color-gray-200);
  background: var(--rescale-color-white);
`;

const InputRow = styled.div`
  display: flex;
  gap: var(--rescale-space-2);
  align-items: flex-end;
`;

const MessageInput = styled(TextArea)`
  flex: 1;
  border-radius: var(--rescale-radius-base);
  resize: none;
  
  &.ant-input {
    min-height: 40px;
    max-height: 120px;
  }
`;

const SendButton = styled(Button)`
  flex-shrink: 0;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
      <Avatar
        size={32}
        icon={message.sender === 'user' ? userAvatar : assistantAvatar}
      />
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
            <Avatar icon={assistantAvatar} />
            <AssistantInfo>
              <AssistantName>{assistantName}</AssistantName>
              <AssistantStatus>Online</AssistantStatus>
            </AssistantInfo>
            <HeaderActions>
              {messages.length > 0 && (
                <Button
                  type="text"
                  icon={<ClearOutlined />}
                  onClick={onClear}
                  size="small"
                />
              )}
            </HeaderActions>
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
                <Avatar size={32} icon={assistantAvatar} />
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
          <InputRow>
            <MessageInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              maxLength={maxLength}
              autoSize={{ minRows: 1, maxRows: 4 }}
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
        </InputContainer>
      </ChatDrawer>
    </>
  );
};

export default AssistantChat;