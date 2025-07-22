import type { Meta, StoryObj } from '@storybook/react';
import { AssistantChat, ChatMessage } from './AssistantChat';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';

/**
 * The AssistantChat component provides a floating chat interface for user interaction
 * with an AI assistant, featuring message history, typing indicators, and responsive design.
 */
const meta: Meta<typeof AssistantChat> = {
  title: 'Components/Rescale/Assistant Chat',
  component: AssistantChat,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The AssistantChat component creates a floating chat interface that provides users with
access to AI-powered assistance within Rescale applications.

## Features
- **Floating Interface**: Unobtrusive floating button that expands to full chat
- **Message History**: Persistent conversation history with timestamps
- **Typing Indicators**: Real-time typing feedback from the assistant
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Unread Badges**: Visual notification for new messages
- **Rich Messaging**: Support for text messages with metadata
- **Customizable Avatars**: Custom assistant and user avatars
- **Positioning Options**: Multiple positioning options for the float button

## Use Cases
- **Job Assistance**: Help with job setup, troubleshooting, and optimization
- **Platform Guidance**: Navigation and feature explanations
- **Technical Support**: Real-time help with platform issues
- **Documentation**: Interactive access to platform documentation

The component is designed to be integrated into any Rescale application page
to provide contextual assistance to users.
        `,
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether chat is initially open',
    },
    position: {
      control: 'select',
      options: ['bottomRight', 'bottomLeft', 'topRight', 'topLeft'],
      description: 'Position of the floating chat button',
    },
    messages: {
      description: 'Array of chat messages',
    },
    isTyping: {
      control: 'boolean',
      description: 'Whether assistant is currently typing',
    },
    loading: {
      control: 'boolean',
      description: 'Whether chat is in loading state',
    },
    assistantName: {
      control: 'text',
      description: 'Display name for the assistant',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for message input',
    },
    maxLength: {
      control: { type: 'number', min: 100, max: 5000 },
      description: 'Maximum message length',
    },
    showUnreadBadge: {
      control: 'boolean',
      description: 'Whether to show unread message badge',
    },
    unreadCount: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Number of unread messages',
    },
    onSendMessage: {
      action: 'messageSent',
      description: 'Callback when user sends a message',
    },
    onToggle: {
      action: 'chatToggled',
      description: 'Callback when chat is opened/closed',
    },
    onClear: {
      action: 'chatCleared',
      description: 'Callback when chat history is cleared',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample chat messages
const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you with your simulation today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    id: '2',
    content: 'I\'m having trouble setting up my CFD job. The mesh generation keeps failing.',
    sender: 'user',
    timestamp: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
  },
  {
    id: '3',
    content: 'I can help you troubleshoot the mesh generation issue. Let me ask a few questions:\n\n1. What mesh generator are you using?\n2. What\'s the approximate geometry complexity?\n3. Are you seeing any specific error messages?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
  },
  {
    id: '4',
    content: 'I\'m using the built-in mesh generator with a fairly complex geometry - it\'s an automotive exhaust system. The error mentions "Poor quality elements detected".',
    sender: 'user',
    timestamp: new Date(Date.now() - 7 * 60 * 1000), // 7 minutes ago
  },
  {
    id: '5',
    content: 'Ah, that\'s a common issue with complex automotive geometries. Here are some recommendations:\n\n• Increase the minimum element size in mesh settings\n• Enable advanced mesh smoothing\n• Consider using hybrid mesh (tetra + prism layers)\n• Simplify small features that don\'t affect flow\n\nWould you like me to guide you through these settings?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
];

/**
 * Default assistant chat with conversation history.
 */
export const Default: Story = {
  args: {
    defaultOpen: false,
    position: 'bottomRight',
    messages: sampleMessages,
    isTyping: false,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'Ask me anything about your simulations...',
    maxLength: 1000,
    showUnreadBadge: true,
    unreadCount: 0,
  },
};

/**
 * Chat opened by default.
 */
export const OpenByDefault: Story = {
  args: {
    defaultOpen: true,
    position: 'bottomRight',
    messages: sampleMessages.slice(0, 3),
    isTyping: false,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'Type your message...',
    maxLength: 1000,
    showUnreadBadge: false,
    unreadCount: 0,
  },
};

/**
 * Empty chat (first interaction).
 */
export const EmptyChat: Story = {
  args: {
    defaultOpen: true,
    position: 'bottomRight',
    messages: [],
    isTyping: false,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'Ask me anything about your simulations...',
    maxLength: 1000,
    showUnreadBadge: false,
    unreadCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Initial chat state with no messages, showing the welcome screen.',
      },
    },
  },
};

/**
 * Assistant is typing.
 */
export const AssistantTyping: Story = {
  args: {
    defaultOpen: true,
    position: 'bottomRight',
    messages: [
      sampleMessages[0],
      sampleMessages[1],
    ],
    isTyping: true,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'Type your message...',
    maxLength: 1000,
    showUnreadBadge: false,
    unreadCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat showing the typing indicator when assistant is responding.',
      },
    },
  },
};

/**
 * Chat in loading state.
 */
export const Loading: Story = {
  args: {
    defaultOpen: true,
    position: 'bottomRight',
    messages: sampleMessages.slice(0, 2),
    isTyping: false,
    loading: true,
    assistantName: 'Rescale Assistant',
    placeholder: 'Processing...',
    maxLength: 1000,
    showUnreadBadge: false,
    unreadCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat in loading state with disabled input.',
      },
    },
  },
};

/**
 * Chat with unread messages badge.
 */
export const WithUnreadBadge: Story = {
  args: {
    defaultOpen: false,
    position: 'bottomRight',
    messages: sampleMessages,
    isTyping: false,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'Ask me anything...',
    maxLength: 1000,
    showUnreadBadge: true,
    unreadCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat button showing unread message count badge.',
      },
    },
  },
};

/**
 * Chat positioned at bottom left.
 */
export const BottomLeft: Story = {
  args: {
    defaultOpen: false,
    position: 'bottomLeft',
    messages: sampleMessages.slice(0, 3),
    isTyping: false,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'How can I help?',
    maxLength: 1000,
    showUnreadBadge: true,
    unreadCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat positioned at the bottom left corner.',
      },
    },
  },
};

/**
 * Chat with custom assistant name and avatar.
 */
export const CustomAssistant: Story = {
  args: {
    defaultOpen: true,
    position: 'bottomRight',
    messages: [
      {
        id: '1',
        content: 'Hi! I\'m your CFD specialist. I can help you with fluid dynamics simulations, mesh generation, and result analysis.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: '2',
        content: 'That\'s great! I need help optimizing my turbulence model settings.',
        sender: 'user',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
      },
    ],
    isTyping: false,
    loading: false,
    assistantName: 'CFD Expert',
    assistantAvatar: <RobotOutlined style={{ color: '#1890ff' }} />,
    userAvatar: <UserOutlined style={{ color: '#52c41a' }} />,
    placeholder: 'Ask about CFD simulations...',
    maxLength: 2000,
    showUnreadBadge: false,
    unreadCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat with custom assistant name and colored avatars.',
      },
    },
  },
};

/**
 * Long conversation example.
 */
export const LongConversation: Story = {
  args: {
    defaultOpen: true,
    position: 'bottomRight',
    messages: [
      ...sampleMessages,
      {
        id: '6',
        content: 'Yes, please! I\'d really appreciate the guidance.',
        sender: 'user',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
      },
      {
        id: '7',
        content: 'Perfect! Let\'s start with the mesh settings. Go to the Mesh tab in your job configuration...',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
      },
      {
        id: '8',
        content: 'I\'m there. I can see the current settings.',
        sender: 'user',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: '9',
        content: 'Great! Now look for "Element Size Control" and increase the minimum element size to about 2mm for your exhaust system.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
      },
    ],
    isTyping: false,
    loading: false,
    assistantName: 'Rescale Assistant',
    placeholder: 'Continue the conversation...',
    maxLength: 1000,
    showUnreadBadge: false,
    unreadCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Extended conversation demonstrating scrolling and message flow.',
      },
    },
  },
};

/**
 * Different position options.
 */
export const AllPositions: Story = {
  render: () => (
    <div style={{ position: 'relative', height: '400px', border: '1px dashed #d9d9d9' }}>
      <p style={{ textAlign: 'center', margin: '20px 0' }}>
        Chat buttons in different positions (this is just for demonstration)
      </p>
      
      <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
        <AssistantChat
          defaultOpen={false}
          position="bottomRight"
          messages={[]}
          assistantName="Bottom Right"
          showUnreadBadge={true}
          unreadCount={2}
        />
      </div>
      
      <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
        <AssistantChat
          defaultOpen={false}
          position="bottomLeft"
          messages={[]}
          assistantName="Bottom Left"
          showUnreadBadge={true}
          unreadCount={1}
        />
      </div>
      
      <div style={{ position: 'absolute', top: '60px', right: '16px' }}>
        <AssistantChat
          defaultOpen={false}
          position="topRight"
          messages={[]}
          assistantName="Top Right"
          showUnreadBadge={false}
          unreadCount={0}
        />
      </div>
      
      <div style={{ position: 'absolute', top: '60px', left: '16px' }}>
        <AssistantChat
          defaultOpen={false}
          position="topLeft"
          messages={[]}
          assistantName="Top Left"
          showUnreadBadge={true}
          unreadCount={5}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of all available position options for the floating chat button.',
      },
    },
  },
};