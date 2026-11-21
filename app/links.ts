// app/links.ts
export interface LinkItem {
  label: string;
  href: string;
}

// External links to the author's personal site, kept concise for single-line layout.
export const footerLinks: LinkItem[] = [
  { label: 'Personal Page', href: 'https://www.louisvolant.com' },
  { label: 'Portfolio', href: 'https://www.louisvolant.com/portfolio' },
];
