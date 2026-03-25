interface NavItem {
  title: string;
  caption: string;
  icon?: string;
  link: string;
  slug?: string;
  divider?: boolean;
  classes?: string;
  title_classes?: string;
  nav_hidden?: boolean;
  embedded?: boolean;
}

interface FooterLink {
    title: string;
    caption: string;
    link: string;
}

interface FooterLinks {
  [section: string]: FooterLink[];
}

interface Links {
  header: NavItem[];
  footer: FooterLinks;
}

export type { NavItem, FooterLinks, FooterLink, Links };