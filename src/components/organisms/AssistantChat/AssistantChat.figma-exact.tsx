import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FloatButton, Drawer, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styled from 'styled-components';

// Figma asset imports
const imgRescaleLogo = "http://localhost:3845/assets/ceda77b0b89b5c551c796ec39cdc7b61c9baaee8.svg";
const imgCopyIcon = "http://localhost:3845/assets/b41e9f6a40120eb8e64bf82c28a34f995d37468f.svg";
const imgStarIcon = "http://localhost:3845/assets/c4f7b4916d468e7281ff7b05d34e60f7dec35003.svg";
const imgSendIcon = "http://localhost:3845/assets/54d41918622e34977cba2069a087268414037748.svg";
const imgCloseIcon = "http://localhost:3845/assets/21e4ff0d1d116447ff0cf3c298c1005466a1180d.svg";
const imgBackgroundPattern = "http://localhost:3845/assets/1a4666e35b601825eb17488092293fbf7ea3924b.svg";

// Exact Figma design tokens
const FigmaColors = {
  primary5: '#33AAFF',
  primary7: '#0272C3',
  neutral1: '#FFFFFF',
  goldenPurple5: '#8F99B8',
  goldenPurple7: '#606D95',
  characterTitle: 'rgba(0, 0, 0, 0.85)',
  characterDisabled: 'rgba(0, 0, 0, 0.25)',
  userAvatarColor: '#00B8A6',
  messageBorder: '#e9f0ff',
  inputBorder: '#0077cc',
  assistantBorder: '#3399bb',
};

const FigmaTypography = {
  body: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '22px',
    fontVariationSettings: "'wdth' 100",
  },
  userInitials: {
    fontFamily: 'Figtree',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  placeholder: {
    fontFamily: 'Figtree',
    fontSize: '14px',
    fontWeight: 300,
    fontStyle: 'italic',
  },
  contextLabel: {
    fontFamily: 'Figtree',
    fontSize: '10px',
    fontWeight: 400,
  },
  assistantLabel: {
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: 400,
    fontVariationSettings: "'wdth' 100",
  },
};

// Styled components with exact Figma measurements
const ChatDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 380px !important;
    max-width: calc(100vw - 32px);
    background: ${FigmaColors.neutral1};
    border-radius: 6px 0 0 6px;
    box-shadow: 0px 2px 11px 9px rgba(65, 84, 140, 0.4);
    border: 0px 0px 1px solid #a5b2d3;
  }
  
  .ant-drawer-header {
    padding: 0;
    border-bottom: none;
    background: ${FigmaColors.neutral1};
  }
  
  .ant-drawer-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 32px);
    background: ${FigmaColors.neutral1};
    position: relative;
    overflow: hidden;
    border-radius: 6px 0 0 6px;
  }
  
  .ant-drawer-close {
    display: none;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  height: 259px;
  width: 1156px;
  top: 250px;
  left: calc(50% + 20px);
  transform: translateX(-50%);
  opacity: 0.1;
  overflow: hidden;
  background-image: url(${imgBackgroundPattern});
  background-size: cover;
  background-position: center;
  pointer-events: none;
`;

const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  overflow-y: auto;
  margin-bottom: 36px;
  
  /* Custom scrollbar matching Figma */
  &::-webkit-scrollbar {
    width: 5px;
    background: ${FigmaColors.neutral1};
    border: 1px solid #bdcbeb;
    border-radius: 11px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${FigmaColors.neutral1};
    border: 1px solid #bdcbeb;
    border-radius: 11px;
  }
`;

const UserMessage = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.messageBorder};
  border-radius: 3px;
  padding: 16px 12px 12px 12px;
  box-shadow: 0px 1px 2px 0px rgba(0, 45, 86, 0.25);
`;

const AssistantMessage = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.messageBorder};
  border-radius: 3px;
  padding: 12px;
  box-shadow: 0px 1px 2px 0px rgba(0, 45, 86, 0.25);
  position: relative;
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 39px;
  background: ${FigmaColors.userAvatarColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  span {
    font-family: ${FigmaTypography.userInitials.fontFamily};
    font-size: ${FigmaTypography.userInitials.fontSize};
    font-weight: ${FigmaTypography.userInitials.fontWeight};
    line-height: ${FigmaTypography.userInitials.lineHeight};
    color: ${FigmaColors.neutral1};
  }
`;

const AssistantAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 39px;
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.assistantBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 13px;
    height: 13px;
  }
`;

const MessageContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageText = styled.div`
  font-family: ${FigmaTypography.body.fontFamily};
  font-size: ${FigmaTypography.body.fontSize};
  font-weight: ${FigmaTypography.body.fontWeight};
  line-height: ${FigmaTypography.body.lineHeight};
  font-variation-settings: ${FigmaTypography.body.fontVariationSettings};
  color: ${FigmaColors.characterTitle};
`;

const MessageActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${AssistantMessage}:hover & {
    opacity: 1;
  }
  
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 14px;
    height: 16px;
    
    img {
      width: 100%;
      height: 100%;
    }
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
`;

const InputWrapper = styled.div`
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.inputBorder};
  border-radius: 3px;
  box-shadow: 0px 1px 4px 0px rgba(0, 45, 86, 0.25);
  padding: 12px;
  display: flex;
  align-items: center;
  
  input {
    border: none;
    outline: none;
    background: transparent;
    flex: 1;
    font-family: ${FigmaTypography.placeholder.fontFamily};
    font-size: ${FigmaTypography.placeholder.fontSize};
    font-weight: ${FigmaTypography.placeholder.fontWeight};
    font-style: ${FigmaTypography.placeholder.fontStyle};
    color: ${FigmaColors.goldenPurple5};
    
    &::placeholder {
      color: ${FigmaColors.goldenPurple5};
    }
  }
`;

const InputControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ContextSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ContextLabel = styled.span`
  font-family: ${FigmaTypography.contextLabel.fontFamily};
  font-size: ${FigmaTypography.contextLabel.fontSize};
  font-weight: ${FigmaTypography.contextLabel.fontWeight};
  color: ${FigmaColors.goldenPurple7};
`;

const ContextDropdown = styled.select`
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.inputBorder};
  border-radius: 3px;
  box-shadow: 0px 1px 4px 0px rgba(0, 45, 86, 0.25);
  padding: 1px 8px;
  font-family: ${FigmaTypography.body.fontFamily};
  font-size: ${FigmaTypography.body.fontSize};
  font-weight: ${FigmaTypography.body.fontWeight};
  font-variation-settings: ${FigmaTypography.body.fontVariationSettings};
  color: ${FigmaColors.characterTitle};
  min-width: 60px;
`;

const SendButton = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 32px;
  background: ${FigmaColors.primary7};
  border: 0px 0px 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 1px 4px 0px rgba(0, 45, 86, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  img {
    width: 24px;
    height: 22px;
  }
`;

const ChatHeader = styled.div`
  position: absolute;
  top: -16px;
  left: calc(50% + 0.5px);
  transform: translateX(-50%);
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.inputBorder};
  border-radius: 30px;
  box-shadow: 0px 1px 4px 1px rgba(66, 94, 147, 0.3);
  padding: 7px 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  z-index: 10;
`;

const AssistantLogo = styled.div`
  width: 35px;
  height: 20px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const AssistantLabel = styled.span`
  font-family: ${FigmaTypography.assistantLabel.fontFamily};
  font-size: ${FigmaTypography.assistantLabel.fontSize};
  font-weight: ${FigmaTypography.assistantLabel.fontWeight};
  font-variation-settings: ${FigmaTypography.assistantLabel.fontVariationSettings};
  color: ${FigmaColors.primary7};
  line-height: normal;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -16px;
  left: -16px;
  background: ${FigmaColors.neutral1};
  border: 1px solid ${FigmaColors.primary7};
  border-radius: 100px;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.043);
  padding: 5px 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  img {
    width: 14px;
    height: 14px;
  }
`;

// Data interfaces
export interface ChatMessageData {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isFavorited?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  initials?: string;
  avatarColor?: string;
}

export interface AssistantChatFigmaProps {
  defaultOpen?: boolean;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  messages?: ChatMessageData[];
  isTyping?: boolean;
  userProfile?: UserProfile;
  assistantName?: string;
  contextOptions?: Array<{ value: string; label: string }>;
  selectedContext?: string;
  showUnreadBadge?: boolean;
  unreadCount?: number;
  onSendMessage?: (message: string, context: string) => void;
  onToggle?: (open: boolean) => void;
  onCopyMessage?: (messageId: string, content: string) => void;
  onToggleFavorite?: (messageId: string, isFavorited: boolean) => void;
}

export const AssistantChatFigmaExact: React.FC<AssistantChatFigmaProps> = ({
  defaultOpen = false,
  position = 'bottomRight',
  messages = [],
  isTyping = false,
  userProfile,
  assistantName = 'Assistant',
  contextOptions = [
    { value: 'jobs', label: 'Jobs' },
    { value: 'workflows', label: 'Workflows' },
    { value: 'general', label: 'General' },
  ],
  selectedContext = 'jobs',
  showUnreadBadge = true,
  unreadCount = 0,
  onSendMessage,
  onToggle,
  onCopyMessage,
  onToggleFavorite,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [currentContext, setCurrentContext] = useState(selectedContext);
  const [inputValue, setInputValue] = useState('');
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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue.trim(), currentContext);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    onCopyMessage?.(messageId, content);
  };

  const handleToggleFavorite = (messageId: string, isFavorited: boolean) => {
    onToggleFavorite?.(messageId, !isFavorited);
  };

  const floatButton = (
    <Badge count={showUnreadBadge ? unreadCount : 0} size="small">
      <FloatButton
        icon={<MessageOutlined />}
        onClick={handleToggle}
        style={{ width: 56, height: 56 }}
      />
    </Badge>
  );

  return (
    <>
      {floatButton}
      
      <ChatDrawer
        title={null}
        placement={position.includes('Right') ? 'right' : 'left'}
        open={open}
        onClose={handleToggle}
        closable={false}
        mask={false}
        style={{ position: 'absolute' }}
      >
        <BackgroundPattern />
        
        <ChatHeader>
          <AssistantLogo>
            <img src={imgRescaleLogo} alt="Rescale" />
          </AssistantLogo>
          <AssistantLabel>{assistantName}</AssistantLabel>
        </ChatHeader>
        
        <CloseButton onClick={handleToggle}>
          <img src={imgCloseIcon} alt="Close" />
        </CloseButton>
        
        <MessagesContainer>
          {messages.map((message) => (
            message.sender === 'user' ? (
              <UserMessage key={message.id}>
                <UserAvatar>
                  <span>{userProfile?.initials || userProfile?.name?.substring(0, 2) || 'JD'}</span>
                </UserAvatar>
                <MessageContent>
                  <MessageText>{message.content}</MessageText>
                </MessageContent>
              </UserMessage>
            ) : (
              <AssistantMessage key={message.id}>
                <AssistantAvatar>
                  <img src={imgRescaleLogo} alt="Assistant" />
                </AssistantAvatar>
                <MessageContent>
                  <MessageText>{message.content}</MessageText>
                </MessageContent>
                <MessageActions>
                  <button onClick={() => handleCopy(message.id, message.content)}>
                    <img src={imgCopyIcon} alt="Copy" />
                  </button>
                  <button onClick={() => handleToggleFavorite(message.id, message.isFavorited || false)}>
                    <img src={imgStarIcon} alt="Favorite" />
                  </button>
                </MessageActions>
              </AssistantMessage>
            )
          ))}
          
          {isTyping && (
            <AssistantMessage>
              <AssistantAvatar>
                <img src={imgRescaleLogo} alt="Assistant" />
              </AssistantAvatar>
              <MessageContent>
                <MessageText style={{ fontStyle: 'italic', color: FigmaColors.goldenPurple5 }}>
                  {assistantName} is typing...
                </MessageText>
              </MessageContent>
            </AssistantMessage>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <ChatInputContainer>
          <InputWrapper>
            <input
              type="text"
              placeholder="Ask Rescale Assistant..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </InputWrapper>
          
          <InputControls>
            <ContextSelector>
              <ContextLabel>Context</ContextLabel>
              <ContextDropdown
                value={currentContext}
                onChange={(e) => setCurrentContext(e.target.value)}
              >
                {contextOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </ContextDropdown>
            </ContextSelector>
            
            <div style={{ flex: 1 }} />
            
            <SendButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <img src={imgSendIcon} alt="Send" />
            </SendButton>
          </InputControls>
        </ChatInputContainer>
      </ChatDrawer>
    </>
  );
};

export default AssistantChatFigmaExact;