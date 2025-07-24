// Export original component for backwards compatibility
export { AssistantChat as AssistantChatLegacy } from './AssistantChat';
export type { AssistantChatProps as AssistantChatLegacyProps, ChatMessage } from './AssistantChat';

// Export new compound component as default
export { AssistantChat, ChatHeader, ChatMessage as ChatMessageComponent, ChatInput, ChatAvatar, EmptyState, MessageBubble, MessageActions } from './AssistantChat.compound';
export type { AssistantChatProps, ChatMessageData, UserProfile, ContextOption } from './AssistantChat.compound';
export { default } from './AssistantChat.compound';

// Export all compound components
export * from './components';