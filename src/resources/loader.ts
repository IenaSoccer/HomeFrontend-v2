import type { AxiosResponse } from 'axios';
import type { Alert } from 'src/contracts/Alert';
import type { ApiResponse } from 'src/contracts/ApiResponse';
import type { Attachment } from 'src/contracts/Attachment';
import type { Folder } from 'src/contracts/Folder';
import type { Mappings } from 'src/contracts/Mappings';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';
import { useResourceStore } from 'src/stores/Resources';

type ResourceStore = ReturnType<typeof useResourceStore>;
type Extractable =
  | Attachment
  | Folder
  | Folder[]
  | Resource<UUID, UUID[]>
  | Resource<UUID, UUID[]>[]
  | Alert[]
  | Mappings;

const extractBody = <T extends Extractable>(response: AxiosResponse<ApiResponse>): T => {
  return response.data.body.content as T;
};
const extract = async (ids: UUID[], store: ResourceStore): Promise<Attachment[]> =>
  Promise.all(
    ids.map(async (fid) => {
      const resource = await store.extract(fid);
      return {
        id: resource.id,
        fid,
        data: resource.data,
      };
    }),
  );

const loadResource = async (fid: UUID, store: ResourceStore) => store.fetch(fid);
const fetchResource = async (rid: UUID, store: ResourceStore) => store.fetchResource(rid);

const extractThumbnails = async (
  thumbs: UUID | UUID[],
  store: ResourceStore,
): Promise<Attachment[]> => extract(Array.isArray(thumbs) ? thumbs : [thumbs], store);

function isUUIDArray(r: Resource<UUID, UUID[] | string>): r is Resource<UUID, UUID[]> {
  return r.content.type === 0;
}

async function downloadAttachments<T extends UUID[] | string>(
  r: Resource<UUID, T>,
): Promise<Resource<Attachment, Attachment[] | string>> {
  const store = useResourceStore();
  const thumbnail = (await extractThumbnails(r.thumbnail as UUID, store))[0]!;

  if (isUUIDArray(r)) {
    const attachments = await extractThumbnails(r.content.data, store);
    return {
      ...r,
      content: { ...r.content, data: attachments },
      thumbnail,
    };
  }

  return {
    ...r,
    content: {
      ...r.content,
      data: r.content.data as string,
    },
    thumbnail,
  };
}

export { extractBody, loadResource, extractThumbnails, downloadAttachments, fetchResource };
