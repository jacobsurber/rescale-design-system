import React, { useState } from 'react';
import { Tooltip, Button, Popover } from 'antd';

import styled from 'styled-components';
import { Logo } from '../../atoms/Logo';
import type { LogoSize } from '../../atoms/Logo';
import { Icon } from '../../atoms/Icon';

export interface SoftwareItem {
  /** Unique identifier */
  id: string;
  /** Software name */
  name: string;
  /** Logo URL or React node */
  logo?: string | React.ReactNode;
  /** Software identifier for automatic logo mapping */
  software?: string;
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

// Map grid sizes to Logo component sizes
const sizeMapping: Record<string, LogoSize> = {
  small: 'sm',
  default: 'md', 
  large: 'lg',
};

const GridContainer = styled.div<{ $size: string }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => {
    switch (props.$size) {
      case 'small': return '8px';
      case 'large': return '16px';
      default: return '12px';
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
  gap: 4px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  padding: ${props => {
    if (props.$showNames) {
      switch (props.$size) {
        case 'small': return '4px';
        case 'large': return '12px';
        default: return '8px';
      }
    }
    return '0';
  }};
  border-radius: 4px;
  transition: all 150ms ease-in-out;
  
  &:hover {
    ${props => props.$clickable && `
      background: #f5f6f7;
      transform: translateY(-1px);
    `}
  }
`;

const SoftwareName = styled.span<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '10px';
      case 'large': return '14px';
      default: return '12px';
    }
  }};
  color: #434343;
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
  font-weight: 500;
`;

const MoreButton = styled(Button)<{ $size: string }>`
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          width: 24px;
          height: 24px;
          font-size: 12px;
        `;
      case 'large':
        return `
          width: 48px;
          height: 48px;
          font-size: 16px;
        `;
      default:
        return `
          width: 32px;
          height: 32px;
          font-size: 14px;
        `;
    }
  }}
  
  border-radius: 50%;
  border: 2px dashed #BFBFBF;
  background: #FAFAFA;
  color: #595959;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover,
  &:focus {
    border-color: #0272c3;
    color: #0272c3;
    background: #f3f7ff;
  }
`;

const MoreCount = styled.span<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '10px';
      case 'large': return '12px';
      default: return '11px';
    }
  }};
  font-weight: 600;
  margin-top: 2px;
`;

const PopoverContent = styled.div`
  max-width: 280px;
`;

const PopoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 12px;
`;

const PopoverItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 150ms;
  
  &:hover {
    background: #f5f6f7;
  }
`;

const PopoverItemName = styled.span`
  font-size: 12px;
  color: #434343;
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
    const logoSize = sizeMapping[size];
    
    const logoContent = (
      <Logo
        src={typeof item.logo === 'string' ? item.logo : undefined}
        software={item.software}
        alt={item.name}
        size={logoSize}
        clickable={clickable}
        fallback={
          item.logo && typeof item.logo !== 'string' ? (
            item.logo
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              color: '#666',
              fontSize: logoSize === 'sm' ? '12px' : logoSize === 'lg' ? '18px' : '14px',
              fontWeight: 600
            }}>
              {item.name.charAt(0).toUpperCase()}
            </div>
          )
        }
      />
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
            <Logo
              src={typeof item.logo === 'string' ? item.logo : undefined}
              software={item.software}
              alt={item.name}
              size="sm"
              clickable={false}
              fallback={
                item.logo && typeof item.logo !== 'string' ? (
                  item.logo
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )
              }
            />
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
                <Icon name="PlusOutlined" />
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
                  <Icon name="PlusOutlined" />
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