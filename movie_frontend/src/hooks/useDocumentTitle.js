import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    const defaultTitle = 'MovieStream';
    const newTitle = title ? `${title} - MovieStream` : defaultTitle;
    document.title = newTitle;
    
    return () => {
      document.title = defaultTitle;
    };
  }, [title]);
};

export default useDocumentTitle;