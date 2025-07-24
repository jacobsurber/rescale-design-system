# 🔌 Figma MCP Server Setup Guide

## Overview

The Figma MCP (Model Context Protocol) server is a bridge that connects your local development environment to the Figma desktop application. It runs on `localhost:3845` and provides real-time access to your Figma designs.

## 📋 Prerequisites

1. **Figma Desktop App** - Download from [figma.com/downloads](https://www.figma.com/downloads/)
2. **Node.js 18+** - For running the MCP server
3. **Design File** - A Figma file open in the desktop app

## 🚀 Installation Options

### Option 1: Official Figma MCP Server

```bash
# Install the official Figma MCP server (if available)
npm install -g @figma/mcp-server

# Start the server
figma-mcp-server --port 3845
```

### Option 2: Community MCP Server

```bash
# Install community Figma MCP implementation
npm install -g figma-mcp-server

# Start with configuration
figma-mcp-server start --port 3845 --host localhost
```

### Option 3: Custom MCP Bridge (Development)

For development purposes, you can use our mock MCP server:

```bash
# In your project directory
npm run mcp:server
```

## 🔧 Configuration

### 1. Figma Desktop App Setup

1. **Open Figma Desktop** (not browser version)
2. **Enable Developer Mode**:
   - Go to Figma → Preferences → Advanced
   - Enable "Developer Mode" or "Plugin Developer Mode"
3. **Open Your Design File**
4. **Keep Figma Running** while using the dashboard

### 2. MCP Server Configuration

The server should automatically detect your Figma installation. If it doesn't:

```bash
# Set Figma path manually (macOS)
export FIGMA_PATH="/Applications/Figma.app"

# Set Figma path manually (Windows)
set FIGMA_PATH="C:\Users\%USERNAME%\AppData\Local\Figma\Figma.exe"

# Start server with custom path
figma-mcp-server --figma-path "$FIGMA_PATH"
```

### 3. Port Configuration

If port 3845 is occupied:

```bash
# Use different port
figma-mcp-server --port 3846

# Update config in figma-mcp.config.js
# server.port = 3846
```

## ✅ Verification

### Test MCP Server

```bash
# Check if server is running
curl http://localhost:3845/health

# Expected response:
# {"status": "healthy", "figma": "connected"}
```

### Test Dashboard Connection

1. **Start Dashboard**: `npm run dashboard`
2. **Visit**: http://localhost:3001/dashboard.html
3. **Click "Test Connection"** - should turn green
4. **Select element in Figma** - should appear in dashboard

## 🐛 Troubleshooting

### Server Won't Start

**Error: Port 3845 already in use**
```bash
# Find what's using the port
lsof -i :3845

# Kill the process
kill -9 <PID>

# Or use different port
figma-mcp-server --port 3846
```

**Error: Figma not detected**
```bash
# Ensure Figma desktop app is running
ps aux | grep -i figma

# Restart Figma desktop app
# Try opening/closing a design file
```

### Dashboard Shows "Disconnected"

1. **Check MCP server is running**: `curl http://localhost:3845/health`
2. **Check Figma desktop app is open**
3. **Check firewall/antivirus** isn't blocking localhost:3845
4. **Try restarting both** Figma and MCP server

### No Selection Detected

1. **Select a frame or component** (not just layers)
2. **Wait 2-3 seconds** for detection
3. **Try different elements** in your design
4. **Check console** for error messages

## 🔄 Alternative: Mock Mode

For testing without MCP server:

```bash
# Start dashboard in mock mode
npm run dashboard:mock
```

This provides:
- ✅ Dashboard functionality
- ✅ UI testing
- ✅ Sample tokens
- ❌ No real Figma connection

## 📚 Resources

- [Figma Desktop Download](https://www.figma.com/downloads/)
- [MCP Protocol Docs](https://github.com/anthropics/model-context-protocol)
- [Figma Plugin Development](https://www.figma.com/plugin-docs/)

## 🆘 Support

If you're still having issues:

1. **Check our dashboard** works with mock tokens first
2. **Verify Figma desktop** app is the latest version
3. **Try restarting** your computer (sometimes helps with permissions)
4. **Check project issues** on GitHub

The dashboard will work perfectly once the MCP server bridge is established! 🎉