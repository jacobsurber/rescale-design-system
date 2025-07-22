import React, { useState } from 'react';
import { Avatar, Tooltip, Button, Popover } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export interface SoftwareItem {
  /** Unique identifier */
  id: string;
  /** Software name */
  name: string;
  /** Logo URL or React node */
  logo?: string | React.ReactNode;
  /** Software version */
  version?: string;
  /** Software description */
  description?: string;
  /** Category (e.g., 'CAD', 'CFD', 'FEA') */
  category?: string;
  /** Whether this software is featured */
  featured?: boolean;
}

export interface SoftwareLogoGridProps {
  /** Array of software items to display */
  items: SoftwareItem[];
  /** Maximum number of logos to show before "+X More" */
  maxVisible?: number;
  /** Size of the logos */
  size?: 'small' | 'default' | 'large';
  /** Whether to show software names below logos */
  showNames?: boolean;
  /** Whether logos should be clickable */
  clickable?: boolean;
  /** Click handler for individual software items */
  onItemClick?: (item: SoftwareItem) => void;
  /** Click handler for "+X More" button */
  onShowMore?: () => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const GridContainer = styled.div<{ $size: string }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => {
    switch (props.$size) {
      case 'small': return 'var(--rescale-space-2)';
      case 'large': return 'var(--rescale-space-4)';
      default: return 'var(--rescale-space-3)';
    }
  }};
  align-items: center;
`;

const SoftwareItem = styled.div<{ 
  $size: string; 
  $clickable: boolean; 
  $showNames: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--rescale-space-1);
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  padding: ${props => {
    if (props.$showNames) {
      switch (props.$size) {
        case 'small': return 'var(--rescale-space-1)';
        case 'large': return 'var(--rescale-space-3)';
        default: return 'var(--rescale-space-2)';
      }
    }
    return '0';
  }};
  border-radius: var(--rescale-radius-base);
  transition: all var(--rescale-duration-fast) var(--rescale-easing-ease-in-out);
  
  &:hover {
    ${props => props.$clickable && `
      background: var(--rescale-color-gray-100);
      transform: translateY(-1px);
    `}
  }
`;

const SoftwareLogo = styled(Avatar)<{ $size: string }>`
  flex-shrink: 0;
  border: 1px solid var(--rescale-color-gray-300);
  
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          width: 32px !important;
          height: 32px !important;
          font-size: 14px;
        `;
      case 'large':
        return `
          width: 56px !important;
          height: 56px !important;
          font-size: 20px;
        `;
      default:
        return `
          width: 40px !important;
          height: 40px !important;
          font-size: 16px;
        `;
    }
  }}
  
  .ant-avatar-string {
    font-weight: var(--rescale-font-weight-semibold);
  }
`;

const SoftwareName = styled.span<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '10px';
      case 'large': return 'var(--rescale-font-size-sm)';
      default: return 'var(--rescale-font-size-xs)';
    }
  }};
  color: var(--rescale-color-gray-700);
  text-align: center;
  max-width: ${props => {
    switch (props.$size) {
      case 'small': return '40px';
      case 'large': return '72px';
      default: return '56px';
    }
  }};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--rescale-font-weight-medium);
`;

const MoreButton = styled(Button)<{ $size: string }>`
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          width: 32px;
          height: 32px;
          font-size: 12px;
        `;
      case 'large':
        return `
          width: 56px;
          height: 56px;
          font-size: 16px;
        `;
      default:
        return `
          width: 40px;
          height: 40px;
          font-size: 14px;
        `;
    }
  }}
  
  border-radius: 50%;
  border: 2px dashed var(--rescale-color-gray-400);
  background: var(--rescale-color-gray-50);
  color: var(--rescale-color-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover,
  &:focus {
    border-color: var(--rescale-color-brand-blue);
    color: var(--rescale-color-brand-blue);
    background: var(--rescale-color-light-blue);
  }
`;

const MoreCount = styled.span<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '10px';
      case 'large': return 'var(--rescale-font-size-xs)';
      default: return '11px';
    }
  }};
  font-weight: var(--rescale-font-weight-semibold);
  margin-top: 2px;
`;

const PopoverContent = styled.div`
  max-width: 280px;
`;

const PopoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--rescale-space-3);
  margin-bottom: var(--rescale-space-3);
`;

const PopoverItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--rescale-space-1);
  padding: var(--rescale-space-2);
  border-radius: var(--rescale-radius-base);
  cursor: pointer;
  transition: background var(--rescale-duration-fast);
  
  &:hover {
    background: var(--rescale-color-gray-100);
  }
`;

const PopoverItemName = styled.span`
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-700);
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SoftwareLogoGrid: React.FC<SoftwareLogoGridProps> = ({
  items,
  maxVisible = 6,
  size = 'default',
  showNames = false,
  clickable = true,
  onItemClick,
  onShowMore,
  className,
  style,
}) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  
  const visibleItems = items.slice(0, maxVisible);
  const remainingItems = items.slice(maxVisible);
  const hasMore = remainingItems.length > 0;

  const handleItemClick = (item: SoftwareItem) => {
    if (clickable && onItemClick) {
      onItemClick(item);
    }
  };

  const handleMoreClick = () => {
    if (onShowMore) {
      onShowMore();
    } else {
      setPopoverVisible(!popoverVisible);
    }
  };

  const renderSoftwareItem = (item: SoftwareItem, index: number) => {
    const logoContent = typeof item.logo === 'string' ? (
      <SoftwareLogo
        $size={size}
        src={item.logo}
        alt={item.name}
      />
    ) : item.logo ? (
      <SoftwareLogo $size={size}>
        {item.logo}
      </SoftwareLogo>
    ) : (
      <SoftwareLogo $size={size}>
        {item.name.charAt(0).toUpperCase()}
      </SoftwareLogo>
    );

    const content = (
      <SoftwareItem
        key={item.id}
        $size={size}
        $clickable={clickable}
        $showNames={showNames}
        onClick={() => handleItemClick(item)}
      >
        {logoContent}
        {showNames && (
          <SoftwareName $size={size}>
            {item.name}
          </SoftwareName>
        )}
      </SoftwareItem>
    );

    if (clickable && (item.description || item.version)) {
      const tooltipTitle = (
        <div>
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          {item.version && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Version {item.version}
            </div>
          )}
          {item.description && (
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              {item.description}
            </div>
          )}
          {item.category && (
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              Category: {item.category}
            </div>
          )}
        </div>
      );

      return (
        <Tooltip key={item.id} title={tooltipTitle} placement="top">
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  const morePopoverContent = (
    <PopoverContent>
      <PopoverGrid>
        {remainingItems.map((item) => (
          <PopoverItem
            key={item.id}
            onClick={() => {
              handleItemClick(item);
              setPopoverVisible(false);
            }}
          >
            {typeof item.logo === 'string' ? (
              <Avatar size={32} src={item.logo} alt={item.name} />
            ) : item.logo ? (
              <Avatar size={32}>{item.logo}</Avatar>
            ) : (
              <Avatar size={32}>{item.name.charAt(0).toUpperCase()}</Avatar>
            )}
            <PopoverItemName>{item.name}</PopoverItemName>
          </PopoverItem>
        ))}
      </PopoverGrid>
    </PopoverContent>
  );

  return (
    <GridContainer $size={size} className={className} style={style}>
      {visibleItems.map((item, index) => renderSoftwareItem(item, index))}
      
      {hasMore && (
        <div>
          {onShowMore ? (
            <MoreButton
              $size={size}
              type="text"
              onClick={handleMoreClick}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PlusOutlined />
                <MoreCount $size={size}>{remainingItems.length}</MoreCount>
              </div>
            </MoreButton>
          ) : (
            <Popover
              content={morePopoverContent}
              title={`+${remainingItems.length} More Software`}
              trigger="click"
              open={popoverVisible}
              onOpenChange={setPopoverVisible}
              placement="bottomLeft"
            >
              <MoreButton
                $size={size}
                type="text"
                onClick={handleMoreClick}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PlusOutlined />
                  <MoreCount $size={size}>{remainingItems.length}</MoreCount>
                </div>
              </MoreButton>
            </Popover>
          )}
        </div>
      )}
    </GridContainer>
  );
};

export default SoftwareLogoGrid;