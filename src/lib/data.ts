export type Doc = {
  title: string;
  category?: string;
  description?: string;
  meta?: string;
  file: string;
  icon?: string;
  color?: string;
  order?: number;
  visible?: boolean;
  points?: string[];
};

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function asset(path: string): string {
  if (!path) return base || '/';
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\.\//, '/');
  return `${base}${clean.startsWith('/') ? clean : `/${clean}`}`;
}

export function visibleDocs(items: Doc[]): Doc[] {
  return items
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export const year = (label: string) => label.replace(/(\d{4})-(\d{4})/g, '$1–$2');
