import React from 'react';
import { Avatar } from 'antd';
import styled from 'styled-components';

const RescaleAvatar = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: #0272C3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.size * 0.4}px;
  flex-shrink: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M21.9978 3.21177V15.2307C21.9978 15.5939 21.7042 15.8889 21.34 15.8889H0.657848C0.293573 15.8889 0 15.5939 0 15.2307V0.658204C0 0.295029 0.293573 0 0.657848 0H18.8988L21.9978 3.09831V3.18919L22.0087 3.20041L21.9978 3.21177ZM0.608934 2.44579V15.2307C0.608934 15.2591 0.630663 15.276 0.657848 15.276H21.34C21.3671 15.276 21.3889 15.2591 21.3889 15.2307V3.82468L21.378 3.83604L19.9862 2.44579H0.608934Z' fill='white'/%3E%3C/svg%3E") center/contain no-repeat;
  }
`;

const UserAvatar = styled(Avatar)<{ $color?: string }>`
  background-color: ${props => props.$color || '#00B8A6'};
  color: white;
  font-weight: 500;
  flex-shrink: 0;
`;

export interface ChatAvatarProps {
  /** Avatar type - user or assistant */
  type: 'user' | 'assistant';
  /** Avatar size in pixels */
  size?: number;
  /** User initials (for user avatars) */
  initials?: string;
  /** User avatar color (for user avatars) */
  color?: string;
  /** Custom avatar image URL */
  src?: string;
}

export const ChatAvatar: React.FC<ChatAvatarProps> = ({
  type,
  size = 32,
  initials = 'U',
  color = '#00B8A6',
  src,
}) => {
  if (type === 'assistant') {
    return <RescaleAvatar size={size} />;
  }

  return (
    <UserAvatar
      size={size}
      src={src}
      $color={color}
    >
      {!src && initials}
    </UserAvatar>
  );
};

export default ChatAvatar;