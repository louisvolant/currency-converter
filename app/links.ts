// src/app/links.ts
export interface LinkItem {
  label: string;
  href: string;
}

// Footer links. Kept intentionally short so the footer fits on a single line.
export const footerLinks: LinkItem[] = [
  { label: 'Page personnelle', href: 'https://www.louisvolant.com' },
  { label: 'Portfolio', href: 'https://www.louisvolant.com/portfolio' },
];
