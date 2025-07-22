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
import type { ChatMessage, AssistantChatProps } from './AssistantChat';

const { TextArea } = Input;
const { Text } = Typography;

// 🎨 CUSTOMIZABLE STYLES - Edit these to match your Figma design exactly
const CUSTOM_STYLES = {
  // Float button (chat trigger)
  floatButton: {
    width: '56px',
    height: '56px',
    backgroundColor: '#FF6B35', // 🔧 Change this color
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
    // Add more properties as needed
  },
  
  // Chat drawer/container
  drawer: {
    width: '380px',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    // 🔧 Customize container appearance
  },
  
  // Header section
  header: {
    backgroundColor: '#F8F9FA', // 🔧 Change header background
    padding: '16px 20px',
    borderBottom: '1px solid #E9ECEF',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  
  // Message area
  messageArea: {
    backgroundColor: '#FFFFFF',
    padding: '16px',
    minHeight: '300px',
    maxHeight: '400px',
  },
  
  // Input area
  inputArea: {
    backgroundColor: '#F8F9FA', // 🔧 Change input area background
    padding: '12px 16px',
    borderTop: '1px solid #E9ECEF',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  
  // Message bubbles
  userMessage: {
    backgroundColor: '#007AFF', // 🔧 User message color
    color: '#FFFFFF',
    padding: '8px 12px',
    borderRadius: '16px 16px 4px 16px',
    fontSize: '14px',
    maxWidth: '70%',
  },
  
  assistantMessage: {
    backgroundColor: '#F1F3F4', // 🔧 Assistant message color
    color: '#1D1D1F',
    padding: '8px 12px',
    borderRadius: '16px 16px 16px 4px',
    fontSize: '14px',
    maxWidth: '70%',
  },
  
  // Send button
  sendButton: {
    backgroundColor: '#007AFF', // 🔧 Send button color
    borderColor: '#007AFF',
    width: '36px',
    height: '36px',
    borderRadius: '18px',
  }
};

/**
 * Customizable Chat Components - Edit styles above to match Figma
 */
const CustomFloatButton = styled(FloatButton)`
  width: ${CUSTOM_STYLES.floatButton.width} !important;
  height: ${CUSTOM_STYLES.floatButton.height} !important;
  background: ${CUSTOM_STYLES.floatButton.backgroundColor} !important;
  box-shadow: ${CUSTOM_STYLES.floatButton.boxShadow} !important;
  
  &:hover {
    background: ${CUSTOM_STYLES.floatButton.backgroundColor} !important;
    transform: translateY(-2px);
  }
`;

const CustomDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: ${CUSTOM_STYLES.drawer.width} !important;
    max-width: calc(100vw - 32px);
    border-radius: ${CUSTOM_STYLES.drawer.borderRadius} !important;
    box-shadow: ${CUSTOM_STYLES.drawer.boxShadow} !important;
    background: ${CUSTOM_STYLES.drawer.backgroundColor} !important;
    overflow: hidden;
  }
  
  .ant-drawer-body {
    padding: 0;
    background: ${CUSTOM_STYLES.drawer.backgroundColor};
  }
`;

const CustomHeader = styled.div`
  background: ${CUSTOM_STYLES.header.backgroundColor};
  padding: ${CUSTOM_STYLES.header.padding};
  border-bottom: ${CUSTOM_STYLES.header.borderBottom};
  border-top-left-radius: ${CUSTOM_STYLES.header.borderTopLeftRadius};
  border-top-right-radius: ${CUSTOM_STYLES.header.borderTopRightRadius};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CustomMessageArea = styled.div`
  background: ${CUSTOM_STYLES.messageArea.backgroundColor};
  padding: ${CUSTOM_STYLES.messageArea.padding};
  min-height: ${CUSTOM_STYLES.messageArea.minHeight};
  max-height: ${CUSTOM_STYLES.messageArea.maxHeight};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CustomInputArea = styled.div`
  background: ${CUSTOM_STYLES.inputArea.backgroundColor};
  padding: ${CUSTOM_STYLES.inputArea.padding};
  border-top: ${CUSTOM_STYLES.inputArea.borderTop};
  border-bottom-left-radius: ${CUSTOM_STYLES.inputArea.borderBottomLeftRadius};
  border-bottom-right-radius: ${CUSTOM_STYLES.inputArea.borderBottomRightRadius};
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const CustomUserMessage = styled.div`
  background: ${CUSTOM_STYLES.userMessage.backgroundColor};
  color: ${CUSTOM_STYLES.userMessage.color};
  padding: ${CUSTOM_STYLES.userMessage.padding};
  border-radius: ${CUSTOM_STYLES.userMessage.borderRadius};
  font-size: ${CUSTOM_STYLES.userMessage.fontSize};
  max-width: ${CUSTOM_STYLES.userMessage.maxWidth};
  margin-left: auto;
  word-wrap: break-word;
`;

const CustomAssistantMessage = styled.div`
  background: ${CUSTOM_STYLES.assistantMessage.backgroundColor};
  color: ${CUSTOM_STYLES.assistantMessage.color};
  padding: ${CUSTOM_STYLES.assistantMessage.padding};
  border-radius: ${CUSTOM_STYLES.assistantMessage.borderRadius};
  font-size: ${CUSTOM_STYLES.assistantMessage.fontSize};
  max-width: ${CUSTOM_STYLES.assistantMessage.maxWidth};
  margin-right: auto;
  word-wrap: break-word;
`;

const CustomSendButton = styled(Button)`
  background: ${CUSTOM_STYLES.sendButton.backgroundColor} !important;
  border-color: ${CUSTOM_STYLES.sendButton.borderColor} !important;
  width: ${CUSTOM_STYLES.sendButton.width};
  height: ${CUSTOM_STYLES.sendButton.height};
  border-radius: ${CUSTOM_STYLES.sendButton.borderRadius};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${CUSTOM_STYLES.sendButton.backgroundColor} !important;
    border-color: ${CUSTOM_STYLES.sendButton.borderColor} !important;
    opacity: 0.9;
  }
`;

const MessageGroup = styled.div<{ $sender: 'user' | 'assistant' }>`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  ${props => props.$sender === 'user' && 'flex-direction: row-reverse;'}
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

/**
 * Custom Assistant Chat with Editable Styling
 * 
 * 🎨 To customize appearance:
 * 1. Edit the CUSTOM_STYLES object above
 * 2. Change colors, spacing, borders, etc.
 * 3. Save the file to see changes in Storybook
 */
export const CustomAssistantChat: React.FC<AssistantChatProps> = (props) => {
  const {
    defaultOpen = false,
    messages = [],
    isTyping = false,
    loading = false,
    assistantName = 'Rescale Assistant',
    assistantAvatar = <RobotOutlined />,
    userAvatar = <UserOutlined />,
    placeholder = 'Ask me anything...',
    maxLength = 1000,
    showUnreadBadge = true,
    unreadCount = 0,
    onSendMessage,
    onToggle,
    onClear,
  } = props;

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

  const renderMessage = (message: ChatMessage) => (
    <MessageGroup key={message.id} $sender={message.sender}>
      <Avatar
        size={28}
        icon={message.sender === 'user' ? userAvatar : assistantAvatar}
      />
      <MessageContainer>
        {message.sender === 'user' ? (
          <CustomUserMessage>{message.content}</CustomUserMessage>
        ) : (
          <CustomAssistantMessage>{message.content}</CustomAssistantMessage>
        )}
      </MessageContainer>
    </MessageGroup>
  );

  return (
    <>
      <Badge count={showUnreadBadge ? unreadCount : 0} size="small">
        <CustomFloatButton
          icon={<MessageOutlined style={{ color: 'white' }} />}
          onClick={handleToggle}
        />
      </Badge>
      
      <CustomDrawer
        title={null}
        placement="right"
        open={open}
        onClose={handleToggle}
        closable={false}
        mask={false}
      >
        <CustomHeader>
          <Avatar size={32} icon={assistantAvatar} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>{assistantName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              🎨 Custom Styled • Editable Design
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={onClear}
              size="small"
            />
          )}
        </CustomHeader>

        <CustomMessageArea>
          {messages.length === 0 && !isTyping ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '200px',
              color: '#666',
              textAlign: 'center' 
            }}>
              <RobotOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <Text strong>Hi! I'm your assistant</Text>
              <Text type="secondary" style={{ marginTop: '4px' }}>
                This design is fully customizable by editing CUSTOM_STYLES
              </Text>
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              {isTyping && (
                <MessageGroup $sender="assistant">
                  <Avatar size={28} icon={assistantAvatar} />
                  <MessageContainer>
                    <CustomAssistantMessage>
                      <Spin size="small" /> Typing...
                    </CustomAssistantMessage>
                  </MessageContainer>
                </MessageGroup>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </CustomMessageArea>

        <CustomInputArea>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            maxLength={maxLength}
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ 
              flex: 1,
              border: '1px solid #D1D5DB',
              borderRadius: '18px',
              padding: '8px 12px',
            }}
            disabled={loading}
          />
          <CustomSendButton
            type="primary"
            icon={<SendOutlined style={{ color: 'white' }} />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            loading={loading}
          />
        </CustomInputArea>
      </CustomDrawer>
    </>
  );
};

export default CustomAssistantChat;