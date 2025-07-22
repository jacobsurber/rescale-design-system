import React from 'react';
import { Card, Input, Button, Select } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { MainLayout } from '../../MainLayout';
import { PageHeader } from '../../PageHeader';
import { Container } from '../../Container';
import { Grid, Col } from '../../Grid';
import { Stack } from '../../Spacing';
import type { PageHeaderProps } from '../../PageHeader';
import { mediaQueries } from '../../../../styles/breakpoints';

export interface FilterOption {
  key: string;
  label: string;
  value: string;
}

export interface ListPageTemplateProps extends Omit<PageHeaderProps, 'children'> {
  /** Main content area */
  children: React.ReactNode;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search value */
  searchValue?: string;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  /** Filter options */
  filters?: FilterOption[];
  /** Selected filter value */
  filterValue?: string;
  /** Filter change handler */
  onFilterChange?: (value: string) => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Create new item handler */
  onCreate?: () => void;
  /** Create button text */
  createButtonText?: string;
  /** Whether search is loading */
  searchLoading?: boolean;
  /** Whether refresh is loading */
  refreshLoading?: boolean;
  /** Additional toolbar actions */
  toolbarActions?: React.ReactNode;
  /** Whether to show the toolbar */
  showToolbar?: boolean;
  /** Layout container props */
  containerProps?: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padded?: boolean;
  };
}

const ToolbarCard = styled(Card)`
  margin-bottom: var(--rescale-space-6);
  
  .ant-card-body {
    padding: var(--rescale-space-4);
  }
  
  ${mediaQueries.mobile} {
    margin-bottom: var(--rescale-space-4);
    
    .ant-card-body {
      padding: var(--rescale-space-3);
    }
  }
`;

const ToolbarGrid = styled(Grid)`
  align-items: center;
  
  ${mediaQueries.mobile} {
    .toolbar-search {
      order: 1;
    }
    
    .toolbar-filters {
      order: 2;
    }
    
    .toolbar-actions {
      order: 3;
      justify-self: stretch;
    }
  }
`;

const SearchInput = styled(Input)`
  width: 100%;
  max-width: 320px;
  
  ${mediaQueries.mobile} {
    max-width: none;
  }
`;

const FilterSelect = styled(Select)`
  min-width: 160px;
  
  ${mediaQueries.mobile} {
    width: 100%;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: var(--rescale-space-2);
  justify-content: flex-end;
  
  ${mediaQueries.mobile} {
    justify-content: stretch;
    
    .ant-btn {
      flex: 1;
    }
  }
`;

const ContentCard = styled(Card)`
  .ant-card-body {
    padding: 0;
  }
`;

export const ListPageTemplate: React.FC<ListPageTemplateProps> = ({
  children,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters,
  filterValue,
  onFilterChange,
  onRefresh,
  onCreate,
  createButtonText = 'Create New',
  searchLoading = false,
  refreshLoading = false,
  toolbarActions,
  showToolbar = true,
  containerProps = { maxWidth: 'xl', padded: true },
  ...pageHeaderProps
}) => {
  return (
    <MainLayout>
      <Container {...containerProps}>
        <Stack gap={6}>
          <PageHeader {...pageHeaderProps} />
          
          {showToolbar && (
            <ToolbarCard>
              <ToolbarGrid columns={12} gap={4}>
                <Col span={5} spanMobile={12} className="toolbar-search">
                  <SearchInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Col>
                
                {filters && filters.length > 0 && (
                  <Col span={3} spanMobile={6} className="toolbar-filters">
                    <FilterSelect
                      placeholder="Filter"
                      value={filterValue}
                      onChange={(value) => onFilterChange?.(value as string)}
                      options={filters}
                      allowClear
                      suffixIcon={<FilterOutlined />}
                    />
                  </Col>
                )}
                
                <Col 
                  span={filters ? 4 : 7} 
                  spanMobile={filters ? 6 : 12} 
                  className="toolbar-actions"
                >
                  <ActionsContainer>
                    {onRefresh && (
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={onRefresh}
                        loading={refreshLoading}
                      >
                        Refresh
                      </Button>
                    )}
                    
                    {toolbarActions}
                    
                    {onCreate && (
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onCreate}
                      >
                        {createButtonText}
                      </Button>
                    )}
                  </ActionsContainer>
                </Col>
              </ToolbarGrid>
            </ToolbarCard>
          )}
          
          <ContentCard>
            {children}
          </ContentCard>
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default ListPageTemplate;