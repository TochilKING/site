export type Doc = {
  title: string;
  category?: string;
  description?: string;
  meta?: string;
  file: string;
  thumbnail?: string;
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

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}
