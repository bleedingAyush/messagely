import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface IDimensions {
  width: number;
  height: number;
}

const chatInboxSize = () => {
  if (window.innerWidth < 700) {
    return window.innerWidth;
  }
  const chatWidth = window.innerWidth - 320;

  const quarterWidth = (30 / 100) * window.innerWidth;

  const big = Math.max(quarterWidth, 300);
  if (big > 300) {
    const sub = big - 300;
    return chatWidth - sub;
  } else {
    return chatWidth;
  }
};
const useDimensions = () => {
  const quarterWidth = (30 / 100) * window.innerWidth;

  const big = Math.max(quarterWidth, 300);
  const [dimensions, setDimensions] = useState<IDimensions>({
    width: big,
    height: window.innerHeight - 125,
  });

  const [chatInboxWidth, setChatInboxWidth] = useState<any>(chatInboxSize());
  useEffect(() => {
    const chatInboxResize = () => {
      if (window.innerWidth < 700) {
        return setChatInboxWidth(window.innerWidth);
      }
      const chatWidth = window.innerWidth - 320;

      const quarterWidth = (30 / 100) * window.innerWidth;

      const big = Math.max(quarterWidth, 300);
      if (big > 300) {
        const sub = big - 300;
        setChatInboxWidth(chatWidth - sub);
      } else {
        setChatInboxWidth(chatWidth);
      }
    };
    const handleResize = () => {
      chatInboxResize();
      const quarterWidth = (30 / 100) * window.innerWidth;

      const big = Math.max(quarterWidth, 300);
      if (window.innerWidth < 700) {
        setDimensions({
          ...dimensions,
          width: window.innerWidth - 25,
          height: window.innerHeight - 130,
        });
      } else {
        setDimensions({
          ...dimensions,
          width: big,
          height: window.innerHeight - 125,
        });
      }
    };
    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return { dimensions: dimensions, chatInboxWidth: chatInboxWidth };
};

export default useDimensions;
