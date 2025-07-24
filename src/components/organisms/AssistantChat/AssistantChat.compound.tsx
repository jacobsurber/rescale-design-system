import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FloatButton, Drawer, Badge, Spin } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styled from 'styled-components';

// Import compound components
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { ChatAvatar } from './components/ChatAvatar';

export interface ChatMessageData {
  /** Unique message ID */
  id: string;
  /** Message content */
  content: string;
  /** Message sender */
  sender: 'user' | 'assistant';
  /** Message timestamp */
  timestamp: Date;
  /** Whether message is being typed */
  typing?: boolean;
  /** Whether message is favorited */
  isFavorited?: boolean;
  /** Message metadata */
  metadata?: Record<string, any>;
}

export interface ContextOption {
  /** Context value */
  value: string;
  /** Context label */
  label: string;
}

export interface UserProfile {
  /** User display name */
  name: string;
  /** User email */
  email: string;
  /** User initials */
  initials?: string;
  /** User avatar color */
  avatarColor?: string;
  /** User avatar image URL */
  avatarSrc?: string;
}

export interface AssistantChatProps {
  /** Whether chat is initially open */
  defaultOpen?: boolean;
  /** Chat position */
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  /** Chat messages */
  messages?: ChatMessageData[];
  /** Whether assistant is typing */
  isTyping?: boolean;
  /** Whether chat is loading */
  loading?: boolean;
  /** Assistant name */
  assistantName?: string;
  /** User profile information */
  userProfile?: UserProfile;
  /** Input placeholder text */
  placeholder?: string;
  /** Maximum message length */
  maxLength?: number;
  /** Context options for dropdown */
  contextOptions?: ContextOption[];
  /** Selected context value */
  selectedContext?: string;
  /** Whether to show context selector */
  showContextSelector?: boolean;
  /** Whether to show unread count badge */
  showUnreadBadge?: boolean;
  /** Number of unread messages */
  unreadCount?: number;
  /** Suggested prompts for empty state */
  suggestions?: string[];
  /** Custom float button size */
  floatButtonSize?: number;
  /** Whether to show message actions (copy/favorite) */
  showMessageActions?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Callback when message is sent */
  onSendMessage?: (message: string, context: string) => void;
  /** Callback when chat is opened/closed */
  onToggle?: (open: boolean) => void;
  /** Callback when message is copied */
  onCopyMessage?: (messageId: string, content: string) => void;
  /** Callback when message is favorited/unfavorited */
  onToggleFavorite?: (messageId: string, isFavorited: boolean) => void;
  /** Callback when context changes */
  onContextChange?: (context: string) => void;
  /** Callback when suggestion is clicked */
  onSuggestionClick?: (suggestion: string) => void;
}

// Styled components
const ChatDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 400px !important;
    max-width: calc(100vw - 32px);
    background: #FFFFFF;
    border-radius: 12px 0 0 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
  
  .ant-drawer-header {
    padding: 0;
    border-bottom: none;
    background: #FFFFFF;
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

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F5F5F5;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D9D9D9;
    border-radius: 3px;
    
    &:hover {
      background: #BFBFBF;
    }
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const TypingBubble = styled.div`
  padding: 12px 16px;
  background: #F3F7FF;
  border: 1px solid #E6F3FF;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #8F99B8;
  font-style: italic;
`;

const FloatButtonContainer = styled.div`
  position: relative;
`;

export const AssistantChat: React.FC<AssistantChatProps> = ({
  defaultOpen = false,
  position = 'bottomRight',
  messages = [],
  isTyping = false,
  loading = false,
  assistantName = 'Assistant',
  userProfile,
  placeholder = 'Ask Rescale Assistant...',
  maxLength = 1000,
  contextOptions = [
    { value: 'jobs', label: 'Jobs' },
    { value: 'workflows', label: 'Workflows' },
    { value: 'general', label: 'General' },
  ],
  selectedContext = 'jobs',
  showContextSelector = true,
  showUnreadBadge = true,
  unreadCount = 0,
  suggestions = [
    "How do I submit a new job?",
    "Check the status of my running jobs",
    "Help me troubleshoot a failed job",
    "Show me my account usage"
  ],
  floatButtonSize = 56,
  showMessageActions = true,
  className,
  style,
  onSendMessage,
  onToggle,
  onCopyMessage,
  onToggleFavorite,
  onContextChange,
  onSuggestionClick,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [currentContext, setCurrentContext] = useState(selectedContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open && (messages.length > 0 || isTyping)) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isTyping, open, scrollToBottom]);

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  const handleSendMessage = (message: string, context: string) => {
    onSendMessage?.(message, context);
  };

  const handleContextChange = (context: string) => {
    setCurrentContext(context);
    onContextChange?.(context);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick?.(suggestion);
    // Automatically send the suggestion as a message
    onSendMessage?.(suggestion, currentContext);
  };

  const floatButton = (
    <FloatButtonContainer>
      <Badge count={showUnreadBadge ? unreadCount : 0} size="small">
        <FloatButton
          icon={<MessageOutlined />}
          onClick={handleToggle}
          style={{ 
            width: floatButtonSize, 
            height: floatButtonSize,
            ...style,
          }}
          className={className}
        />
      </Badge>
    </FloatButtonContainer>
  );

  return (
    <>
      {floatButton}
      
      <ChatDrawer
        title={
          <ChatHeader
            assistantName={assistantName}
            onClose={handleToggle}
          />
        }
        placement={position.includes('Right') ? 'right' : 'left'}
        open={open}
        onClose={handleToggle}
        closable={false}
        mask={false}
        style={{ position: 'absolute' }}
      >
        {messages.length === 0 && !isTyping ? (
          <EmptyState
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <MessagesContainer>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
                isFavorited={message.isFavorited}
                userInitials={userProfile?.initials || userProfile?.name?.substring(0, 2) || 'JD'}
                userAvatarColor={userProfile?.avatarColor || '#00B8A6'}
                userAvatarSrc={userProfile?.avatarSrc}
                showActions={showMessageActions}
                onCopy={onCopyMessage}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
            
            {isTyping && (
              <TypingIndicator>
                <ChatAvatar type="assistant" size={32} />
                <TypingBubble>
                  <Spin size="small" />
                  {assistantName} is typing...
                </TypingBubble>
              </TypingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>
        )}
        
        <ChatInput
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={loading}
          loading={loading}
          contextOptions={contextOptions}
          selectedContext={currentContext}
          showContextSelector={showContextSelector}
          onSendMessage={handleSendMessage}
          onContextChange={handleContextChange}
        />
      </ChatDrawer>
    </>
  );
};

// Export compound components for external use
export { ChatHeader } from './components/ChatHeader';
export { ChatMessage } from './components/ChatMessage';
export { ChatInput } from './components/ChatInput';
export { ChatAvatar } from './components/ChatAvatar';
export { EmptyState } from './components/EmptyState';
export { MessageBubble } from './components/MessageBubble';
export { MessageActions } from './components/MessageActions';

export default AssistantChat;