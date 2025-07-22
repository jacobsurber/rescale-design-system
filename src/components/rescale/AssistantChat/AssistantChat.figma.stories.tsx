import type { Meta, StoryObj } from '@storybook/react';
import { FigmaAssistantChat } from './AssistantChat.figma';
import { AssistantChat } from './AssistantChat';
import type { ChatMessage } from './AssistantChat';

/**
 * Figma-styled Assistant Chat component extracted from specific Figma frame
 * Frame: R&DCloud-ProFolStu-Project (17279:269520)
 * URL: https://www.figma.com/design/B0H99zI9iTyU7vusGYP3rk/Rescale-Data-AI?node-id=17279-269520
 */
const meta: Meta<typeof FigmaAssistantChat> = {
  title: 'Components/Rescale/Assistant Chat (Figma Styled)',
  component: FigmaAssistantChat,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Figma-Extracted Assistant Chat Component

This version of the Assistant Chat component uses styles extracted directly from the Figma frame:
- **Frame**: R&DCloud-ProFolStu-Project (17279:269520)
- **URL**: https://www.figma.com/design/B0H99zI9iTyU7vusGYP3rk/Rescale-Data-AI?node-id=17279-269520

### Key Figma Styling Applied:
- ✅ **Container Background**: White (#ffffff) from Figma
- ✅ **Enhanced Shadows**: Deeper shadows for better depth
- ✅ **Refined Border Radius**: 12px rounded corners
- ✅ **Message Bubbles**: Custom border radius for natural conversation flow
- ✅ **Float Button**: Figma-specified dimensions (56x56px) with branded shadow
- ✅ **Color Consistency**: Rescale blue (#0066CC) throughout interface
- ✅ **Professional Layout**: Figma-specified spacing and proportions

### Extraction Process:
1. Target specific frame: \`node scripts/figma-frame-extractor.js TOKEN 17279:269520\`
2. Generate TypeScript styles: \`src/theme/figma-styles/assistantchat.ts\`
3. Apply to React component with styled-components
4. Maintain full functionality while achieving pixel-perfect design match

This demonstrates how individual Figma frames can be precisely translated to React components.
        `,
      },
    },
  },
  argTypes: {
    assistantName: {
      control: 'text',
      description: 'Name of the AI assistant',
    },
    placeholder: {
      control: 'text', 
      description: 'Input placeholder text',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether chat starts open',
    },
    showUnreadBadge: {
      control: 'boolean',
      description: 'Show unread message count',
    },
    unreadCount: {
      control: 'number',
      description: 'Number of unread messages',
    },
    isTyping: {
      control: 'boolean',
      description: 'Show typing indicator',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state in input',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample messages for testing
const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! I need help with my simulation job.',
    sender: 'user',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2', 
    content: 'Hi there! I\'d be happy to help you with your simulation. Can you tell me what specific issue you\'re experiencing?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    content: 'The job seems to be stuck in "Queued" status for over an hour. Is this normal?',
    sender: 'user',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '4',
    content: 'That does seem longer than usual. Let me check the status of the compute resources. Can you share the job ID?',
    sender: 'assistant', 
    timestamp: new Date(Date.now() - 120000),
  },
];

/**
 * Default Figma-styled Assistant Chat with enhanced visuals
 */
export const FigmaStyled: Story = {
  args: {
    messages: sampleMessages,
    assistantName: 'Rescale Assistant',
    placeholder: 'Ask me anything about your simulations...',
    defaultOpen: false,
    showUnreadBadge: true,
    unreadCount: 2,
    isTyping: false,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Assistant Chat with styles extracted from Figma frame 17279:269520. Features enhanced shadows, refined spacing, and professional color scheme.',
      },
    },
  },
};

/**
 * Comparison between original and Figma-styled versions
 */
export const StyleComparison: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '40px',
      padding: '20px',
      minHeight: '400px'
    }}>
      <div>
        <h3 style={{ 
          color: '#666', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          📝 Original Version
        </h3>
        <div style={{ 
          border: '2px solid #E5E7EB', 
          borderRadius: '8px', 
          padding: '16px',
          background: '#F9FAFB',
          position: 'relative',
          minHeight: '200px'
        }}>
          <AssistantChat
            messages={sampleMessages.slice(0, 2)}
            defaultOpen={true}
            assistantName="Original Assistant"
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '16px',
            fontSize: '12px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            Default Ant Design styling
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ 
          color: '#0066CC', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          🎨 Figma-Styled Version
        </h3>
        <div style={{ 
          border: '2px solid #0066CC', 
          borderRadius: '8px', 
          padding: '16px',
          background: '#F6F9FF',
          position: 'relative',
          minHeight: '200px'
        }}>
          <FigmaAssistantChat
            messages={sampleMessages.slice(0, 2)}
            defaultOpen={true}
            assistantName="Figma Assistant"
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '16px',
            fontSize: '12px',
            color: '#0066CC',
            fontStyle: 'italic'
          }}>
            Frame 17279:269520 styling
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison showing the visual improvements achieved by applying Figma-extracted styles to the Assistant Chat component.',
      },
    },
  },
};

/**
 * Empty state with Figma styling
 */
export const FigmaEmptyState: Story = {
  args: {
    messages: [],
    assistantName: 'Rescale Assistant',
    placeholder: 'Ask me anything...',
    defaultOpen: true,
    showUnreadBadge: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state of the Figma-styled Assistant Chat, showcasing the refined welcome message and enhanced visual hierarchy.',
      },
    },
  },
};

/**
 * Typing indicator with Figma styling
 */
export const FigmaTyping: Story = {
  args: {
    messages: [sampleMessages[0]],
    assistantName: 'Rescale Assistant',
    defaultOpen: true,
    isTyping: true,
    showUnreadBadge: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Figma-styled Assistant Chat with typing indicator, showing the enhanced message bubble styling and animations.',
      },
    },
  },
};

/**
 * Float button styling showcase
 */
export const FigmaFloatButton: Story = {
  args: {
    messages: [],
    assistantName: 'Rescale Assistant', 
    defaultOpen: false,
    showUnreadBadge: true,
    unreadCount: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Figma-styled floating button with enhanced shadow, exact dimensions (56x56px), and branded color scheme. Includes unread message badge.',
      },
    },
  },
};

/**
 * Full conversation showcase
 */
export const FigmaFullConversation: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: '5',
        content: 'The job ID is RSC-2024-001234',
        sender: 'user',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: '6', 
        content: 'Perfect! I can see that job is running on our GPU cluster. The queue time was due to high demand, but it should complete within the next 30 minutes. I\'ll send you a notification when it finishes.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: '7',
        content: 'Thank you so much for the help! That explains everything.',
        sender: 'user',
        timestamp: new Date(Date.now() - 10000),
      },
    ],
    assistantName: 'Rescale Assistant',
    defaultOpen: true,
    showUnreadBadge: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete conversation showcasing the Figma-styled message bubbles, spacing, and overall chat experience with realistic simulation support dialog.',
      },
    },
  },
};