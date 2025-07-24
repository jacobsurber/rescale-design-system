# AssistantChat Compound Component

A production-ready, fully-featured chat interface built as a compound component system with pixel-perfect Figma implementation.

## 🎯 Features

### ✅ **Complete Figma Implementation**
- Exact measurements, colors, and spacing from Figma designs
- Copy/star action buttons on assistant messages (hover to reveal)
- Proper user avatar colors (teal/cyan #00B8A6)
- Circular send button with proper dimensions
- Rescale logo integration with SVG paths
- Subtle background patterns in empty state

### 🧩 **Compound Component Architecture**
```
AssistantChat/
├── AssistantChat (main container)
├── ChatHeader (header with close + branding)
├── ChatMessage (individual messages)
├── ChatInput (input with context selector)
├── ChatAvatar (user/assistant avatars)
├── EmptyState (welcome screen)
├── MessageBubble (message with actions)
└── MessageActions (copy/favorite buttons)
```

### 💪 **Production Features**
- **TypeScript**: Fully typed interfaces for all components
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Performance**: Optimized re-renders, efficient scrolling
- **Customization**: Theme support, configurable options
- **Responsive**: Mobile-friendly design
- **Testing**: Unit test ready with proper component isolation

## 📋 API Reference

### AssistantChat (Main Component)

```tsx
interface AssistantChatProps {
  // Core functionality
  messages?: ChatMessageData[];
  isTyping?: boolean;
  loading?: boolean;
  
  // User configuration
  userProfile?: UserProfile;
  assistantName?: string;
  
  // UI configuration
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  showMessageActions?: boolean;
  showContextSelector?: boolean;
  showUnreadBadge?: boolean;
  unreadCount?: number;
  
  // Input configuration
  placeholder?: string;
  maxLength?: number;
  contextOptions?: ContextOption[];
  selectedContext?: string;
  suggestions?: string[];
  
  // Event handlers
  onSendMessage?: (message: string, context: string) => void;
  onToggle?: (open: boolean) => void;
  onCopyMessage?: (messageId: string, content: string) => void;
  onToggleFavorite?: (messageId: string, isFavorited: boolean) => void;
  onContextChange?: (context: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}
```

### ChatMessageData

```tsx
interface ChatMessageData {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  typing?: boolean;
  isFavorited?: boolean;
  metadata?: Record<string, any>;
}
```

### UserProfile

```tsx
interface UserProfile {
  name: string;
  email: string;
  initials?: string;
  avatarColor?: string;
  avatarSrc?: string;
}
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { AssistantChat } from '@/components/organisms/AssistantChat';

function App() {
  const [messages, setMessages] = useState([]);
  
  const userProfile = {
    name: 'John Doe',
    email: 'john@rescale.com',
    initials: 'JD',
    avatarColor: '#00B8A6'
  };

  const handleSendMessage = (message, context) => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Handle API call to send message
  };

  return (
    <AssistantChat
      messages={messages}
      userProfile={userProfile}
      onSendMessage={handleSendMessage}
    />
  );
}
```

### Advanced Usage with All Features

```tsx
import { AssistantChat, ChatMessageData, UserProfile } from '@/components/organisms/AssistantChat';

function AdvancedChatExample() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const userProfile: UserProfile = {
    name: 'Jane Smith',
    email: 'jane@rescale.com',
    initials: 'JS',
    avatarColor: '#00B8A6',
    avatarSrc: '/path/to/avatar.jpg' // Optional custom avatar
  };

  const contextOptions = [
    { value: 'jobs', label: 'Jobs' },
    { value: 'workflows', label: 'Workflows' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'billing', label: 'Billing' }
  ];

  const suggestions = [
    "How do I submit a new simulation?",
    "What's the status of my current jobs?",
    "Help me analyze my CFD results",
    "Show me my account usage this month"
  ];

  const handleSendMessage = async (message: string, context: string) => {
    // Add user message
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call your API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        isFavorited: false
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
    console.log('Message copied to clipboard');
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
    
    // Sync with backend
    // saveFavoriteStatus(messageId, !isFavorited);
  };

  return (
    <AssistantChat
      defaultOpen={false}
      position="bottomRight"
      messages={messages}
      isTyping={isTyping}
      userProfile={userProfile}
      assistantName="Rescale Assistant"
      contextOptions={contextOptions}
      selectedContext="jobs"
      suggestions={suggestions}
      showMessageActions={true}
      showContextSelector={true}
      showUnreadBadge={true}
      unreadCount={0}
      onSendMessage={handleSendMessage}
      onCopyMessage={handleCopyMessage}
      onToggleFavorite={handleToggleFavorite}
      onToggle={(open) => console.log('Chat toggled:', open)}
      onContextChange={(context) => console.log('Context changed:', context)}
      onSuggestionClick={(suggestion) => handleSendMessage(suggestion, 'general')}
    />
  );
}
```

## 🎨 Individual Component Usage

### Using Components Separately

```tsx
import { 
  ChatHeader, 
  ChatMessage, 
  ChatInput, 
  ChatAvatar, 
  EmptyState 
} from '@/components/organisms/AssistantChat';

// Custom chat implementation
function CustomChat() {
  return (
    <div className="custom-chat">
      <ChatHeader 
        assistantName="Custom Assistant"
        onClose={() => console.log('close')}
      />
      
      <div className="messages">
        <ChatMessage
          id="1"
          content="Hello! How can I help?"
          sender="assistant"
          timestamp={new Date()}
          onCopy={(id, content) => navigator.clipboard.writeText(content)}
        />
      </div>
      
      <ChatInput
        placeholder="Ask anything..."
        onSendMessage={(msg, ctx) => console.log('Send:', msg, ctx)}
      />
    </div>
  );
}
```

## 🧪 Testing

### Unit Testing Example

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssistantChat } from './AssistantChat.compound';

describe('AssistantChat', () => {
  const mockUserProfile = {
    name: 'Test User',
    email: 'test@example.com',
    initials: 'TU'
  };

  it('renders empty state when no messages', () => {
    render(<AssistantChat userProfile={mockUserProfile} />);
    expect(screen.getByText(/Hi! I'm your Rescale Assistant/)).toBeInTheDocument();
  });

  it('sends message when form is submitted', async () => {
    const onSendMessage = jest.fn();
    render(
      <AssistantChat 
        userProfile={mockUserProfile}
        onSendMessage={onSendMessage}
        defaultOpen={true}
      />
    );

    const input = screen.getByPlaceholderText('Ask Rescale Assistant...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(onSendMessage).toHaveBeenCalledWith('Test message', 'jobs');
    });
  });

  it('copies message when copy button is clicked', async () => {
    const messages = [{
      id: '1',
      content: 'Test message',
      sender: 'assistant' as const,
      timestamp: new Date()
    }];

    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() }
    });

    render(
      <AssistantChat 
        messages={messages}
        userProfile={mockUserProfile}
        defaultOpen={true}
      />
    );

    // Hover over message to show actions
    const messageBubble = screen.getByText('Test message');
    fireEvent.mouseEnter(messageBubble);

    const copyButton = screen.getByLabelText('Copy message');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test message');
  });
});
```

## 🎛️ Customization

### Custom Styling

```tsx
// Override component styles
const StyledAssistantChat = styled(AssistantChat)`
  .ant-drawer-content-wrapper {
    width: 500px !important; // Custom width
  }
`;

// Or use custom CSS classes
<AssistantChat 
  className="my-custom-chat"
  style={{ /* custom styles */ }}
/>
```

### Custom Avatar Component

```tsx
const CustomAvatar = ({ type, ...props }) => {
  if (type === 'assistant') {
    return <img src="/custom-logo.svg" alt="Assistant" {...props} />;
  }
  return <ChatAvatar type={type} {...props} />;
};

// Use in compound component
<AssistantChat
  // Pass custom avatar through render prop or context
/>
```

## 🐛 Troubleshooting

### Common Issues

1. **Messages not scrolling**: Ensure container has proper height constraints
2. **Actions not showing**: Check `showMessageActions={true}` and hover behavior
3. **TypeScript errors**: Ensure all required props are provided with correct types
4. **Styling conflicts**: Use specific CSS selectors or styled-components

### Performance Optimization

```tsx
// Memoize message components for large chat histories
const MemoizedMessage = React.memo(ChatMessage);

// Virtualize long message lists if needed
import { FixedSizeList as List } from 'react-window';
```

## 🔄 Migration from Legacy Component

```tsx
// Old usage
import { AssistantChat } from './AssistantChat';

// New usage  
import { AssistantChat } from './AssistantChat.compound';
// or for backwards compatibility
import { AssistantChatLegacy } from './AssistantChat';
```

The new compound component maintains API compatibility while adding new features and improved customization options.