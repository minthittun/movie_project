import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error">
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;