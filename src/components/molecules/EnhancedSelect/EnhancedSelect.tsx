import React, { useState, useMemo } from 'react';
import { Select, Spin, Tag } from 'antd';
import type { SelectProps } from 'antd';

import styled from 'styled-components';
import { Icon } from '../../atoms/Icon';

interface SelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
  tags?: string[];
}

export interface EnhancedSelectProps extends Omit<SelectProps, 'options' | 'children' | 'filterOption'> {
  /** Select options */
  options: SelectOption[];
  /** Whether to enable search functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Whether to group options */
  groupBy?: boolean;
  /** Whether to show option descriptions */
  showDescriptions?: boolean;
  /** Whether to show option icons */
  showIcons?: boolean;
  /** Whether to show option tags */
  showTags?: boolean;
  /** Maximum number of selected items to show before showing count */
  maxTagCount?: number;
  /** Custom empty state */
  emptyText?: React.ReactNode;
  /** Whether options are loading */
  loading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Whether to highlight search matches */
  highlightSearch?: boolean;
  /** Custom filter function */
  filterOption?: (input: string, option: SelectOption) => boolean;
  /** Callback when search input changes */
  onSearch?: (value: string) => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border: 1px solid var(--rescale-color-gray-300);
    border-radius: var(--rescale-radius-base);
    transition: all var(--rescale-duration-normal);
    
    &:hover {
      border-color: var(--rescale-color-brand-blue);
    }
    
    &.ant-select-focused {
      border-color: var(--rescale-color-brand-blue);
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
    }
  }
  
  .ant-select-selection-search-input {
    font-family: var(--rescale-font-family);
    
    &::placeholder {
      color: var(--rescale-color-gray-500);
    }
  }
  
  .ant-select-selection-item {
    font-family: var(--rescale-font-family);
    color: var(--rescale-color-gray-900);
  }
  
  .ant-select-selection-placeholder {
    color: var(--rescale-color-gray-500);
    font-family: var(--rescale-font-family);
  }
  
  &.ant-select-disabled {
    .ant-select-selector {
      background: var(--rescale-color-gray-100);
      border-color: var(--rescale-color-gray-300);
      color: var(--rescale-color-gray-500);
    }
  }
`;


const CustomOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
  padding: var(--rescale-space-2) 0;
  
  .option-icon {
    flex-shrink: 0;
    font-size: var(--rescale-font-size-base);
    color: var(--rescale-color-gray-600);
  }
  
  .option-content {
    flex: 1;
    min-width: 0;
  }
  
  .option-label {
    font-size: var(--rescale-font-size-sm);
    color: var(--rescale-color-gray-900);
    font-weight: var(--rescale-font-weight-medium);
    display: flex;
    align-items: center;
    gap: var(--rescale-space-2);
  }
  
  .option-description {
    font-size: var(--rescale-font-size-xs);
    color: var(--rescale-color-gray-600);
    margin-top: 2px;
    line-height: var(--rescale-line-height-tight);
  }
  
  .option-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }
  
  .selected-indicator {
    flex-shrink: 0;
    color: var(--rescale-color-brand-blue);
    font-size: var(--rescale-font-size-sm);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--rescale-space-8) var(--rescale-space-4);
  color: var(--rescale-color-gray-500);
  
  .empty-icon {
    font-size: 32px;
    margin-bottom: var(--rescale-space-2);
    color: var(--rescale-color-gray-400);
  }
  
  .empty-text {
    font-size: var(--rescale-font-size-sm);
    text-align: center;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--rescale-space-4);
  gap: var(--rescale-space-2);
  color: var(--rescale-color-gray-600);
  
  .loading-text {
    font-size: var(--rescale-font-size-sm);
  }
`;

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  options,
  searchable = true,
  searchPlaceholder = 'Search options...',
  groupBy = false,
  showDescriptions = false,
  showIcons = false,
  showTags = false,
  maxTagCount = 3,
  emptyText,
  loading = false,
  loadingText = 'Loading options...',
  highlightSearch = true,
  filterOption,
  onSearch,
  className,
  style,
  value,
  mode,
  ...selectProps
}) => {
  const [searchValue, setSearchValue] = useState('');

  const defaultFilterOption = (input: string, option: SelectOption) => {
    const searchText = input.toLowerCase();
    const label = typeof option.label === 'string' ? option.label : option.value.toString();
    const description = option.description || '';
    const tags = option.tags?.join(' ') || '';
    
    return (
      label.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText) ||
      tags.toLowerCase().includes(searchText)
    );
  };

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    
    const filter = filterOption || defaultFilterOption;
    return options.filter(option => filter(searchValue, option));
  }, [options, searchValue, filterOption]);

  const groupedOptions = useMemo(() => {
    if (!groupBy) return filteredOptions;
    
    const groups: Record<string, SelectOption[]> = {};
    
    filteredOptions.forEach(option => {
      const group = option.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
    });
    
    return groups;
  }, [filteredOptions, groupBy]);

  const highlightSearchText = (text: string, search: string) => {
    if (!search || !highlightSearch) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} style={{ background: 'var(--rescale-color-light-blue)', color: 'var(--rescale-color-brand-blue)' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderOption = (option: SelectOption, isSelected: boolean = false) => {
    const label = typeof option.label === 'string' ? option.label : option.value.toString();
    
    return (
      <CustomOption>
        {showIcons && option.icon && (
          <div className="option-icon">{option.icon}</div>
        )}
        
        <div className="option-content">
          <div className="option-label">
            {highlightSearchText(label, searchValue)}
            {isSelected && <div className="selected-indicator"><Icon name="CheckOutlined" /></div>}
          </div>
          
          {showDescriptions && option.description && (
            <div className="option-description">
              {highlightSearchText(option.description, searchValue)}
            </div>
          )}
          
          {showTags && option.tags && option.tags.length > 0 && (
            <div className="option-tags">
              {option.tags.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </CustomOption>
    );
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch?.('');
  };

  const getSelectOptions = () => {
    if (loading) {
      return [
        {
          value: '__loading__',
          label: (
            <LoadingState>
              <Spin indicator={<Icon name="LoadingOutlined" />} />
              <span className="loading-text">{loadingText}</span>
            </LoadingState>
          ),
          disabled: true,
        },
      ];
    }

    if (filteredOptions.length === 0) {
      return [
        {
          value: '__empty__',
          label: emptyText || (
            <EmptyState>
              <Icon name="SearchOutlined" className />
              <div className="empty-text">
                {searchValue ? `No results found for "${searchValue}"` : 'No options available'}
              </div>
            </EmptyState>
          ),
          disabled: true,
        },
      ];
    }

    if (groupBy) {
      return Object.entries(groupedOptions).map(([group, groupOptions]) => ({
        label: group,
        options: groupOptions.map((option: SelectOption) => ({
          value: option.value,
          label: renderOption(option, Array.isArray(value) ? value.includes(option.value) : value === option.value),
          disabled: option.disabled,
        })),
      }));
    }

    return filteredOptions.map(option => ({
      value: option.value,
      label: renderOption(option, Array.isArray(value) ? value.includes(option.value) : value === option.value),
      disabled: option.disabled,
    }));
  };

  return (
    <StyledSelect
      {...selectProps}
      value={value}
      mode={mode}
      className={className}
      style={style}
      showSearch={searchable}
      placeholder={selectProps.placeholder}
      searchValue={searchable ? searchValue : undefined}
      onSearch={searchable ? handleSearch : undefined}
      onClear={handleClear}
      filterOption={false} // We handle filtering manually
      options={getSelectOptions()}
      maxTagCount={maxTagCount}
      allowClear
      suffixIcon={loading ? <Icon name="LoadingOutlined" /> : <Icon name="SearchOutlined" />}
      notFoundContent={null} // We handle empty state manually
    />
  );
};

export default EnhancedSelect;