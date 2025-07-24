import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Welcome',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Welcome to the fresh Rescale Design System Storybook with Figma MCP integration',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GetStarted: Story = {
  render: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#F8F9FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        padding: '48px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: '#3399BB',
          marginBottom: '16px',
          margin: 0
        }}>
          🌊 Rescale Design System
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#6B7280',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Fresh start with Figma MCP integration
        </p>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Figma MCP Ready
          </div>
          
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Clean Slate
          </div>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#9CA3AF',
          marginBottom: '0',
          lineHeight: '1.5'
        }}>
          Ready to build components that match Figma designs pixel-perfectly using real-time MCP extraction
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Starting fresh with a clean Storybook setup, ready for MCP-powered Figma integration.',
      },
    },
  },
};