import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Drawer, 
  Input, 
  Button, 
  Avatar, 
  Spin,
  Typography,
  Badge,
} from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { AssistantChatStyledProps } from '@/theme/figma-styles/assistantchat';
import type { ChatMessage, AssistantChatProps } from './AssistantChat';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Figma-styled Chat Drawer with extracted design specifications
 */
const FigmaChatDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: ${AssistantChatStyledProps.containerMaxWidth} !important;
    max-width: calc(100vw - 32px);
  }
  
  .ant-drawer-header {
    background: ${AssistantChatStyledProps.headerBg};
    padding: ${AssistantChatStyledProps.headerPadding};
    border-bottom: ${AssistantChatStyledProps.headerBorder};
  }
  
  .ant-drawer-body {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    background: ${AssistantChatStyledProps.containerBg};
  }
`;

/**
 * Chat header with Figma styling
 */
const FigmaChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
  background: ${AssistantChatStyledProps.headerBg};
`;

/**
 * Assistant info section
 */
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

/**
 * Messages container with Figma specifications
 */
const FigmaMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${AssistantChatStyledProps.messageAreaBg};
  padding: ${AssistantChatStyledProps.messageAreaPadding};
  min-height: ${AssistantChatStyledProps.messageAreaMinHeight};
  max-height: ${AssistantChatStyledProps.messageAreaMaxHeight};
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-3);
`;

/**
 * Message group with Figma-aligned spacing
 */
const FigmaMessageGroup = styled.div<{ $sender: string }>`
  display: flex;
  gap: var(--rescale-space-2);
  align-items: flex-start;
  ${props => props.$sender === 'user' && 'flex-direction: row-reverse;'}
`;

/**
 * Message bubble with exact Figma styling
 */
const FigmaMessageBubble = styled.div<{ $sender: string }>`
  max-width: 75%;
  
  ${props => props.$sender === 'user' 
    ? `
      background: ${AssistantChatStyledProps.userMessageBg};
      color: ${AssistantChatStyledProps.userMessageColor};
      padding: ${AssistantChatStyledProps.userMessagePadding};
      border-radius: ${AssistantChatStyledProps.userMessageRadius};
    ` 
    : `
      background: ${AssistantChatStyledProps.assistantMessageBg};
      color: ${AssistantChatStyledProps.assistantMessageColor};
      padding: ${AssistantChatStyledProps.assistantMessagePadding};
      border-radius: ${AssistantChatStyledProps.assistantMessageRadius};
    `
  }
  
  font-size: var(--rescale-font-size-sm);
  line-height: 1.5;
  word-wrap: break-word;
`;

/**
 * Input container with Figma styling
 */
const FigmaInputContainer = styled.div`
  background: ${AssistantChatStyledProps.inputAreaBg};
  border-top: ${AssistantChatStyledProps.inputAreaBorder};
  padding: ${AssistantChatStyledProps.inputAreaPadding};
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
    background: ${AssistantChatStyledProps.containerBg};
    border: 1px solid #E5E7EB;
  }
  
  &:focus {
    border-color: ${AssistantChatStyledProps.userMessageBg};
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

/**
 * Figma-styled send button
 */
const FigmaSendButton = styled(Button)`
  flex-shrink: 0;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${AssistantChatStyledProps.userMessageBg} !important;
  border: none !important;
  
  &:hover {
    background: ${AssistantChatStyledProps.userMessageBg} !important;
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

/**
 * Figma-styled float button
 */
const FigmaFloatButton = styled(FloatButton)`
  width: ${AssistantChatStyledProps.floatButtonWidth} !important;
  height: ${AssistantChatStyledProps.floatButtonHeight} !important;
  background: ${AssistantChatStyledProps.floatButtonBg} !important;
  box-shadow: ${AssistantChatStyledProps.floatButtonShadow} !important;
  border: none !important;
  
  &:hover {
    background: ${AssistantChatStyledProps.floatButtonBg} !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4) !important;
  }
  
  .ant-float-btn-body {
    background: transparent !important;
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

/**
 * Enhanced Assistant Chat Component with Figma Styling
 * Uses extracted styles from Figma frame: R&DCloud-ProFolStu-Project (17279:269520)
 */
export const FigmaAssistantChat: React.FC<AssistantChatProps> = ({
  defaultOpen = false,
  position = 'bottomRight',
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
    <FigmaMessageGroup key={message.id} $sender={message.sender}>
      <Avatar
        size={32}
        icon={message.sender === 'user' ? userAvatar : assistantAvatar}
      />
      <div>
        <FigmaMessageBubble $sender={message.sender}>
          {message.content}
        </FigmaMessageBubble>
        <MessageTimestamp $sender={message.sender}>
          {formatTimestamp(message.timestamp)}
        </MessageTimestamp>
      </div>
    </FigmaMessageGroup>
  );

  const floatButton = (
    <Badge count={showUnreadBadge ? unreadCount : 0} size="small">
      <FigmaFloatButton
        icon={<MessageOutlined style={{ color: 'white' }} />}
        onClick={handleToggle}
        style={style}
        className={className}
      />
    </Badge>
  );

  return (
    <>
      {floatButton}
      
      <FigmaChatDrawer
        title={
          <FigmaChatHeader>
            <Avatar icon={assistantAvatar} />
            <AssistantInfo>
              <AssistantName>{assistantName}</AssistantName>
              <AssistantStatus>Online • Figma Styled</AssistantStatus>
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
          </FigmaChatHeader>
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
                  <br />
                  <em>Now with Figma-extracted styling!</em>
                </Text>
              </div>
            </div>
          </EmptyState>
        ) : (
          <FigmaMessagesContainer>
            {messages.map(renderMessage)}
            
            {isTyping && (
              <FigmaMessageGroup $sender="assistant">
                <Avatar size={32} icon={assistantAvatar} />
                <TypingIndicator>
                  <Spin size="small" />
                  {assistantName} is typing...
                </TypingIndicator>
              </FigmaMessageGroup>
            )}
            
            <div ref={messagesEndRef} />
          </FigmaMessagesContainer>
        )}
        
        <FigmaInputContainer>
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
            <FigmaSendButton
              type="primary"
              icon={<SendOutlined style={{ color: 'white' }} />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              loading={loading}
            />
          </InputRow>
        </FigmaInputContainer>
      </FigmaChatDrawer>
    </>
  );
};

export default FigmaAssistantChat;