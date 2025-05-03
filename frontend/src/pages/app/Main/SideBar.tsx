// src/components/Sidebar.tsx
import React from 'react';
import { ChevronsLeft, Menu } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSidebar } from './useSideBar';

export default function Sidebar() {
  const {
    sidebarRef,
    contentRef,
    width,
    collapsed,
    animating,
    startResize,
    reset,
    collapse,
  } = useSidebar();

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width: collapsed ? 0 : width }}
        className={cn(
          'h-full bg-secondary overflow-y-auto relative flex flex-col z-20',
          animating && 'transition-all duration-300 ease-out'
        )}
      >
        {/* collapse button */}
        <button
          onClick={collapse}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronsLeft />
        </button>

        {/* your sidebar content */}
        <nav className="mt-12 px-4 space-y-4">
          {/* e.g. list of documents... */}
          <a href="/app/1" className="block hover:bg-accent p-2 rounded">Doc 1</a>
          <a href="/app/2" className="block hover:bg-accent p-2 rounded">Doc 2</a>
          {/* … */}
        </nav>

        {/* resize handle */}
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 h-full w-1 bg-primary/20 cursor-ew-resize group-hover:opacity-100 opacity-0 transition"
        />
      </aside>

      {/* content area starts to the right of the sidebar */}
      <div
        ref={contentRef}
        style={{
          marginLeft: collapsed ? 0 : width,
          width: collapsed ? '100%' : `calc(100% - ${width}px)`,
        }}
        className={cn(
          'absolute top-0 left-0 h-full overflow-y-auto',
          animating && 'transition-all duration-300 ease-out'
        )}
      />
    </>
  );
}
