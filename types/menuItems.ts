interface MenuItem {
  name: string;
  link: string;
  icon: string;
}

export interface MenuItems {
  name: string;
  link?: string;
  expanded?: boolean;
  icon: string;
  items?: MenuItem[];
}
