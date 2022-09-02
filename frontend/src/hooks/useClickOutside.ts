import React, { useEffect, useRef } from "react";

const useClickOutside = (handler: any) => {
  const domNode: React.MutableRefObject<any> = useRef();

  useEffect(() => {
    const eventHandler = (event: MouseEvent) => {
      if (!domNode.current?.contains(event.target)) handler();
    };
    document.addEventListener("mousedown", eventHandler);
    return () => {
      document.removeEventListener("mousedown", eventHandler);
    };
  });
  return domNode;
};

export default useClickOutside;
