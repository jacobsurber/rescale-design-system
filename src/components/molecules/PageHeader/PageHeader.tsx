import React from 'react';
import { Breadcrumb, Tabs, Space, Button, Divider } from 'antd';
import type { TabsProps } from 'antd';

import styled from 'styled-components';
import { mediaQueries } from '../../../styles/breakpoints';
import { Icon } from '../../atoms/Icon';

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface PageAction {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'text' | 'link' | 'dashed';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
}

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons */
  actions?: PageAction[];
  /** Tabs configuration */
  tabs?: TabsProps;
  /** Whether to show a divider at the bottom */
  showDivider?: boolean;
  /** Additional content to render after the main header */
  extra?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const PageHeaderContainer = styled.div`
  background: var(--rescale-color-white);
  padding: var(--rescale-space-6) 0;
  
  ${mediaQueries.mobile} {
    padding: var(--rescale-space-4) 0;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--rescale-space-4);
  margin-bottom: var(--rescale-space-4);
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: var(--rescale-space-3);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  flex-shrink: 0;
  
  ${mediaQueries.mobile} {
    justify-content: flex-end;
    overflow-x: auto;
    padding-bottom: var(--rescale-space-1);
    
    .ant-btn {
      flex-shrink: 0;
    }
  }
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: var(--rescale-space-3);
  
  .ant-breadcrumb-link {
    color: var(--rescale-color-gray-600);
    font-size: var(--rescale-font-size-sm);
    
    &:hover {
      color: var(--rescale-color-brand-blue);
    }
  }
  
  .ant-breadcrumb-separator {
    color: var(--rescale-color-gray-500);
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 var(--rescale-space-2) 0;
  color: var(--rescale-color-gray-900);
  font-size: var(--rescale-font-size-2xl);
  font-weight: var(--rescale-font-weight-bold);
  line-height: var(--rescale-line-height-tight);
  
  ${mediaQueries.mobile} {
    font-size: var(--rescale-font-size-xl);
  }
`;

const PageDescription = styled.p`
  margin: 0;
  color: var(--rescale-color-gray-600);
  font-size: var(--rescale-font-size-base);
  line-height: var(--rescale-line-height-normal);
  max-width: 600px;
`;

const TabsContainer = styled.div`
  margin-top: var(--rescale-space-4);
  
  .ant-tabs-tab {
    font-size: var(--rescale-font-size-sm);
    font-weight: var(--rescale-font-weight-medium);
  }
  
  .ant-tabs-nav {
    margin-bottom: 0;
  }
  
  ${mediaQueries.mobile} {
    .ant-tabs-nav-wrap {
      overflow-x: auto;
    }
    
    .ant-tabs-nav-list {
      white-space: nowrap;
    }
  }
`;

const StyledDivider = styled(Divider)`
  margin: var(--rescale-space-6) 0 0 0;
  
  ${mediaQueries.mobile} {
    margin: var(--rescale-space-4) 0 0 0;
  }
`;

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions = [],
  tabs,
  showDivider = true,
  extra,
  className,
  style,
}) => {
  const breadcrumbItems = breadcrumbs?.map((item) => ({
    title: (
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {item.icon}
        {item.href ? (
          <a href={item.href}>{item.title}</a>
        ) : (
          item.title
        )}
      </span>
    ),
  }));

  return (
    <PageHeaderContainer className={className} style={style}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <StyledBreadcrumb
          items={[
            {
              title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="HomeOutlined" />
                  <a href="/">Home</a>
                </span>
              ),
            },
            ...breadcrumbItems!,
          ]}
        />
      )}
      
      <HeaderTop>
        <HeaderContent>
          <PageTitle>{title}</PageTitle>
          {description && (
            <PageDescription>{description}</PageDescription>
          )}
        </HeaderContent>
        
        {actions.length > 0 && (
          <HeaderActions>
            <Space size="small">
              {actions.map((action) => (
                <Button
                  key={action.key}
                  type={action.type || 'default'}
                  icon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  loading={action.loading}
                  danger={action.danger}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </HeaderActions>
        )}
      </HeaderTop>
      
      {tabs && (
        <TabsContainer>
          <Tabs {...tabs} />
        </TabsContainer>
      )}
      
      {extra && extra}
      
      {showDivider && <StyledDivider />}
    </PageHeaderContainer>
  );
};

export default PageHeader;