import type { Attachment } from './Attachment';
import type { ResourceAttributes, ResourceData } from './Types';
import type { UUID } from './UUID';

interface Resource<T = UUID | Attachment, D extends T[] | string = T[]> {
  id: UUID;
  name: string;
  description: string;
  thumbnail: UUID | Attachment;
  content: ResourceData<D>;
  attributes: ResourceAttributes;
  fid: UUID;
  created_at: Date;
  updated_at: Date;
  slug?: string;
}

export type { Resource };
