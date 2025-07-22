import React from 'react';
import { Card, Button } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { MainLayout } from '../../MainLayout';
import { PageHeader } from '../../PageHeader';
import { Container } from '../../Container';
import { Grid, Col } from '../../Grid';
import { Stack } from '../../Spacing';
import type { PageHeaderProps, PageAction } from '../../PageHeader';
import { mediaQueries } from '../../../../styles/breakpoints';

export interface DetailSection {
  key: string;
  title: string;
  content: React.ReactNode;
  span?: number;
  order?: number;
}

export interface DetailPageTemplateProps extends Omit<PageHeaderProps, 'children'> {
  /** Main content sections */
  sections?: DetailSection[];
  /** Additional content to render */
  children?: React.ReactNode;
  /** Back button handler */
  onBack?: () => void;
  /** Edit handler */
  onEdit?: () => void;
  /** Delete handler */
  onDelete?: () => void;
  /** Custom actions */
  customActions?: PageAction[];
  /** Whether edit button is loading */
  editLoading?: boolean;
  /** Whether delete button is loading */
  deleteLoading?: boolean;
  /** Whether to show the back button */
  showBackButton?: boolean;
  /** Whether to show default actions (edit, delete) */
  showDefaultActions?: boolean;
  /** Layout configuration */
  layout?: 'single' | 'split' | 'grid';
  /** Sidebar content for split layout */
  sidebar?: React.ReactNode;
  /** Layout container props */
  containerProps?: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padded?: boolean;
  };
}

const BackButton = styled(Button)`
  margin-bottom: var(--rescale-space-4);
  
  ${mediaQueries.mobile} {
    margin-bottom: var(--rescale-space-3);
  }
`;

const SectionCard = styled(Card)<{ $order?: number }>`
  height: fit-content;
  order: ${props => props.$order || 0};
  
  .ant-card-head {
    border-bottom: 1px solid var(--rescale-color-gray-300);
    
    .ant-card-head-title {
      font-size: var(--rescale-font-size-lg);
      font-weight: var(--rescale-font-weight-semibold);
      color: var(--rescale-color-gray-900);
    }
  }
  
  .ant-card-body {
    padding: var(--rescale-space-6);
    
    ${mediaQueries.mobile} {
      padding: var(--rescale-space-4);
    }
  }
`;

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--rescale-space-6);
  
  ${mediaQueries.tablet} {
    grid-template-columns: 1fr 280px;
    gap: var(--rescale-space-4);
  }
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: var(--rescale-space-4);
  }
`;

const MainContent = styled.div`
  min-width: 0;
`;

const SidebarContent = styled.div`
  ${mediaQueries.mobile} {
    order: -1;
  }
`;

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  sections = [],
  children,
  onBack,
  onEdit,
  onDelete,
  customActions = [],
  editLoading = false,
  deleteLoading = false,
  showBackButton = true,
  showDefaultActions = true,
  layout = 'single',
  sidebar,
  containerProps = { maxWidth: 'xl', padded: true },
  actions = [],
  ...pageHeaderProps
}) => {
  // Build actions array
  const allActions: PageAction[] = [
    ...customActions,
    ...actions,
  ];

  if (showDefaultActions) {
    if (onEdit) {
      allActions.push({
        key: 'edit',
        label: 'Edit',
        icon: <EditOutlined />,
        onClick: onEdit,
        loading: editLoading,
      });
    }
    
    if (onDelete) {
      allActions.push({
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        onClick: onDelete,
        loading: deleteLoading,
        danger: true,
      });
    }
  }

  const renderContent = () => {
    if (layout === 'split' && sidebar) {
      return (
        <SplitContainer>
          <MainContent>
            {renderSections()}
            {children}
          </MainContent>
          <SidebarContent>
            {sidebar}
          </SidebarContent>
        </SplitContainer>
      );
    }

    return (
      <>
        {renderSections()}
        {children}
      </>
    );
  };

  const renderSections = () => {
    if (sections.length === 0) return null;

    if (layout === 'grid') {
      return (
        <Grid columns={12} gap={6}>
          {sections.map((section) => (
            <Col 
              key={section.key} 
              span={section.span || 6}
              order={section.order}
            >
              <SectionCard 
                title={section.title}
                $order={section.order}
              >
                {section.content}
              </SectionCard>
            </Col>
          ))}
        </Grid>
      );
    }

    return (
      <Stack gap={6}>
        {sections.map((section) => (
          <SectionCard 
            key={section.key}
            title={section.title}
            $order={section.order}
          >
            {section.content}
          </SectionCard>
        ))}
      </Stack>
    );
  };

  return (
    <MainLayout>
      <Container {...containerProps}>
        <Stack gap={6}>
          {showBackButton && onBack && (
            <BackButton
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              type="text"
            >
              Back
            </BackButton>
          )}
          
          <PageHeader
            {...pageHeaderProps}
            actions={allActions}
          />
          
          {renderContent()}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default DetailPageTemplate;