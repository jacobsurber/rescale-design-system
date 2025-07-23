# Button Component

A versatile button component with comprehensive variant system, size options, and design token integration.

## Features

- **Complete size system** (xs, sm, md, lg, xl) with proportional typography and spacing
- **Full variant coverage** (primary, secondary, ghost, text, danger, success, warning)
- **Icon-only button support** with automatic width adjustment
- **Custom loading text** for better user feedback
- **Accessibility enhancements** including keyboard navigation and ARIA support
- **Consistent design token usage** throughout all styling
- **Animation support** with customizable behavior

## Installation

```bash
npm install @rescale/design-system
```

## Usage

### Basic Usage

```tsx
import { Button } from '@rescale/design-system';

function MyComponent() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### All Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="text">Text</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
```

### All Sizes

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### With Icons

```tsx
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

<Button icon={<PlusOutlined />} variant="primary">
  Add Item
</Button>
<Button icon={<EditOutlined />} variant="secondary">
  Edit
</Button>
<Button iconOnly icon={<DeleteOutlined />} variant="danger" />
```

### Loading States

```tsx
<Button loading>Loading...</Button>
<Button loading loadingText="Saving...">Save</Button>
```

### Custom Width

```tsx
<Button width={200}>Fixed Width</Button>
<Button width="100%">Full Width</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'text' \| 'danger' \| 'success' \| 'warning'` | `'primary'` | Visual variant of the button |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the button |
| `shape` | `'default' \| 'round' \| 'circle'` | `'default'` | Shape of the button |
| `iconOnly` | `boolean` | `false` | Whether this is an icon-only button |
| `disableAnimations` | `boolean` | `false` | Disable hover and tap animations |
| `loadingText` | `string` | - | Custom text to show when loading |
| `width` | `string \| number` | - | Custom width (useful for consistent button groups) |
| `showFocusRing` | `boolean` | `true` | Whether to show focus ring on keyboard focus |

Plus all standard Ant Design Button props except `variant`, `size`, and `shape` which are overridden.

## Design Tokens

The Button component uses the following design tokens:

- **Colors**: `designTokens.colors.brand.*`, `designTokens.colors.status.*`
- **Typography**: `designTokens.typography.fontWeight.medium`
- **Spacing**: Button sizes use proportional padding
- **Border Radius**: Size-appropriate corner radius
- **Shadows**: `designTokens.shadows.focus` for focus states
- **Animation**: `designTokens.animation.duration.normal` and easing functions

## Accessibility

- **Keyboard Navigation**: Full keyboard support with Tab and Enter/Space
- **Screen Readers**: Proper ARIA labels and button semantics
- **Focus Management**: Clear focus indicators with customizable focus rings
- **Color Contrast**: All variants meet WCAG AA contrast requirements
- **Touch Targets**: Minimum 44px touch targets on mobile devices

### ARIA Attributes

- `role="button"` - Applied automatically by Ant Design
- `aria-pressed` - For toggle buttons (when used)
- `aria-disabled` - When button is disabled
- `aria-label` - Provided automatically or via props

### Keyboard Interactions

- `Tab` - Move focus to the button
- `Enter` or `Space` - Activate the button
- `Escape` - Remove focus (in some contexts)

## Examples

### Form Actions

```tsx
<Space>
  <Button variant="primary" icon={<SaveOutlined />}>Save Changes</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="text">Reset Form</Button>
</Space>
```

### Data Actions

```tsx
<Space>
  <Button variant="primary" icon={<PlusOutlined />} size="sm">Add Item</Button>
  <Button variant="ghost" icon={<EditOutlined />} size="sm">Edit</Button>
  <Button variant="danger" icon={<DeleteOutlined />} size="sm">Delete</Button>
</Space>
```

### Status Actions

```tsx
<Space>
  <Button variant="success" icon={<CheckOutlined />}>Complete</Button>
  <Button variant="warning" icon={<EditOutlined />}>Review</Button>
  <Button variant="danger" icon={<CloseOutlined />}>Reject</Button>
</Space>
```

### Icon-only Toolbar

```tsx
<Space>
  <Button iconOnly icon={<EditOutlined />} size="xs" variant="ghost" />
  <Button iconOnly icon={<DeleteOutlined />} size="xs" variant="ghost" />
  <Button iconOnly icon={<DownloadOutlined />} size="xs" variant="ghost" />
  <Button iconOnly icon={<ShareAltOutlined />} size="xs" variant="ghost" />
</Space>
```

## Best Practices

### When to Use

- **Primary actions** - Use `variant="primary"` for the most important action
- **Secondary actions** - Use `variant="secondary"` for supporting actions  
- **Subtle actions** - Use `variant="ghost"` or `variant="text"` for less prominent actions
- **Destructive actions** - Use `variant="danger"` for delete, remove, or destructive actions
- **Success states** - Use `variant="success"` for completion or positive actions

### Sizing Guidelines

- **xs/sm** - Use in compact interfaces, toolbars, and data tables
- **md** - Default size for most interfaces and forms
- **lg/xl** - Use for prominent calls-to-action and landing pages

### Icon Usage

- Always use meaningful icons that reinforce the button's purpose
- Icon-only buttons should have clear tooltips or aria-labels
- Maintain consistent icon sizes within button groups

### Group Consistency

```tsx
// Good: Consistent widths
<Space>
  <Button width={120}>Save</Button>
  <Button width={120} variant="secondary">Cancel</Button>
  <Button width={120} variant="ghost">Reset</Button>
</Space>

// Good: Consistent sizes
<Space>
  <Button size="sm">Action 1</Button>
  <Button size="sm" variant="secondary">Action 2</Button>
  <Button size="sm" variant="ghost">Action 3</Button>
</Space>
```

## Troubleshooting

### Common Issues

**Button not showing focus ring**
- Ensure `showFocusRing={true}` (default)
- Check if custom CSS is overriding focus styles

**Icons not displaying properly**
- Ensure Ant Design icons are properly imported
- Check icon name spelling and availability

**Button animations not working**
- Verify `disableAnimations={false}` (default)
- Check if motion preferences are disabled globally

**Inconsistent button sizes in groups**
- Use consistent `size` prop across all buttons
- Consider using `width` prop for uniform button widths

### Performance Considerations

- Button components are memoized by default
- Animations can be disabled for better performance: `disableAnimations={true}`
- Large numbers of buttons benefit from virtualization in tables/lists

## Related Components

- **Icon** - For icon-only interactions without button styling
- **StatusTag** - For status indicators that aren't interactive
- **Card** - For clickable card-based interactions

## Changelog

### Version 1.0.0
- Initial release with complete variant and size system
- Full accessibility support
- Design token integration
- Comprehensive TypeScript types