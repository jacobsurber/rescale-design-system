import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from 'antd';
import { AnimatedFeedback, useRipple } from './';
import { MotionProvider } from '../../../providers/MotionProvider';
import styled from 'styled-components';

const meta: Meta<typeof AnimatedFeedback> = {
  title: 'Atoms/AnimatedFeedback',
  component: AnimatedFeedback,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MotionProvider>
        <div style={{ padding: '40px' }}>
          <Story />
        </div>
      </MotionProvider>
    ),
  ],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'loading'],
    },
    visible: {
      control: { type: 'boolean' },
    },
    duration: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedFeedback>;

export const Success: Story = {
  args: {
    type: 'success',
    visible: true,
    message: 'Operation completed successfully!',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    visible: true,
    message: 'Something went wrong!',
  },
};

export const Loading: Story = {
  args: {
    type: 'loading',
    visible: true,
    message: 'Processing...',
  },
};

export const WithoutMessage: Story = {
  args: {
    type: 'success',
    visible: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [feedback, setFeedback] = useState<{
      type: 'success' | 'error' | 'loading';
      visible: boolean;
      message: string;
    }>({
      type: 'success',
      visible: false,
      message: '',
    });

    const showSuccess = () => {
      setFeedback({
        type: 'success',
        visible: true,
        message: 'Success! Action completed.',
      });
    };

    const showError = () => {
      setFeedback({
        type: 'error',
        visible: true,
        message: 'Error! Please try again.',
      });
    };

    const showLoading = () => {
      setFeedback({
        type: 'loading',
        visible: true,
        message: 'Loading...',
      });

      // Simulate loading completion
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, visible: false }));
      }, 2000);
    };

    return (
      <MotionProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" onClick={showSuccess}>
              Show Success
            </Button>
            <Button danger onClick={showError}>
              Show Error
            </Button>
            <Button onClick={showLoading}>
              Show Loading
            </Button>
          </div>
          
          <div style={{ minHeight: '50px', display: 'flex', alignItems: 'center' }}>
            <AnimatedFeedback
              {...feedback}
              duration={3000}
              onHide={() => setFeedback(prev => ({ ...prev, visible: false }))}
            />
          </div>
        </div>
      </MotionProvider>
    );
  },
};

const RippleButton = styled(Button)`
  position: relative;
  overflow: hidden;
`;

export const WithRippleEffect: Story = {
  render: () => {
    const { createRipple, RippleEffect } = useRipple();
    const [showFeedback, setShowFeedback] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
      createRipple(event);
      setShowFeedback(true);
    };

    return (
      <MotionProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <RippleButton
            type="primary"
            size="large"
            onClick={handleClick}
            style={{ minWidth: '200px', height: '50px' }}
          >
            Click for Ripple + Feedback
            <RippleEffect />
          </RippleButton>
          
          <AnimatedFeedback
            type="success"
            visible={showFeedback}
            message="Button clicked with ripple effect!"
            duration={2000}
            onHide={() => setShowFeedback(false)}
          />
        </div>
      </MotionProvider>
    );
  },
};

export const FormValidation: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState<{
      type: 'success' | 'error';
      visible: boolean;
      message: string;
    }>({
      type: 'success',
      visible: false,
      message: '',
    });

    const validateEmail = () => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      if (isValid) {
        setFeedback({
          type: 'success',
          visible: true,
          message: 'Valid email address!',
        });
      } else {
        setFeedback({
          type: 'error',
          visible: true,
          message: 'Please enter a valid email address.',
        });
      }
    };

    return (
      <MotionProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '300px' }}>
          <div style={{ width: '100%' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          
          <Button type="primary" onClick={validateEmail}>
            Validate Email
          </Button>
          
          <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
            <AnimatedFeedback
              {...feedback}
              duration={4000}
              onHide={() => setFeedback(prev => ({ ...prev, visible: false }))}
            />
          </div>
        </div>
      </MotionProvider>
    );
  },
};