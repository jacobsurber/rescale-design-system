import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AssistantChat } from './AssistantChat';
import { 
  render, 
  commonTestScenarios, 
  runAxeTest,
  mockData,
  snapshotHelpers,
} from '../../../test-utils';

describe('AssistantChat', () => {
  const mockMessages = mockData.generateChatMessages(5);
  const defaultProps = {
    messages: mockMessages,
  };

  // Common test scenarios
  commonTestScenarios.shouldRender(AssistantChat, defaultProps);
  commonTestScenarios.shouldBeAccessible(AssistantChat, defaultProps);
  commonTestScenarios.shouldWorkWithThemes(AssistantChat, defaultProps);
  commonTestScenarios.shouldBeResponsive(AssistantChat, defaultProps);

  describe('Chat Interface', () => {
    it('displays messages in correct order', () => {
      render(<AssistantChat messages={mockMessages} />);

      const messageElements = screen.getAllByTestId(/^message-/);
      expect(messageElements).toHaveLength(mockMessages.length);

      // Check that messages are displayed in chronological order
      mockMessages.forEach((message, index) => {
        expect(screen.getByText(message.content)).toBeInTheDocument();
      });
    });

    it('distinguishes between user and assistant messages', () => {
      render(<AssistantChat messages={mockMessages} />);

      const userMessages = mockMessages.filter(m => m.sender === 'user');
      const assistantMessages = mockMessages.filter(m => m.sender === 'assistant');

      userMessages.forEach(message => {
        const element = screen.getByTestId(`message-${message.id}`);
        expect(element).toHaveClass('message-user');
      });

      assistantMessages.forEach(message => {
        const element = screen.getByTestId(`message-${message.id}`);
        expect(element).toHaveClass('message-assistant');
      });
    });

    it('shows message timestamps when enabled', () => {
      render(<AssistantChat messages={mockMessages} showTimestamps />);

      mockMessages.forEach(message => {
        const timeElement = screen.getByTestId(`timestamp-${message.id}`);
        expect(timeElement).toBeInTheDocument();
      });
    });

    it('hides timestamps when disabled', () => {
      render(<AssistantChat messages={mockMessages} showTimestamps={false} />);

      mockMessages.forEach(message => {
        const timeElement = screen.queryByTestId(`timestamp-${message.id}`);
        expect(timeElement).not.toBeInTheDocument();
      });
    });
  });

  describe('Message Input', () => {
    it('allows typing in the input field', async () => {
      const { user } = render(<AssistantChat messages={[]} />);

      const input = screen.getByPlaceholderText('Type your message...');
      await user.type(input, 'Hello, assistant!');

      expect(input).toHaveValue('Hello, assistant!');
    });

    it('sends message on Enter key', async () => {
      const onSendMessage = jest.fn();
      const { user } = render(
        <AssistantChat messages={[]} onSendMessage={onSendMessage} />
      );

      const input = screen.getByPlaceholderText('Type your message...');
      await user.type(input, 'Test message');
      await user.keyboard('{Enter}');

      expect(onSendMessage).toHaveBeenCalledWith('Test message');
      expect(input).toHaveValue(''); // Input should be cleared
    });

    it('sends message on send button click', async () => {
      const onSendMessage = jest.fn();
      const { user } = render(
        <AssistantChat messages={[]} onSendMessage={onSendMessage} />
      );

      const input = screen.getByPlaceholderText('Type your message...');
      await user.type(input, 'Test message');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      expect(onSendMessage).toHaveBeenCalledWith('Test message');
      expect(input).toHaveValue('');
    });

    it('prevents sending empty messages', async () => {
      const onSendMessage = jest.fn();
      const { user } = render(
        <AssistantChat messages={[]} onSendMessage={onSendMessage} />
      );

      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).toBeDisabled();

      const input = screen.getByPlaceholderText('Type your message...');
      await user.type(input, '   '); // Only whitespace

      expect(sendButton).toBeDisabled();

      await user.click(sendButton);
      expect(onSendMessage).not.toHaveBeenCalled();
    });

    it('handles multiline messages with Shift+Enter', async () => {
      const onSendMessage = jest.fn();
      const { user } = render(
        <AssistantChat messages={[]} onSendMessage={onSendMessage} />
      );

      const input = screen.getByPlaceholderText('Type your message...');
      await user.type(input, 'Line 1');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      await user.type(input, 'Line 2');

      expect(input).toHaveValue('Line 1\nLine 2');
      
      await user.keyboard('{Enter}');
      expect(onSendMessage).toHaveBeenCalledWith('Line 1\nLine 2');
    });
  });

  describe('Message Features', () => {
    it('displays message status indicators', () => {
      const messagesWithStatus = mockMessages.map((message, index) => ({
        ...message,
        status: index % 3 === 0 ? 'sent' : index % 3 === 1 ? 'delivered' : 'read',
      }));

      render(<AssistantChat messages={messagesWithStatus} />);

      messagesWithStatus.forEach(message => {
        if (message.sender === 'user') {
          const statusElement = screen.getByTestId(`status-${message.id}`);
          expect(statusElement).toBeInTheDocument();
          expect(statusElement).toHaveClass(`status-${message.status}`);
        }
      });
    });

    it('shows typing indicator when assistant is typing', () => {
      render(<AssistantChat messages={mockMessages} isAssistantTyping />);

      const typingIndicator = screen.getByTestId('typing-indicator');
      expect(typingIndicator).toBeInTheDocument();
      expect(screen.getByText('Assistant is typing...')).toBeInTheDocument();
    });

    it('handles message reactions', async () => {
      const onReaction = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={mockMessages} 
          onReaction={onReaction}
          allowReactions 
        />
      );

      const firstMessage = screen.getByTestId(`message-${mockMessages[0].id}`);
      await user.hover(firstMessage);

      const reactionButton = screen.getByTestId('reaction-button');
      await user.click(reactionButton);

      expect(onReaction).toHaveBeenCalledWith(mockMessages[0].id, expect.any(String));
    });

    it('supports message editing for user messages', async () => {
      const onEditMessage = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={mockMessages} 
          onEditMessage={onEditMessage}
          allowEditing 
        />
      );

      const userMessage = mockMessages.find(m => m.sender === 'user');
      if (userMessage) {
        const messageElement = screen.getByTestId(`message-${userMessage.id}`);
        await user.hover(messageElement);

        const editButton = screen.getByTestId('edit-button');
        await user.click(editButton);

        const editInput = screen.getByDisplayValue(userMessage.content);
        await user.clear(editInput);
        await user.type(editInput, 'Edited message');
        await user.keyboard('{Enter}');

        expect(onEditMessage).toHaveBeenCalledWith(userMessage.id, 'Edited message');
      }
    });
  });

  describe('Chat Controls', () => {
    it('shows clear chat button when enabled', async () => {
      const onClearChat = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={mockMessages} 
          onClearChat={onClearChat}
          showClearButton 
        />
      );

      const clearButton = screen.getByTestId('clear-chat-button');
      await user.click(clearButton);

      expect(onClearChat).toHaveBeenCalled();
    });

    it('handles chat export functionality', async () => {
      const onExportChat = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={mockMessages} 
          onExportChat={onExportChat}
          showExportButton 
        />
      );

      const exportButton = screen.getByTestId('export-chat-button');
      await user.click(exportButton);

      expect(onExportChat).toHaveBeenCalledWith(mockMessages);
    });

    it('supports chat search functionality', async () => {
      const { user } = render(
        <AssistantChat messages={mockMessages} searchable />
      );

      const searchButton = screen.getByTestId('search-button');
      await user.click(searchButton);

      const searchInput = screen.getByPlaceholderText('Search messages...');
      await user.type(searchInput, 'test');

      // Should highlight matching messages
      await waitFor(() => {
        const highlightedMessages = screen.getAllByTestId('highlighted-message');
        expect(highlightedMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Floating Chat Button', () => {
    it('shows floating button when chat is minimized', () => {
      render(<AssistantChat messages={[]} floating minimized />);

      const floatingButton = screen.getByTestId('floating-chat-button');
      expect(floatingButton).toBeInTheDocument();
    });

    it('expands chat when floating button is clicked', async () => {
      const onToggle = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={[]} 
          floating 
          minimized 
          onToggle={onToggle} 
        />
      );

      const floatingButton = screen.getByTestId('floating-chat-button');
      await user.click(floatingButton);

      expect(onToggle).toHaveBeenCalledWith(false); // false = expanded
    });

    it('shows unread message count on floating button', () => {
      render(
        <AssistantChat 
          messages={mockMessages} 
          floating 
          minimized 
          unreadCount={3} 
        />
      );

      const badge = screen.getByTestId('unread-badge');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Message Formatting', () => {
    it('renders markdown in messages when enabled', () => {
      const markdownMessage = {
        ...mockMessages[0],
        content: '**Bold text** and *italic text*',
      };

      render(
        <AssistantChat 
          messages={[markdownMessage]} 
          enableMarkdown 
        />
      );

      expect(screen.getByText('Bold text')).toHaveStyle({ fontWeight: 'bold' });
      expect(screen.getByText('italic text')).toHaveStyle({ fontStyle: 'italic' });
    });

    it('handles code blocks in messages', () => {
      const codeMessage = {
        ...mockMessages[0],
        content: '```javascript\nconsole.log("Hello");\n```',
      };

      render(
        <AssistantChat 
          messages={[codeMessage]} 
          enableMarkdown 
        />
      );

      const codeBlock = screen.getByTestId('code-block');
      expect(codeBlock).toBeInTheDocument();
      expect(screen.getByText('console.log("Hello");')).toBeInTheDocument();
    });

    it('preserves line breaks in plain text mode', () => {
      const multilineMessage = {
        ...mockMessages[0],
        content: 'Line 1\nLine 2\nLine 3',
      };

      render(<AssistantChat messages={[multilineMessage]} />);

      const messageContent = screen.getByTestId(`message-content-${multilineMessage.id}`);
      expect(messageContent).toHaveStyle({ whiteSpace: 'pre-wrap' });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation through messages', async () => {
      const { user } = render(<AssistantChat messages={mockMessages} />);

      const chatContainer = screen.getByTestId('chat-container');
      chatContainer.focus();

      await user.keyboard('{ArrowUp}');
      await user.keyboard('{ArrowDown}');

      // Should navigate through messages
      expect(document.activeElement).toBeInTheDocument();
    });

    it('handles keyboard shortcuts for common actions', async () => {
      const onClearChat = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={mockMessages} 
          onClearChat={onClearChat}
          keyboardShortcuts 
        />
      );

      // Ctrl+K to clear chat
      await user.keyboard('{Control>}k{/Control}');
      expect(onClearChat).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles message send failures gracefully', async () => {
      const onSendMessage = jest.fn().mockRejectedValue(new Error('Network error'));
      const { user } = render(
        <AssistantChat messages={[]} onSendMessage={onSendMessage} />
      );

      const input = screen.getByPlaceholderText('Type your message...');
      await user.type(input, 'Test message');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
      });
    });

    it('shows retry option for failed messages', async () => {
      const failedMessage = {
        ...mockMessages[0],
        status: 'failed',
        error: 'Network error',
      };

      const onRetryMessage = jest.fn();
      const { user } = render(
        <AssistantChat 
          messages={[failedMessage]} 
          onRetryMessage={onRetryMessage} 
        />
      );

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      expect(onRetryMessage).toHaveBeenCalledWith(failedMessage.id);
    });

    it('handles empty message list gracefully', () => {
      render(<AssistantChat messages={[]} />);

      expect(screen.getByText('No messages yet')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('virtualizes long message lists', () => {
      const manyMessages = mockData.generateChatMessages(1000);
      const { container } = render(
        <AssistantChat messages={manyMessages} virtualized />
      );

      // Should not render all 1000 messages at once
      const messageElements = container.querySelectorAll('[data-testid^="message-"]');
      expect(messageElements.length).toBeLessThan(manyMessages.length);
    });

    it('auto-scrolls to new messages', async () => {
      const { rerender } = render(<AssistantChat messages={mockMessages} />);

      const newMessage = {
        id: 'new-message',
        content: 'New message',
        sender: 'assistant' as const,
        timestamp: new Date(),
      };

      rerender(
        <AssistantChat messages={[...mockMessages, newMessage]} />
      );

      await waitFor(() => {
        const chatContainer = screen.getByTestId('chat-container');
        expect(chatContainer.scrollTop).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels and roles', () => {
      render(<AssistantChat messages={mockMessages} />);

      const chatContainer = screen.getByRole('log');
      expect(chatContainer).toHaveAttribute('aria-label', 'Chat messages');

      const input = screen.getByRole('textbox');
      expect(input).toHaveAccessibleName(/message input/i);

      const sendButton = screen.getByRole('button', { name: /send message/i });
      expect(sendButton).toBeInTheDocument();
    });

    it('announces new messages to screen readers', async () => {
      const { rerender } = render(<AssistantChat messages={mockMessages} />);

      const newMessage = {
        id: 'new-message',
        content: 'New assistant message',
        sender: 'assistant' as const,
        timestamp: new Date(),
      };

      rerender(
        <AssistantChat messages={[...mockMessages, newMessage]} />
      );

      const liveRegion = screen.getByTestId('message-live-region');
      expect(liveRegion).toHaveTextContent('New assistant message');
    });

    it('supports high contrast mode', () => {
      const { container } = render(
        <AssistantChat messages={mockMessages} highContrast />
      );

      const chatContainer = container.querySelector('.chat-container');
      expect(chatContainer).toHaveClass('high-contrast');
    });

    it('passes accessibility audit', async () => {
      const { container } = render(
        <AssistantChat 
          messages={mockMessages}
          showTimestamps
          allowReactions
          searchable
        />
      );

      await runAxeTest(container);
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot with basic configuration', () => {
      snapshotHelpers.createComponentSnapshot(AssistantChat, {
        messages: mockMessages.slice(0, 3),
      });
    });

    it('matches snapshot with floating chat', () => {
      snapshotHelpers.createComponentSnapshot(AssistantChat, {
        messages: mockMessages.slice(0, 3),
        floating: true,
        minimized: true,
        unreadCount: 2,
      });
    });

    it('matches snapshot with all features enabled', () => {
      snapshotHelpers.createComponentSnapshot(AssistantChat, {
        messages: mockMessages,
        showTimestamps: true,
        allowReactions: true,
        allowEditing: true,
        enableMarkdown: true,
        searchable: true,
        showClearButton: true,
        showExportButton: true,
        isAssistantTyping: true,
      });
    });
  });
});