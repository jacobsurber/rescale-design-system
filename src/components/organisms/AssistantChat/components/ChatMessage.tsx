import React from 'react';
import styled from 'styled-components';
import { ChatAvatar } from './ChatAvatar';
import { MessageBubble } from './MessageBubble';

const MessageContainer = styled.div<{ $sender: 'user' | 'assistant' }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
  
  ${props => props.$sender === 'user' && 'flex-direction: row-reverse;'}
`;

export interface ChatMessageProps {
  /** Unique message ID */
  id: string;
  /** Message content */
  content: string;
  /** Message sender */
  sender: 'user' | 'assistant';
  /** Message timestamp */
  timestamp?: Date;
  /** Whether message is favorited */
  isFavorited?: boolean;
  /** User initials (for user messages) */
  userInitials?: string;
  /** User avatar color */
  userAvatarColor?: string;
  /** User avatar image URL */
  userAvatarSrc?: string;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Callback when message is copied */
  onCopy?: (messageId: string, content: string) => void;
  /** Callback when message is favorited/unfavorited */
  onToggleFavorite?: (messageId: string, isFavorited: boolean) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  content,
  sender,
  timestamp,
  isFavorited = false,
  userInitials = 'JD',
  userAvatarColor = '#00B8A6',
  userAvatarSrc,
  showActions = true,
  onCopy,
  onToggleFavorite,
}) => {
  const handleCopy = () => {
    onCopy?.(id, content);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(id, !isFavorited);
  };

  return (
    <MessageContainer $sender={sender}>
      <ChatAvatar
        type={sender}
        size={32}
        initials={userInitials}
        color={userAvatarColor}
        src={userAvatarSrc}
      />
      <MessageBubble
        content={content}
        sender={sender}
        timestamp={timestamp}
        isFavorited={isFavorited}
        onCopy={handleCopy}
        onToggleFavorite={handleToggleFavorite}
        showActions={showActions}
      />
    </MessageContainer>
  );
};

export default ChatMessage;