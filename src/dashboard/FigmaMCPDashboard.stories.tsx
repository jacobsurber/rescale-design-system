import type { Meta, StoryObj } from '@storybook/react';
import { FigmaMCPDashboard } from './FigmaMCPDashboard';

const meta: Meta<typeof FigmaMCPDashboard> = {
  title: 'Dashboard/FigmaMCPDashboard',
  component: FigmaMCPDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Figma MCP Dashboard

A real-time web interface for the Figma MCP (Model Context Protocol) integration.

## Features

- **Live Connection Status**: Monitor MCP server connectivity
- **Token Extraction**: Extract design tokens from selected Figma elements
- **Real-time Selection**: Automatically detect current Figma selection
- **Component Gallery**: Browse and validate React components (coming soon)
- **Sync Controls**: Manage real-time synchronization (coming soon)

## Usage

1. Ensure Figma desktop app is running
2. Start the MCP server (localhost:3845)
3. Open this dashboard
4. Select elements in Figma to extract tokens

## Development

The dashboard connects to your local MCP server and provides a visual interface for:

- Design token extraction and preview
- Component validation and mapping
- Real-time design synchronization
- Asset extraction and optimization

This replaces the old CLI-only workflow with an intuitive web interface.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof FigmaMCPDashboard>;

export const Default: Story = {
  name: 'Default Dashboard',
  parameters: {
    docs: {
      description: {
        story: 'Default view of the Figma MCP Dashboard with connection status and token extraction interface.'
      }
    }
  }
};

export const WithMockData: Story = {
  name: 'With Sample Data',
  parameters: {
    docs: {
      description: {
        story: 'Dashboard showing sample design tokens and connection status. This demonstrates how the interface looks when tokens are extracted from Figma.'
      }
    }
  }
};

export const Disconnected: Story = {
  name: 'Disconnected State',
  parameters: {
    docs: {
      description: {
        story: 'Dashboard when MCP server is not running or connection has failed. Shows error state and reconnection controls.'
      }
    }
  }
};