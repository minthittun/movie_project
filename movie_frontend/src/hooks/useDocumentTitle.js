import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    const defaultTitle = "MovieStream";
    const newTitle = title ? `${title} - CineDex` : defaultTitle;
    document.title = newTitle;

    return () => {
      document.title = defaultTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
