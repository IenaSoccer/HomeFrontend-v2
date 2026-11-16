import type { Attachment } from '@/contracts/Attachment';
import type { Folder } from '@/contracts/Folder';
import type { Resource } from '@/contracts/Resource';

type Searchable = Resource | Attachment | Folder;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function search<T extends Searchable>(blob: T[], query: string): T[] {
  const regExp = new RegExp(escapeRegExp(query), 'i');

  const check = (obj: Searchable): boolean => {
    if (obj === null || obj === undefined) return false;
    if (Array.isArray(obj)) return obj.some(check);
    if (typeof obj === 'object') return Object.values(obj).some(check);
    return (typeof obj === 'string' || typeof obj === 'number') && regExp.test(String(obj));
  };

  return blob.filter(check);
}

export const SearchEngine = search;
export type { Searchable };
