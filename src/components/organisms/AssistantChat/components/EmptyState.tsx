import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { ChatAvatar } from './ChatAvatar';

const { Text } = Typography;

const EmptyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
  position: relative;
  
  /* Subtle background pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 49%, rgba(2, 114, 195, 0.02) 50%, transparent 51%),
                linear-gradient(-45deg, transparent 49%, rgba(2, 114, 195, 0.02) 50%, transparent 51%);
    background-size: 20px 20px;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const WelcomeTitle = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  font-family: 'Roboto', sans-serif;
`;

const WelcomeDescription = styled(Text)`
  font-size: 14px;
  color: #8F99B8;
  font-family: 'Roboto', sans-serif;
  line-height: 22px;
  max-width: 280px;
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
  max-width: 300px;
`;

const SuggestionButton = styled.button`
  padding: 12px 16px;
  background: #F3F7FF;
  border: 1px solid #E6F3FF;
  border-radius: 8px;
  font-size: 14px;
  color: #0272C3;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: 'Roboto', sans-serif;
  
  &:hover {
    background: #E6F3FF;
    border-color: #B3DCFF;
  }
`;

export interface EmptyStateProps {
  /** Welcome title */
  title?: string;
  /** Welcome description */
  description?: string;
  /** Suggested prompts */
  suggestions?: string[];
  /** Callback when suggestion is clicked */
  onSuggestionClick?: (suggestion: string) => void;
  /** Custom avatar size */
  avatarSize?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Hi! I'm your Rescale Assistant",
  description = "I can help you with job management, troubleshooting, and platform questions. What would you like to know?",
  suggestions = [
    "How do I submit a new job?",
    "Check the status of my running jobs",
    "Help me troubleshoot a failed job",
    "Show me my account usage"
  ],
  onSuggestionClick,
  avatarSize = 48,
}) => {
  return (
    <EmptyContainer>
      <WelcomeContent>
        <ChatAvatar type="assistant" size={avatarSize} />
        <div>
          <WelcomeTitle>{title}</WelcomeTitle>
          <div style={{ marginTop: '8px' }}>
            <WelcomeDescription>{description}</WelcomeDescription>
          </div>
        </div>
        {suggestions.length > 0 && (
          <SuggestionsContainer>
            {suggestions.map((suggestion, index) => (
              <SuggestionButton
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion}
              </SuggestionButton>
            ))}
          </SuggestionsContainer>
        )}
      </WelcomeContent>
    </EmptyContainer>
  );
};

export default EmptyState;