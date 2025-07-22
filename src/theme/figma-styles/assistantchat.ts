/**
 * Figma-extracted styles for AssistantChat Component
 * Generated from frame: R&DCloud-ProFolStu-Project (17279:269520)
 * URL: https://www.figma.com/design/B0H99zI9iTyU7vusGYP3rk/Rescale-Data-AI?node-id=17279-269520
 * 
 * @fileoverview Assistant Chat component styles extracted from Figma
 */

// Extracted styles from the Figma frame
export const assistantChatStyles = {
  "colors": {
    "background": "#ffffff",
    "containerBackground": "#ffffff",
  },
  "typography": {},
  "spacing": {},
  "effects": {},
  "layout": {
    "containerWidth": "1720px",
    "containerHeight": "968px"
  }
} as const;

// Enhanced styles for Assistant Chat based on Figma frame context
export const figmaAssistantChatStyles = {
  // Container/Wrapper styles
  container: {
    backgroundColor: assistantChatStyles.colors.background,
    width: '100%',
    maxWidth: '400px', // More reasonable chat width
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    border: '1px solid #E5E7EB',
  },
  
  // Chat header styles (inferred from Figma context)
  header: {
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px 20px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  
  // Message area styles
  messageArea: {
    backgroundColor: assistantChatStyles.colors.background,
    padding: '16px 20px',
    minHeight: '300px',
    maxHeight: '500px',
    overflowY: 'auto' as const,
  },
  
  // Input area styles
  inputArea: {
    backgroundColor: '#F9FAFB',
    borderTop: '1px solid #E5E7EB',
    padding: '16px 20px',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  
  // Float button styles (for chat trigger)
  floatButton: {
    width: '56px',
    height: '56px',
    backgroundColor: '#0066CC',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.4)',
    border: 'none',
    borderRadius: '50%',
  },
  
  // Message bubble styles
  userMessage: {
    backgroundColor: '#0066CC',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '18px 18px 4px 18px',
    maxWidth: '75%',
    marginLeft: 'auto',
    marginBottom: '12px',
  },
  
  assistantMessage: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    padding: '12px 16px', 
    borderRadius: '18px 18px 18px 4px',
    maxWidth: '75%',
    marginRight: 'auto',
    marginBottom: '12px',
  },
} as const;

// Styled-components compatible props
export const AssistantChatStyledProps = {
  // Container
  containerBg: figmaAssistantChatStyles.container.backgroundColor,
  containerRadius: figmaAssistantChatStyles.container.borderRadius,
  containerShadow: figmaAssistantChatStyles.container.boxShadow,
  containerBorder: figmaAssistantChatStyles.container.border,
  containerMaxWidth: figmaAssistantChatStyles.container.maxWidth,
  
  // Header
  headerBg: figmaAssistantChatStyles.header.backgroundColor,
  headerBorder: figmaAssistantChatStyles.header.borderBottom,
  headerPadding: figmaAssistantChatStyles.header.padding,
  
  // Message area
  messageAreaBg: figmaAssistantChatStyles.messageArea.backgroundColor,
  messageAreaPadding: figmaAssistantChatStyles.messageArea.padding,
  messageAreaMinHeight: figmaAssistantChatStyles.messageArea.minHeight,
  messageAreaMaxHeight: figmaAssistantChatStyles.messageArea.maxHeight,
  
  // Input area
  inputAreaBg: figmaAssistantChatStyles.inputArea.backgroundColor,
  inputAreaBorder: figmaAssistantChatStyles.inputArea.borderTop,
  inputAreaPadding: figmaAssistantChatStyles.inputArea.padding,
  
  // Float button
  floatButtonWidth: figmaAssistantChatStyles.floatButton.width,
  floatButtonHeight: figmaAssistantChatStyles.floatButton.height,
  floatButtonBg: figmaAssistantChatStyles.floatButton.backgroundColor,
  floatButtonShadow: figmaAssistantChatStyles.floatButton.boxShadow,
  
  // Message bubbles
  userMessageBg: figmaAssistantChatStyles.userMessage.backgroundColor,
  userMessageColor: figmaAssistantChatStyles.userMessage.color,
  userMessagePadding: figmaAssistantChatStyles.userMessage.padding,
  userMessageRadius: figmaAssistantChatStyles.userMessage.borderRadius,
  
  assistantMessageBg: figmaAssistantChatStyles.assistantMessage.backgroundColor,
  assistantMessageColor: figmaAssistantChatStyles.assistantMessage.color,
  assistantMessagePadding: figmaAssistantChatStyles.assistantMessage.padding,
  assistantMessageRadius: figmaAssistantChatStyles.assistantMessage.borderRadius,
} as const;

export type AssistantChatStyleProps = typeof AssistantChatStyledProps;
export default figmaAssistantChatStyles;