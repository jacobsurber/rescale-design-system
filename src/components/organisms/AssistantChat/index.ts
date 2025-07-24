// Export original component for backwards compatibility
export { AssistantChat as AssistantChatLegacy } from './AssistantChat';
export type { AssistantChatProps as AssistantChatLegacyProps, ChatMessage } from './AssistantChat';

// Export compound component
export { AssistantChat, ChatHeader, ChatMessage as ChatMessageComponent, ChatInput, ChatAvatar, EmptyState, MessageBubble, MessageActions } from './AssistantChat.compound';
export type { AssistantChatProps, ChatMessageData, UserProfile, ContextOption } from './AssistantChat.compound';

// Export pixel-perfect Figma implementation as primary
export { AssistantChatFigmaExact } from './AssistantChat.figma-exact';
export type { AssistantChatFigmaProps } from './AssistantChat.figma-exact';
export { default } from './AssistantChat.figma-exact';

// Export all compound components
export * from './components';