import type { Alert } from './Alert';
import type { Attachment } from './Attachment';
import type { Folder } from './Folder';
import type { Resource } from './Resource';
import type { UUID } from './UUID';

interface ApiResponse {
  header: string;
  body: {
    code: number;
    content: Resource<UUID> | Resource<UUID>[] | Folder[] | Folder | Alert[] | Attachment;
    message: string;
  };
}

export type { ApiResponse };
