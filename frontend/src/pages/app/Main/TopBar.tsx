import React from 'react';
import { cn } from '../../../lib/utils';
import { ModeToggle } from '../LandingPage/ModeToggle';

export default function Topbar({
  collapsed,
  onExpand,
}: {
  collapsed: boolean;
  onExpand: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed top-0 h-12 flex items-center px-4 w-full bg-background dark:bg-[#1F1F1F] z-10',
        collapsed && 'pl-4'
      )}
      style={{ left: collapsed ? 0 : undefined }}
    >
      {collapsed && (
        <span></span>
      )}
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
