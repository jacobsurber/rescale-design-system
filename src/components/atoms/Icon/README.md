# Icon Component

A flexible icon wrapper component that provides a consistent interface for all Ant Design icons with additional features like sizing, coloring, and interactive states.

## Usage

```tsx
import { Icon } from 'rescale-design-system';

// Basic usage
<Icon name="HomeOutlined" />

// With size
<Icon name="SettingOutlined" size="lg" />

// With color
<Icon name="CheckCircleOutlined" color="success" />

// Interactive
<Icon 
  name="EditOutlined" 
  clickable 
  onClick={() => console.log('Edit clicked')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | `AntIconName` | - | **Required.** Name of the Ant Design icon |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Icon size |
| color | `IconColor \| string` | `'inherit'` | Icon color (theme color or custom) |
| spin | `boolean` | `false` | Whether the icon should spin |
| rotate | `number` | - | Rotation angle in degrees |
| clickable | `boolean` | `false` | Whether the icon is clickable |
| onClick | `(event: React.MouseEvent) => void` | - | Click handler |
| className | `string` | - | Additional CSS class |
| style | `React.CSSProperties` | - | Inline styles |
| aria-label | `string` | - | Accessibility label |

## Icon Sizes

- `xs`: 12px
- `sm`: 14px  
- `md`: 16px (default)
- `lg`: 18px
- `xl`: 20px
- `2xl`: 24px

## Theme Colors

- `primary`: Primary brand color
- `secondary`: Secondary color
- `success`: Success green
- `warning`: Warning yellow
- `error`: Error red
- `info`: Info blue
- `neutral`: Neutral gray
- `disabled`: Disabled state color
- `white`: White color
- `black`: Black color
- `inherit`: Inherit from parent

## Examples

### Icon Gallery

```tsx
import { Icon } from 'rescale-design-system';

const icons = [
  'HomeOutlined',
  'SettingOutlined',
  'UserOutlined',
  'TeamOutlined',
  'FileOutlined',
  'FolderOutlined'
];

<div style={{ display: 'flex', gap: 16 }}>
  {icons.map(name => (
    <Icon key={name} name={name} size="lg" />
  ))}
</div>
```

### Status Icons

```tsx
<Icon name="CheckCircleOutlined" color="success" size="lg" />
<Icon name="CloseCircleOutlined" color="error" size="lg" />
<Icon name="ExclamationCircleOutlined" color="warning" size="lg" />
<Icon name="InfoCircleOutlined" color="info" size="lg" />
```

### Loading States

```tsx
<Icon name="LoadingOutlined" spin size="xl" />
<Icon name="SyncOutlined" spin color="primary" />
```

### Interactive Icons

```tsx
<Icon 
  name="DeleteOutlined" 
  color="error"
  clickable
  onClick={() => handleDelete()}
  aria-label="Delete item"
/>

<Icon 
  name="EditOutlined" 
  color="primary"
  clickable
  onClick={() => handleEdit()}
  aria-label="Edit item"
/>
```

### Icon Buttons

```tsx
// Icon-only button
<Button 
  iconOnly 
  icon={<Icon name="PlusOutlined" />}
  aria-label="Add new item"
/>

// Button with icon and text
<Button 
  icon={<Icon name="DownloadOutlined" />}
>
  Download
</Button>
```

## Accessibility

- Always provide an `aria-label` for icon-only interactive elements
- Use semantic colors that convey meaning
- Ensure sufficient color contrast
- Consider adding tooltips for icon-only buttons

## Available Icons

The component supports all Ant Design icons. View the full list at [Ant Design Icons](https://ant.design/components/icon).

Common icons include:
- Navigation: `HomeOutlined`, `MenuOutlined`, `AppstoreOutlined`
- Actions: `EditOutlined`, `DeleteOutlined`, `PlusOutlined`, `MinusOutlined`
- Status: `CheckOutlined`, `CloseOutlined`, `WarningOutlined`, `InfoOutlined`
- Files: `FileOutlined`, `FolderOutlined`, `UploadOutlined`, `DownloadOutlined`
- User: `UserOutlined`, `TeamOutlined`, `LoginOutlined`, `LogoutOutlined`