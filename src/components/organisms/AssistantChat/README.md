# AssistantChat Component

A fully-featured AI assistant chat interface component with real-time messaging, typing indicators, and customizable styling.

## Usage

```tsx
import { AssistantChat } from 'rescale-design-system';

const messages = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'assistant',
    timestamp: new Date()
  },
  {
    id: '2',
    content: 'I need help with running a simulation',
    sender: 'user',
    timestamp: new Date()
  }
];

<AssistantChat
  title="Rescale Assistant"
  messages={messages}
  onSendMessage={(message) => handleSendMessage(message)}
  placeholder="Ask me anything..."
  loading={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string` | `'Assistant'` | Chat window title |
| subtitle | `string` | - | Optional subtitle |
| messages | `ChatMessage[]` | `[]` | Array of chat messages |
| onSendMessage | `(message: string) => void` | - | **Required.** Message send handler |
| placeholder | `string` | `'Type a message...'` | Input placeholder text |
| loading | `boolean` | `false` | Shows typing indicator |
| maxHeight | `string \| number` | `'500px'` | Maximum height of chat window |
| theme | `'light' \| 'dark'` | `'light'` | Visual theme |
| showAvatar | `boolean` | `true` | Show user/assistant avatars |
| allowAttachments | `boolean` | `false` | Enable file attachments |
| onAttachment | `(file: File) => void` | - | File attachment handler |
| quickActions | `QuickAction[]` | - | Quick action buttons |
| disabled | `boolean` | `false` | Disable message input |
| autoScroll | `boolean` | `true` | Auto-scroll to latest message |

## Types

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
  attachments?: Attachment[];
  metadata?: Record<string, any>;
}
```

### QuickAction

```typescript
interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}
```

## Examples

### Basic Chat

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [loading, setLoading] = useState(false);

const handleSendMessage = async (content: string) => {
  // Add user message
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, userMessage]);
  setLoading(true);
  
  // Simulate API call
  const response = await fetchAssistantResponse(content);
  
  // Add assistant response
  const assistantMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    content: response,
    sender: 'assistant',
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, assistantMessage]);
  setLoading(false);
};

<AssistantChat
  messages={messages}
  onSendMessage={handleSendMessage}
  loading={loading}
/>
```

### With Quick Actions

```tsx
const quickActions = [
  {
    id: 'help',
    label: 'Get Help',
    icon: <QuestionCircleOutlined />,
    onClick: () => handleSendMessage('I need help')
  },
  {
    id: 'status',
    label: 'Check Status',
    icon: <InfoCircleOutlined />,
    onClick: () => handleSendMessage('What is my job status?')
  }
];

<AssistantChat
  messages={messages}
  onSendMessage={handleSendMessage}
  quickActions={quickActions}
/>
```

### With File Attachments

```tsx
const handleAttachment = async (file: File) => {
  // Upload file
  const url = await uploadFile(file);
  
  // Send message with attachment
  handleSendMessage(`I've attached ${file.name}`);
};

<AssistantChat
  messages={messages}
  onSendMessage={handleSendMessage}
  allowAttachments
  onAttachment={handleAttachment}
/>
```

### Dark Theme

```tsx
<AssistantChat
  messages={messages}
  onSendMessage={handleSendMessage}
  theme="dark"
  maxHeight="600px"
/>
```

### System Messages

```tsx
const messages = [
  {
    id: '1',
    content: 'Chat session started',
    sender: 'system',
    timestamp: new Date()
  },
  {
    id: '2',
    content: 'Hello! How can I help?',
    sender: 'assistant',
    timestamp: new Date()
  }
];
```

## Styling

The component uses CSS-in-JS with styled-components and supports theming:

```tsx
// Custom styling
const StyledAssistantChat = styled(AssistantChat)`
  .message-user {
    background-color: ${props => props.theme.colors.primary[50]};
  }
  
  .message-assistant {
    background-color: ${props => props.theme.colors.neutral[100]};
  }
`;
```

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader announcements for new messages
- High contrast mode support
- Focus management

## Best Practices

1. **Message Management**: Keep message history reasonable (< 1000 messages)
2. **Loading States**: Always show loading indicator during API calls
3. **Error Handling**: Display failed message states clearly
4. **Timestamps**: Use relative timestamps for recent messages
5. **Auto-scroll**: Disable when user scrolls up to read history

## Integration Example

```tsx
import { AssistantChat, useWebSocket } from 'rescale-design-system';

function LiveAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendMessage, isConnected } = useWebSocket('wss://api.example.com/chat');
  
  useEffect(() => {
    // Listen for incoming messages
    const handler = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
  
  return (
    <AssistantChat
      title="Live Assistant"
      subtitle={isConnected ? 'Online' : 'Offline'}
      messages={messages}
      onSendMessage={sendMessage}
      disabled={!isConnected}
    />
  );
}
```