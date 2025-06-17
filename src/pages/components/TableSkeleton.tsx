import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex bg-gray-100 p-3 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`header-${index}`} className="h-5 bg-gray-200 rounded flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex p-4 gap-4 border-b border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="h-4 bg-gray-50 rounded flex-1 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
};
