"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Selection = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
} | null;

type ActiveTab = "selected" | "my-pixels" | "leaderboard";

interface SidebarContextValue {
  selection: Selection;
  setSelection: (selection: Selection) => void;
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
  initialSelection?: Selection;
}

export function SidebarProvider({
  children,
  initialSelection = null,
}: SidebarProviderProps) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [activeTab, setActiveTab] = useState<ActiveTab>("selected");

  // Sync with external selection changes
  useEffect(() => {
    setSelection(initialSelection);
  }, [initialSelection]);

  return (
    <SidebarContext.Provider
      value={{
        selection,
        setSelection,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
