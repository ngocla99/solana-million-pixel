"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ActiveTab = "selected" | "my-pixels" | "leaderboard";

interface SidebarContextValue {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("selected");

  return (
    <SidebarContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
