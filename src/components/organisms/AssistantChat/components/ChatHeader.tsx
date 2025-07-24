import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  padding: 16px 20px;
  background: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: 1px solid #0272C3;
  background: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0272C3;
  font-size: 16px;
  font-weight: 400;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F3F7FF;
    border-color: #025AA3;
    color: #025AA3;
  }
`;

const AssistantBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
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
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 8px;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M21.9978 3.21177V15.2307C21.9978 15.5939 21.7042 15.8889 21.34 15.8889H0.657848C0.293573 15.8889 0 15.5939 0 15.2307V0.658204C0 0.295029 0.293573 0 0.657848 0H18.8988L21.9978 3.09831V3.18919L22.0087 3.20041L21.9978 3.21177ZM0.608934 2.44579V15.2307C0.608934 15.2591 0.630663 15.276 0.657848 15.276H21.34C21.3671 15.276 21.3889 15.2591 21.3889 15.2307V3.82468L21.378 3.83604L19.9862 2.44579H0.608934Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
    }
  }
`;

export interface ChatHeaderProps {
  /** Assistant name to display */
  assistantName?: string;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Custom logo element */
  logo?: React.ReactNode;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  assistantName = 'Assistant',
  showCloseButton = true,
  onClose,
  logo,
}) => {
  return (
    <HeaderContainer>
      {showCloseButton && (
        <CloseButton onClick={onClose} aria-label="Close chat">
          ✕
        </CloseButton>
      )}
      <AssistantBadge>
        {logo || <div className="logo-icon"></div>}
        {assistantName}
      </AssistantBadge>
    </HeaderContainer>
  );
};

export default ChatHeader;