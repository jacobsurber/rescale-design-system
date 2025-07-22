import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: var(--rescale-space-4);
  background: var(--rescale-color-white);
  border-radius: var(--rescale-radius-lg);
  border: 1px solid var(--rescale-color-gray-300);
`;

const Title = styled.h2`
  margin: 0 0 var(--rescale-space-3) 0;
  color: var(--rescale-color-gray-900);
  font-size: var(--rescale-font-size-lg);
  font-weight: var(--rescale-font-weight-semibold);
`;

const Description = styled.p`
  margin: 0;
  color: var(--rescale-color-gray-600);
  font-size: var(--rescale-font-size-sm);
`;

export const ThemeExample: React.FC = () => {
  return (
    <Container>
      <Title>Theme Example</Title>
      <Description>
        This component demonstrates CSS variables usage in the Rescale design system.
      </Description>
    </Container>
  );
};

export default ThemeExample;
