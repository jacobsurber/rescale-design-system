import React from 'react';
import { Space, Typography } from 'antd';
import { Button, Card } from '@components/atoms';
import styled from 'styled-components';

const { Title, Paragraph, Link } = Typography;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

export const Home: React.FC = () => {
  return (
    <Container>
      <HeroSection>
        <Title level={1}>Rescale Design System</Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          A comprehensive design system built with React, TypeScript, and Ant Design.
          Create consistent and beautiful user interfaces with our pre-built components.
        </Paragraph>
        <Space size="large" style={{ marginTop: '24px' }}>
          <Button size="large" variant="primary" href="/storybook" target="_blank">
            View Storybook
          </Button>
          <Button size="large" variant="secondary" href="https://github.com" target="_blank">
            GitHub
          </Button>
        </Space>
      </HeroSection>

      <Title level={2} style={{ marginBottom: '24px' }}>Features</Title>
      
      <CardsGrid>
        <Card title="Component Library" variant="elevated">
          Pre-built React components following atomic design principles. Easily customizable and composable.
        </Card>
        
        <Card title="TypeScript Support" variant="elevated">
          Full TypeScript support with comprehensive type definitions for all components and utilities.
        </Card>
        
        <Card title="Ant Design Integration" variant="elevated">
          Built on top of Ant Design with custom theming and extended components for additional flexibility.
        </Card>
        
        <Card title="Storybook Documentation" variant="elevated">
          Interactive component documentation with live examples and controls for testing different states.
        </Card>
        
        <Card title="Testing Ready" variant="elevated">
          Configured with Jest and React Testing Library for unit and integration testing.
        </Card>
        
        <Card title="Modern Build Tools" variant="elevated">
          Fast development with Vite, hot module replacement, and optimized production builds.
        </Card>
      </CardsGrid>

      <Card title="Quick Start" style={{ marginTop: '40px' }}>
        <Paragraph>
          <code>npm install</code> - Install dependencies
        </Paragraph>
        <Paragraph>
          <code>npm run dev</code> - Start development server
        </Paragraph>
        <Paragraph>
          <code>npm run storybook</code> - Launch Storybook
        </Paragraph>
        <Paragraph>
          <code>npm run test</code> - Run tests
        </Paragraph>
      </Card>
    </Container>
  );
};

export default Home;