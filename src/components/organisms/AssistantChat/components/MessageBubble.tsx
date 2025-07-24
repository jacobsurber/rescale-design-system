import React from 'react';
import styled from 'styled-components';
import { MessageActions } from './MessageActions';

const BubbleContainer = styled.div<{ $sender: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  max-width: 75%;
  position: relative;
  
  ${props => props.$sender === 'user' && 'align-items: flex-end;'}
`;

const Bubble = styled.div<{ $sender: 'user' | 'assistant' }>`
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 22px;
  font-family: 'Roboto', sans-serif;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.$sender === 'user' 
    ? `
      background: #0272C3;
      color: white;
      border-bottom-right-radius: 4px;
    ` 
    : `
      background: #F3F7FF;
      color: #000000;
      border-bottom-left-radius: 4px;
      border: 1px solid #E6F3FF;
    `
  }
  
  &.message-bubble {
    /* Class for targeting hover state */
  }
`;

const Timestamp = styled.div<{ $sender: 'user' | 'assistant' }>`
  font-size: 12px;
  color: #8F99B8;
  margin-top: 4px;
  ${props => props.$sender === 'user' ? 'text-align: right;' : 'text-align: left;'}
`;

export interface MessageBubbleProps {
  /** Message content */
  content: string;
  /** Message sender */
  sender: 'user' | 'assistant';
  /** Message timestamp */
  timestamp?: Date;
  /** Whether message is favorited */
  isFavorited?: boolean;
  /** Callback when copy is clicked */
  onCopy?: () => void;
  /** Callback when favorite is toggled */
  onToggleFavorite?: () => void;
  /** Whether to show action buttons */
  showActions?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  timestamp,
  isFavorited = false,
  onCopy,
  onToggleFavorite,
  showActions = true,
}) => {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    onCopy?.();
  };

  return (
    <BubbleContainer $sender={sender}>
      <Bubble $sender={sender} className="message-bubble">
        {content}
        {showActions && sender === 'assistant' && (
          <MessageActions
            isFavorited={isFavorited}
            onCopy={handleCopy}
            onToggleFavorite={onToggleFavorite}
          />
        )}
      </Bubble>
      {timestamp && (
        <Timestamp $sender={sender}>
          {formatTimestamp(timestamp)}
        </Timestamp>
      )}
    </BubbleContainer>
  );
};

export default MessageBubble;