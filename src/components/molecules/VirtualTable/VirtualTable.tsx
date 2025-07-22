import React, { useMemo, useCallback, forwardRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
// import { Table, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';

export interface VirtualTableProps<T = any> {
  /** Height of the virtual table container */
  height: number;
  /** Estimated row height for virtual scrolling */
  estimateRowHeight?: number;
  /** Data source for the table */
  dataSource: T[];
  /** Table columns configuration */
  columns: ColumnsType<T>;
  /** Callback for when more data should be loaded */
  onLoadMore?: () => void;
  /** Whether more data is being loaded */
  loading?: boolean;
  /** Buffer size for virtual scrolling (default: 5) */
  overscan?: number;
  /** Whether to enable infinite scrolling */
  infiniteScroll?: boolean;
  /** Custom row key extractor */
  getRowKey?: (record: T, index: number) => React.Key;
}

const VirtualContainer = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  overflow: auto;
  
  .ant-table-tbody {
    position: relative;
  }
  
  .virtual-row {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
  }
`;

const VirtualRow = styled.div<{ index: number; height: number; transform: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => height}px;
  transform: ${({ transform }) => transform};
  display: flex;
  align-items: center;
`;

/**
 * VirtualTable - High-performance table with virtual scrolling
 * 
 * @example
 * ```tsx
 * <VirtualTable
 *   height={400}
 *   dataSource={largeDataset}
 *   columns={columns}
 *   estimateRowHeight={50}
 *   onLoadMore={() => loadMoreData()}
 *   infiniteScroll={true}
 * />
 * ```
 */
export const VirtualTable = React.memo(forwardRef<HTMLDivElement, VirtualTableProps>(({
  height,
  estimateRowHeight = 50,
  dataSource,
  columns,
  onLoadMore,
  loading = false,
  overscan = 5,
  infiniteScroll = false,
  getRowKey,
  ...tableProps
}, ref) => {
  // Parent ref for virtual scrolling
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Combine external ref with internal ref
  React.useImperativeHandle(ref, () => parentRef.current!, []);

  // Create virtualizer
  const virtualizer = useVirtualizer({
    count: dataSource.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
  });

  // Get virtual items
  const virtualItems = virtualizer.getVirtualItems();

  // Handle infinite scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!infiniteScroll || !onLoadMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight * 0.8;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [infiniteScroll, onLoadMore, loading]);

  // Memoize row key extraction
  const extractRowKey = useCallback((record: any, index: number) => {
    if (getRowKey) {
      return getRowKey(record, index);
    }
    return record.id || record.key || index;
  }, [getRowKey]);

  // Create virtual rows
  const virtualRows = useMemo(() => {
    return virtualItems.map((virtualItem) => {
      const record = dataSource[virtualItem.index];
      if (!record) return null;

      const key = extractRowKey(record, virtualItem.index);

      return (
        <VirtualRow
          key={key}
          index={virtualItem.index}
          height={virtualItem.size}
          transform={`translateY(${virtualItem.start}px)`}
        >
          <TableRowContent
            record={record}
            columns={columns}
            index={virtualItem.index}
          />
        </VirtualRow>
      );
    }).filter(Boolean);
  }, [virtualItems, dataSource, columns, extractRowKey]);

  return (
    <VirtualContainer 
      ref={parentRef}
      height={height}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualRows}
      </div>
      
      {loading && infiniteScroll && (
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}>
          Loading more data...
        </div>
      )}
    </VirtualContainer>
  );
}));

VirtualTable.displayName = 'VirtualTable';

// Helper component for rendering table row content
interface TableRowContentProps {
  record: any;
  columns: ColumnsType<any>;
  index: number;
}

const RowContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background-color: #fafafa;
  }
`;

const CellContainer = styled.div<{ width?: number | string }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  min-height: 50px;
  ${({ width }) => width && `
    width: ${typeof width === 'number' ? `${width}px` : width};
    flex-shrink: 0;
  `}
`;

const TableRowContent: React.FC<TableRowContentProps> = React.memo(({
  record,
  columns,
  index,
}) => {
  return (
    <RowContainer>
      {columns.map((column, colIndex) => {
        const key = column.key || column.dataIndex || colIndex;
        const content = column.render
          ? column.render(
              column.dataIndex ? record[column.dataIndex as string] : record,
              record,
              index
            )
          : column.dataIndex
          ? record[column.dataIndex as string]
          : '';

        return (
          <CellContainer key={key} width={column.width}>
            {content}
          </CellContainer>
        );
      })}
    </RowContainer>
  );
});

TableRowContent.displayName = 'TableRowContent';

export default VirtualTable;