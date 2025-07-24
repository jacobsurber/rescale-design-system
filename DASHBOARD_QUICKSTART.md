# 🎛️ Figma MCP Dashboard - Quick Start

## Launch Dashboard

```bash
npm run dashboard
```

**Visit:** http://localhost:3001/dashboard.html

## ✅ Prerequisites

1. **Figma Desktop App** - Must be running
2. **MCP Server** - Running on localhost:3845  
3. **Design File** - Open your Figma design file

## 🎯 Quick Workflow

1. **Auto-Connect** - Dashboard connects to MCP server automatically
2. **Select in Figma** - Choose any element in your Figma design
3. **Extract Tokens** - Click "Extract Tokens" button
4. **Copy & Use** - Click tokens to copy values for CSS/React

## 🎨 Features

- **Real-time Connection Monitoring** - Green/red status indicator
- **Visual Token Browser** - Interactive grid with color previews  
- **Selection Detection** - Automatically tracks Figma selection
- **One-click Copy** - Copy token names and values to clipboard
- **Live Updates** - Real-time sync with Figma changes

## 🔧 Troubleshooting

**Dashboard shows blank screen:**
- Check browser console for errors
- Ensure React 19+ is installed
- Restart dashboard: `npm run dashboard`

**Can't connect to MCP:**
- Ensure Figma desktop app is running
- Check MCP server status: `npm run figma:health`
- Verify localhost:3845 is accessible

**No tokens extracted:**
- Select a valid Figma element first
- Check element has design properties (colors, fonts, etc.)
- Try different selections (frames, components, text)

## 📚 More Info

- [Full Documentation](./docs/figma-mcp-dashboard.md)
- [MCP Integration Guide](./docs/figma-mcp-advanced-features.md)
- [CLI Tools](./README.md#figma-integration)