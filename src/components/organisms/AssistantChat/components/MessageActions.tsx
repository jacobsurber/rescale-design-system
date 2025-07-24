import React from 'react';
import { Button, Tooltip } from 'antd';
import { CopyOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import styled from 'styled-components';

const ActionsContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  .message-bubble:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(Button)`
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    background: #FFFFFF;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .anticon {
    font-size: 12px;
    color: #0272C3;
  }
`;

export interface MessageActionsProps {
  /** Whether the message is favorited */
  isFavorited?: boolean;
  /** Callback when copy is clicked */
  onCopy?: () => void;
  /** Callback when favorite is toggled */
  onToggleFavorite?: () => void;
  /** Whether to show the actions */
  visible?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  isFavorited = false,
  onCopy,
  onToggleFavorite,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <ActionsContainer>
      <Tooltip title="Copy message" placement="left">
        <ActionButton
          size="small"
          icon={<CopyOutlined />}
          onClick={onCopy}
        />
      </Tooltip>
      <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"} placement="left">
        <ActionButton
          size="small"
          icon={isFavorited ? <StarFilled /> : <StarOutlined />}
          onClick={onToggleFavorite}
        />
      </Tooltip>
    </ActionsContainer>
  );
};

export default MessageActions;