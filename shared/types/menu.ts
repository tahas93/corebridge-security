export interface MenuItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  parentId?: string | null;
  order: number;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  key: string;
  name: string;
  items: MenuItem[];
}
