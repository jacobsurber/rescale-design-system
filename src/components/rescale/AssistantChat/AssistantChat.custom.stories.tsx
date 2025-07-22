import type { Meta, StoryObj } from '@storybook/react';
import { CustomAssistantChat } from './AssistantChat.custom';
import type { ChatMessage } from './AssistantChat';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';

/**
 * Custom Assistant Chat - Fully Editable Styling
 * 
 * 🎨 To customize the appearance to match your Figma design:
 * 1. Open AssistantChat.custom.tsx
 * 2. Edit the CUSTOM_STYLES object at the top
 * 3. Change colors, spacing, borders, shadows, etc.
 * 4. Save to see changes immediately in Storybook
 * 
 * This component provides easy-to-edit styling constants instead of
 * trying to extract complex styles from Figma API.
 */
const meta: Meta<typeof CustomAssistantChat> = {
  title: 'Components/Rescale/Assistant Chat/Custom Styled',
  component: CustomAssistantChat,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Fully Customizable Assistant Chat Component**

This version provides easy-to-edit styling constants that you can modify to match your exact Figma design.

### How to Customize:
1. **Open** \`AssistantChat.custom.tsx\`
2. **Edit** the \`CUSTOM_STYLES\` object
3. **Change** colors, spacing, borders, etc.
4. **Save** to see changes immediately

### Customizable Elements:
- Float button (size, color, shadow)
- Drawer container (width, background, shadow)  
- Header (background, padding, borders)
- Message area (background, padding, height)
- Input area (background, padding, borders)
- Message bubbles (colors, padding, border radius)
- Send button (color, size, shape)

This approach is much more reliable than trying to extract exact styles from Figma API.
        `
      }
    }
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the chat is open by default'
    },
    assistantName: {
      control: 'text',
      description: 'Name displayed for the assistant'
    },
    placeholder: {
      control: 'text', 
      description: 'Input placeholder text'
    },
    showUnreadBadge: {
      control: 'boolean',
      description: 'Show unread message badge'
    },
    unreadCount: {
      control: 'number',
      description: 'Number of unread messages'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you with your simulation today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2', 
    content: 'I need help optimizing my CFD simulation parameters.',
    sender: 'user',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: '3',
    content: 'I can definitely help with that! Let me analyze your current setup and suggest some optimizations. What type of flow are you simulating?',
    sender: 'assistant', 
    timestamp: new Date(),
  }
];

export const Default: Story = {
  args: {
    defaultOpen: true,
    assistantName: 'Rescale Assistant',
    placeholder: 'Ask me anything about simulations...',
    messages: sampleMessages,
    onSendMessage: (message: string) => {
      console.log('Send message:', message);
    },
    onToggle: (open: boolean) => {
      console.log('Toggle chat:', open);
    },
    onClear: () => {
      console.log('Clear messages');
    }
  }
};

export const EmptyState: Story = {
  args: {
    defaultOpen: true,
    assistantName: 'Design Assistant',
    placeholder: 'Start typing to begin...',
    messages: [],
    onSendMessage: (message: string) => {
      console.log('Send message:', message);
    }
  }
};

export const WithTyping: Story = {
  args: {
    defaultOpen: true,
    messages: sampleMessages,
    isTyping: true,
    assistantName: 'AI Assistant',
    onSendMessage: (message: string) => {
      console.log('Send message:', message);
    }
  }
};

export const WithUnreadBadge: Story = {
  args: {
    defaultOpen: false,
    messages: sampleMessages,
    showUnreadBadge: true,
    unreadCount: 3,
    assistantName: 'Support Bot',
    onSendMessage: (message: string) => {
      console.log('Send message:', message);
    }
  }
};

export const CustomStylingExample: Story = {
  args: {
    defaultOpen: true,
    assistantName: 'Style Demo',
    placeholder: 'This design is fully customizable!',
    messages: [
      {
        id: '1',
        content: '🎨 This chat component uses easily editable styles!',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: '2',
        content: 'How do I customize the colors and layout?',
        sender: 'user', 
        timestamp: new Date(),
      }
    ],
    onSendMessage: (message: string) => {
      console.log('Send message:', message);
    }
  },
  parameters: {
    docs: {
      description: {
        story: `
**Styling Instructions:**

To match your Figma design exactly, edit these properties in \`CUSTOM_STYLES\`:

\`\`\`typescript
const CUSTOM_STYLES = {
  floatButton: {
    backgroundColor: '#FF6B35', // 🔧 Your brand color
    width: '56px',              // 🔧 Button size
    boxShadow: '...',           // 🔧 Shadow effect
  },
  
  header: {
    backgroundColor: '#F8F9FA',  // 🔧 Header background
    padding: '16px 20px',       // 🔧 Header spacing
  },
  
  userMessage: {
    backgroundColor: '#007AFF',  // 🔧 User message color
    borderRadius: '16px 16px 4px 16px', // 🔧 Bubble shape
  },
  
  // ... and many more customizable properties
}
\`\`\`

This approach gives you pixel-perfect control over every visual aspect.
        `
      }
    }
  }
};