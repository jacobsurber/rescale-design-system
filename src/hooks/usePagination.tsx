// =============================================================================
// Pagination Hook
// =============================================================================

import React, { useState, useMemo, useCallback } from 'react';

export interface PaginationOptions {
  /** Total number of items */
  totalItems: number;
  /** Items per page (default: 20) */
  itemsPerPage?: number;
  /** Initial page (default: 1) */
  initialPage?: number;
  /** Maximum pages to show in pagination controls */
  maxPages?: number;
}

export interface PaginationState {
  /** Current page (1-based) */
  currentPage: number;
  /** Items per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Start index for current page (0-based) */
  startIndex: number;
  /** End index for current page (0-based, exclusive) */
  endIndex: number;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Page numbers to show in pagination controls */
  visiblePages: number[];
}

export interface PaginationActions {
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  goToNext: () => void;
  /** Go to previous page */
  goToPrevious: () => void;
  /** Go to first page */
  goToFirst: () => void;
  /** Go to last page */
  goToLast: () => void;
  /** Change items per page */
  setItemsPerPage: (itemsPerPage: number) => void;
}

export interface UsePaginationReturn extends PaginationState, PaginationActions {}

/**
 * Hook for managing pagination state and actions
 */
export const usePagination = ({
  totalItems,
  itemsPerPage = 20,
  initialPage = 1,
  maxPages = 7,
}: PaginationOptions): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  const paginationState = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPageState);
    const startIndex = (currentPage - 1) * itemsPerPageState;
    const endIndex = Math.min(startIndex + itemsPerPageState, totalItems);
    
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    // Calculate visible pages
    const visiblePages: number[] = [];
    if (totalPages <= maxPages) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Calculate range around current page
      const halfMax = Math.floor(maxPages / 2);
      let startPage = Math.max(1, currentPage - halfMax);
      let endPage = Math.min(totalPages, startPage + maxPages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }

    return {
      currentPage,
      itemsPerPage: itemsPerPageState,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasPrevious,
      hasNext,
      visiblePages,
    };
  }, [currentPage, itemsPerPageState, totalItems, maxPages]);

  const actions = useMemo(() => ({
    goToPage: useCallback((page: number) => {
      if (page >= 1 && page <= paginationState.totalPages) {
        setCurrentPage(page);
      }
    }, [paginationState.totalPages]),

    goToNext: useCallback(() => {
      if (paginationState.hasNext) {
        setCurrentPage(prev => prev + 1);
      }
    }, [paginationState.hasNext]),

    goToPrevious: useCallback(() => {
      if (paginationState.hasPrevious) {
        setCurrentPage(prev => prev - 1);
      }
    }, [paginationState.hasPrevious]),

    goToFirst: useCallback(() => {
      setCurrentPage(1);
    }, []),

    goToLast: useCallback(() => {
      setCurrentPage(paginationState.totalPages);
    }, [paginationState.totalPages]),

    setItemsPerPage: useCallback((newItemsPerPage: number) => {
      setItemsPerPageState(newItemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    }, []),
  }), [paginationState]);

  return {
    ...paginationState,
    ...actions,
  };
};

// =============================================================================
// Infinite Scroll Hook
// =============================================================================

export interface InfiniteScrollOptions {
  /** Function to load more data */
  loadMore: () => Promise<void> | void;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading?: boolean;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
  /** Disabled infinite scroll */
  disabled?: boolean;
}

/**
 * Hook for infinite scrolling functionality
 */
export const useInfiniteScroll = ({
  loadMore,
  hasMore,
  isLoading = false,
  rootMargin = '100px',
  threshold = 0.1,
  disabled = false,
}: InfiniteScrollOptions) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || isLoading || !hasMore || disabled) return;

    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [loadMore, hasMore, isLoading, isLoadingMore, disabled]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, isLoading, isLoadingMore, rootMargin, threshold, disabled]);

  return {
    sentinelRef,
    isLoadingMore,
    loadMore: handleLoadMore,
  };
};

// =============================================================================
// Combined Pagination + Infinite Scroll Hook
// =============================================================================

export interface HybridScrollOptions extends PaginationOptions {
  /** Enable infinite scroll mode */
  infiniteScroll?: boolean;
  /** Load more function for infinite scroll */
  loadMore?: () => Promise<void> | void;
  /** Whether there are more items for infinite scroll */
  hasMoreInfinite?: boolean;
  /** Currently loading more items */
  isLoadingMore?: boolean;
}

/**
 * Hook that combines pagination and infinite scroll
 * Can switch between modes dynamically
 */
export const useHybridScroll = ({
  totalItems,
  itemsPerPage = 20,
  initialPage = 1,
  maxPages = 7,
  infiniteScroll = false,
  loadMore,
  hasMoreInfinite = false,
  isLoadingMore = false,
}: HybridScrollOptions) => {
  const pagination = usePagination({
    totalItems,
    itemsPerPage,
    initialPage,
    maxPages,
  });

  const infiniteScrollHook = useInfiniteScroll({
    loadMore: loadMore || (() => {}),
    hasMore: hasMoreInfinite,
    isLoading: isLoadingMore,
    disabled: !infiniteScroll,
  });

  return {
    mode: infiniteScroll ? 'infinite' : 'pagination' as const,
    pagination,
    infiniteScroll: infiniteScrollHook,
    // Helper to get current page items for pagination mode
    getCurrentPageItems: useCallback(<T>(items: T[]) => {
      if (infiniteScroll) return items;
      return items.slice(pagination.startIndex, pagination.endIndex);
    }, [infiniteScroll, pagination.startIndex, pagination.endIndex]),
  };
};