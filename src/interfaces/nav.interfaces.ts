import type { ComponentType } from "svelte";

interface SidebarItemType {
  key: string;
  route: string;
  icon: ComponentType;
  roleAccess: number[];
  subMenu: SidebarItemType[];
  label: string;
  isClickable: boolean;
}

export type { SidebarItemType };
