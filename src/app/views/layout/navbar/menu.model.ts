
export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  subMenus?: SubMenus[];
  isMegaMenu?: boolean;
  roles?: string[];
}

export interface SubMenus {
  subMenuItems?: SubMenuItems[],
  roles?: string[];
}

export interface SubMenuItems {
  label?: string;
  link?: string;
  isTitle?: boolean;
  badge?: Badge;
  roles?: string[];
}

export interface Badge {
  variant?: string;
  text?: string
}