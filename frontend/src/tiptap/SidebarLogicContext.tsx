import React, { createContext, useState, MouseEvent } from 'react';

export interface SidebarLogic {
  leftOpen: boolean;
  rightOpen: boolean;
  rightPanelContent: string | null;
  toggleSidebar: (e: MouseEvent) => void;
}

export const SidebarLogicContext = createContext<SidebarLogic>({
  leftOpen: true,
  rightOpen: false,
  rightPanelContent: null,
  toggleSidebar: () => {},
});

export const SidebarLogicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<string | null>(null);

  const toggleSidebar = (e: MouseEvent) => {
    const id = (e.currentTarget as HTMLElement).id;
    if (id === 'menu_icon_open') {
      setLeftOpen(!leftOpen);
    } else if (id === 'options_open') {
      setRightOpen(!rightOpen);
    }
  };

  return (
    <SidebarLogicContext.Provider value={{ leftOpen, rightOpen, rightPanelContent, toggleSidebar }}>
      {children}
    </SidebarLogicContext.Provider>
  );
};
