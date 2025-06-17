import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="h-16 w-16 border-4 border-[#804595] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
