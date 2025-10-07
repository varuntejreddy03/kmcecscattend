import { useState, useEffect, useMemo } from 'react';

export default function VirtualizedList({ 
  items, 
  renderItem, 
  itemHeight = 100, 
  containerHeight = 400,
  searchTerm = '',
  filterFn = null 
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  // Filter and search items
  const filteredItems = useMemo(() => {
    let filtered = items;
    
    if (filterFn) {
      filtered = filtered.filter(filterFn);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hallticket?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [items, searchTerm, filterFn]);

  // Calculate visible items
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      filteredItems.length
    );
    
    return {
      startIndex,
      endIndex,
      items: filteredItems.slice(startIndex, endIndex)
    };
  }, [filteredItems, scrollTop, itemHeight, containerHeight]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const totalHeight = filteredItems.length * itemHeight;
  const offsetY = visibleItems.startIndex * itemHeight;

  return (
    <div
      ref={setContainerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.items.map((item, index) =>
            renderItem(item, visibleItems.startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}