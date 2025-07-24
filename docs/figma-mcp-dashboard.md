# Figma MCP Dashboard

A real-time web interface for the Figma MCP (Model Context Protocol) integration that provides visual design token extraction, component validation, and live synchronization between Figma and your React components.

## 🌟 Features

### Real-time Design Token Extraction
- **Live Connection Status**: Monitor MCP server connectivity with visual indicators
- **Selection-based Extraction**: Automatically detect current Figma selection and extract tokens
- **Token Categories**: Organized color, typography, spacing, and shadow tokens
- **One-click Copy**: Copy token names or values to clipboard

### Interactive Interface
- **Visual Token Browser**: Grid view of extracted tokens with live previews
- **Color Swatches**: Visual color previews with hex values
- **Typography Samples**: Font family and size information
- **Real-time Updates**: Live monitoring of Figma selection changes

### Developer Workflow
- **Component Gallery**: Browse and validate React components (coming soon)
- **Design System Health**: Monitor compliance and detect drift (coming soon)
- **Asset Extraction**: Export SVGs and images directly from Figma (coming soon)

## 🚀 Getting Started

### Prerequisites

1. **Figma Desktop App**: Must be running
2. **MCP Server**: Running on localhost:3845
3. **Node.js**: Version 18+ recommended

### Running the Dashboard

```bash
# Start the dashboard development server
npm run dashboard

# Or build for production
npm run dashboard:build
```

The dashboard will be available at http://localhost:3001/dashboard.html

### MCP Server Setup

Ensure your Figma MCP server is running and accessible:

```bash
# Check if MCP server is running
curl http://localhost:3845/health

# Start MCP health monitoring
npm run figma:health:monitor
```

## 🎯 Usage

### Basic Workflow

1. **Connect to MCP Server**
   - Dashboard automatically attempts connection on load
   - Green indicator shows successful connection
   - Click "Refresh" to retry connection

2. **Extract Design Tokens**
   - Select any element in Figma desktop app
   - Dashboard detects selection automatically
   - Click "Extract Tokens" to pull design properties
   - View tokens in organized categories

3. **Copy and Use Tokens**
   - Click any token card to copy its value
   - Click "Copy Name" button to copy token name
   - Use in your CSS or styled-components

### Advanced Features

#### Selection Monitoring
The dashboard continuously monitors your Figma selection:
- Updates every 2 seconds when connected
- Shows current selection info
- Enables context-aware token extraction

#### Token Management
- **Clear All**: Remove all extracted tokens
- **Last Extracted**: Timestamp of last extraction
- **Category Filtering**: Tokens organized by type

## 🔧 Technical Details

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   MCP Server    │    │  Figma Desktop  │
│   (React App)   │◄──►│  localhost:3845 │◄──►│      App        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### API Endpoints

The dashboard communicates with these MCP endpoints:

- `GET /health` - Server health check
- `POST /tools/get_variable_defs` - Extract design tokens
- `POST /tools/get_code` - Get component code information
- `POST /tools/get_current_selection` - Current Figma selection
- `POST /tools/get_image` - Extract node images

### Token Format

Extracted tokens follow this structure:

```typescript
interface DesignToken {
  name: string;        // Token identifier
  value: string;       // CSS value (hex, px, etc.)
  type: 'color' | 'typography' | 'spacing' | 'shadow';
  category: string;    // Grouping category
}
```

## 🛠️ Development

### File Structure

```
src/dashboard/
├── FigmaMCPDashboard.tsx     # Main dashboard component
├── DashboardApp.tsx          # Standalone app wrapper
├── main.tsx                  # Entry point
├── hooks/
│   └── useMCPConnection.ts   # MCP connection management
├── services/
│   └── mcpService.ts         # MCP API client
└── index.ts                  # Exports
```

### Custom Hooks

#### `useMCPConnection`

Manages all MCP interactions:

```typescript
const {
  // Connection state
  connected,
  health,
  error,
  checkHealth,
  
  // Selection monitoring
  currentSelection,
  monitoring,
  
  // Token extraction
  tokens,
  extracting,
  extractTokens,
  clearTokens
} = useMCPConnection();
```

### Styling

Built with Ant Design and styled-components:
- Responsive grid layout
- Smooth animations and transitions
- Visual color previews
- Consistent with design system theme

## 🎨 Integration

### With Storybook

The dashboard is also available as a Storybook story:

```typescript
import { FigmaMCPDashboard } from '@/dashboard';

// Use in Storybook or other React apps
<FigmaMCPDashboard />
```

### As Component Library

Export the dashboard for use in other projects:

```typescript
import { FigmaMCPDashboard, DashboardApp } from 'rescale-design-system';
```

## 🔍 Troubleshooting

### Connection Issues

**Dashboard shows "Disconnected"**
- Ensure Figma desktop app is running
- Check MCP server is running on localhost:3845
- Verify no firewall blocking the connection

**Token extraction fails**
- Select a valid Figma element first
- Check browser console for errors
- Verify MCP server has necessary permissions

### Performance

**Slow selection updates**
- Selection monitoring checks every 2 seconds
- Large files may have slower response times
- Consider reducing monitoring frequency for complex files

### Browser Compatibility

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge recommended
- JavaScript must be enabled
- Clipboard API required for copy functionality

## 🚧 Roadmap

### Upcoming Features

- **Component Gallery**: Visual component browser with code mapping
- **Design Validation**: Real-time design vs code comparison
- **Asset Export**: Bulk SVG and image extraction
- **Team Collaboration**: Shared token libraries
- **VS Code Extension**: Direct IDE integration

### Performance Improvements

- WebSocket connections for instant updates
- Caching and offline support
- Background processing for large extractions
- Export to popular design token formats

## 📝 Contributing

To add features to the dashboard:

1. Add new UI components in `FigmaMCPDashboard.tsx`
2. Extend MCP service methods in `mcpService.ts`
3. Update the connection hook for new state
4. Add corresponding Storybook stories
5. Update this documentation

## 🔗 Related

- [MCP Integration Guide](./figma-mcp-advanced-features.md)
- [Design Token Documentation](./figma-integration.md)
- [Component Development Guide](./getting-started.md)