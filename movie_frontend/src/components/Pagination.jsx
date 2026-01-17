import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  // Calculate page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  return (
    <div className="pagination">
      <button 
        className="pagination-btn pagination-prev" 
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
      >
        ← Previous
      </button>
      
      <div className="pagination-pages">
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
            disabled={loading}
          >
            {pageNum}
          </button>
        ))}
      </div>
      
      <button 
        className="pagination-btn pagination-next" 
        onClick={handleNext}
        disabled={currentPage === totalPages || loading}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;