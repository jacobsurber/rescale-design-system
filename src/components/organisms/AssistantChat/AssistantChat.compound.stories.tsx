import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AssistantChat, ChatMessageData, UserProfile } from './AssistantChat.compound';
import { ChatHeader, ChatMessage, ChatInput, ChatAvatar, EmptyState, MessageBubble, MessageActions } from './components';

const meta: Meta<typeof AssistantChat> = {
  title: 'Organisms/AssistantChat (Compound)',
  component: AssistantChat,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# AssistantChat Compound Component

A fully-featured, production-ready chat component built as a compound component system.

## Features:

### 🎯 **Complete Figma Implementation**
- Exact measurements and colors from Figma designs
- Copy/star action buttons on assistant messages
- Proper user avatar colors (teal/cyan)
- Circular send button
- Rescale logo integration

### 🧩 **Compound Component Architecture**
- \`AssistantChat\` - Main container component
- \`ChatHeader\` - Header with close button and branding
- \`ChatMessage\` - Individual message component
- \`ChatInput\` - Input field with context selector
- \`ChatAvatar\` - User and assistant avatars
- \`EmptyState\` - Welcome screen with suggestions
- \`MessageBubble\` - Message bubble with actions
- \`MessageActions\` - Copy and favorite buttons

### 💪 **Production Features**
- TypeScript interfaces for all props
- Accessibility support (ARIA labels, keyboard navigation)
- Custom scrollbar styling
- Message favoriting and copying
- Context-aware messaging
- Typing indicators
- Suggestion prompts
- Unread message badges

### 🎨 **Customization Options**
- Custom user profiles and avatars
- Configurable context options
- Custom suggestions
- Theme customization
- Position configuration

## Usage:

\`\`\`tsx
import { AssistantChat } from '@/components/organisms/AssistantChat';

const userProfile = {
  name: 'John Doe',
  email: 'john@rescale.com',
  initials: 'JD',
  avatarColor: '#00B8A6'
};

const messages = [
  {
    id: '1',
    content: 'Can you help me analyze my results?',
    sender: 'user',
    timestamp: new Date()
  },
  {
    id: '2', 
    content: 'I\\'d be happy to help you analyze your simulation results. Could you provide more details about the specific analysis you need?',
    sender: 'assistant',
    timestamp: new Date()
  }
];

<AssistantChat
  messages={messages}
  userProfile={userProfile}
  onSendMessage={(message, context) => {
    console.log('New message:', message, 'Context:', context);
  }}
  onCopyMessage={(id, content) => {
    navigator.clipboard.writeText(content);
  }}
  onToggleFavorite={(id, isFavorited) => {
    console.log('Toggle favorite:', id, isFavorited);
  }}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['bottomRight', 'bottomLeft', 'topRight', 'topLeft'],
      description: 'Position of the chat float button and drawer',
    },
    assistantName: {
      control: 'text',
      description: 'Name displayed in the assistant badge',
    },
    isTyping: {
      control: 'boolean',
      description: 'Whether to show typing indicator',
    },
    showContextSelector: {
      control: 'boolean',
      description: 'Whether to show the context dropdown',
    },
    showMessageActions: {
      control: 'boolean', 
      description: 'Whether to show copy/favorite buttons on messages',
    },
    unreadCount: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Number of unread messages to show in badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AssistantChat>;

// Sample data
const sampleMessages: ChatMessageData[] = [
  {
    id: '1',
    content: 'Can you help me analyze my results?',
    sender: 'user',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: '2',
    content: 'I\'d be happy to help you analyze your simulation results. Could you provide more details about the specific analysis you need?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    isFavorited: false,
  },
  {
    id: '3',
    content: 'I need to understand the stress distribution in my mechanical simulation',
    sender: 'user', 
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
  },
  {
    id: '4',
    content: 'For stress distribution analysis, you can use the post-processing tools in the Results tab. Look for the "Stress" visualization options and select "Von Mises Stress" for a comprehensive view.',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    isFavorited: true,
  },
];

const defaultUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'jdoe@rescale.com',
  initials: 'JD',
  avatarColor: '#00B8A6',
};

const contextOptions = [
  { value: 'jobs', label: 'Jobs' },
  { value: 'workflows', label: 'Workflows' },
  { value: 'postprocessing', label: 'Post-processing' },
  { value: 'general', label: 'General' },
];

const suggestions = [
  "How do I submit a new job?",
  "Check the status of my running jobs", 
  "Help me troubleshoot a failed job",
  "Show me my account usage",
  "How do I analyze simulation results?",
  "What file formats are supported?"
];

// Stories
export const Default: Story = {
  args: {
    messages: sampleMessages,
    userProfile: defaultUserProfile,
    assistantName: 'Assistant',
    contextOptions,
    suggestions,
    showMessageActions: true,
    showContextSelector: true,
    unreadCount: 0,
  },
};

export const EmptyChat: Story = {
  args: {
    messages: [],
    userProfile: defaultUserProfile,
    assistantName: 'Rescale Assistant',
    suggestions,
    showMessageActions: true,
  },
};

export const WithTyping: Story = {
  args: {
    ...Default.args,
    isTyping: true,
  },
};

export const WithUnreadBadge: Story = {
  args: {
    ...Default.args,
    unreadCount: 3,
    showUnreadBadge: true,
  },
};

export const CustomPosition: Story = {
  args: {
    ...Default.args,
    position: 'bottomLeft',
  },
};

export const NoContextSelector: Story = {
  args: {
    ...Default.args,
    showContextSelector: false,
  },
};

export const NoMessageActions: Story = {
  args: {
    ...Default.args,
    showMessageActions: false,
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    userProfile: defaultUserProfile,
    assistantName: 'Rescale Assistant',
    contextOptions,
    suggestions,
    showMessageActions: true,
  },
  render: (args) => {
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const handleSendMessage = (message: string, context: string) => {
      const newMessage: ChatMessageData = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate assistant response
      setIsTyping(true);
      setTimeout(() => {
        const assistantMessage: ChatMessageData = {
          id: (Date.now() + 1).toString(),
          content: `I understand you're asking about "${message}" in the ${context} context. Let me help you with that.`,
          sender: 'assistant',
          timestamp: new Date(),
          isFavorited: false,
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 2000);
    };

    const handleCopyMessage = (messageId: string, content: string) => {
      navigator.clipboard.writeText(content);
      console.log('Copied message:', messageId, content);
    };

    const handleToggleFavorite = (messageId: string, isFavorited: boolean) => {
      const newFavorites = new Set(favorites);
      if (isFavorited) {
        newFavorites.delete(messageId);
      } else {
        newFavorites.add(messageId);
      }
      setFavorites(newFavorites);
      
      // Update message in state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isFavorited: !isFavorited }
          : msg
      ));
    };

    const messagesWithFavorites = messages.map(msg => ({
      ...msg,
      isFavorited: favorites.has(msg.id) || msg.isFavorited,
    }));

    return (
      <div style={{ height: '100vh', background: '#f5f5f5', position: 'relative' }}>
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <h2>Interactive AssistantChat Demo</h2>
          <p>Click the chat button to start a conversation. Try:</p>
          <ul>
            <li>Sending messages</li>
            <li>Using suggested prompts</li>
            <li>Copying assistant messages</li>
            <li>Favoriting messages</li>
            <li>Changing context</li>
          </ul>
          <p><strong>Messages sent:</strong> {messages.length}</p>
        </div>
        
        <AssistantChat
          {...args}
          messages={messagesWithFavorites}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          onCopyMessage={handleCopyMessage}
          onToggleFavorite={handleToggleFavorite}
          onSuggestionClick={handleSendMessage}
        />
      </div>
    );
  },
};

// Individual component stories
export const ComponentShowcase: Story = {
  render: () => (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h3>ChatHeader</h3>
        <ChatHeader assistantName="Rescale Assistant" onClose={() => console.log('Close clicked')} />
      </div>
      
      <div>
        <h3>ChatAvatar</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <ChatAvatar type="user" initials="JD" color="#00B8A6" />
          <ChatAvatar type="assistant" size={40} />
        </div>
      </div>
      
      <div>
        <h3>MessageBubble</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <MessageBubble
            content="This is a user message"
            sender="user"
            timestamp={new Date()}
          />
          <MessageBubble
            content="This is an assistant message with action buttons. Hover to see them!"
            sender="assistant"
            timestamp={new Date()}
            showActions={true}
          />
        </div>
      </div>
      
      <div>
        <h3>ChatInput</h3>
        <div style={{ maxWidth: '400px', border: '1px solid #f0f0f0' }}>
          <ChatInput
            onSendMessage={(message, context) => console.log('Message:', message, 'Context:', context)}
            onContextChange={(context) => console.log('Context changed:', context)}
          />
        </div>
      </div>
      
      <div>
        <h3>EmptyState</h3>
        <div style={{ height: '400px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
          <EmptyState
            onSuggestionClick={(suggestion) => console.log('Suggestion clicked:', suggestion)}
          />
        </div>
      </div>
    </div>
  ),
};