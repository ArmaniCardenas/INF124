import { useEffect, useRef, useState } from 'react';

export function useSidebar(
  defaultWidth = 240,
  minWidth = 224,
  maxWidth = 480
) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const [width, setWidth] = useState(defaultWidth);
  const [collapsed, setCollapsed] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isResizing.current) return;
      let newW = e.clientX;
      newW = Math.max(minWidth, Math.min(maxWidth, newW));
      setWidth(newW);
    }
    function onMouseUp() {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    if (isResizing.current) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [minWidth, maxWidth]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const reset = () => {
    setAnimating(true);
    setCollapsed(false);
    setWidth(defaultWidth);
    setTimeout(() => setAnimating(false), 300);
  };

  const collapse = () => {
    setAnimating(true);
    setCollapsed(true);
    setTimeout(() => setAnimating(false), 300);
  };

  return {
    sidebarRef,
    contentRef,
    width,
    collapsed,
    animating,
    startResize,
    reset,
    collapse,
  };
}
