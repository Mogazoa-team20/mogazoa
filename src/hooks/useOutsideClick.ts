import { RefObject, useEffect } from "react";

const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleOutSectionClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callback();
    };

    document.addEventListener("click", handleOutSectionClick);

    return () => document.removeEventListener("click", handleOutSectionClick);
  }, [ref, callback]);
};

export default useOutsideClick;
