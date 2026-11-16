import { defineStore } from 'pinia';
import { extractBody } from '@/resources/loader';
import type { AxiosResponse } from 'axios';
import type { Resource } from '@/contracts/Resource';
import type { Folder } from '@/contracts/Folder';
import type { Attachment } from '@/contracts/Attachment';
import type { UUID } from '@/contracts/UUID';
import type { ApiResponse } from '@/contracts/ApiResponse';
import api from '@/utils/api';

interface ResourceState {
  _searchable: Resource[];
  _names: Record<UUID, string>;
}

let pendingContent: Promise<Resource[]> | null = null;

export const useResourceStore = defineStore('resource', {
  state: (): ResourceState => ({
    _searchable: [],
    _names: {},
  }),

  actions: {
    async getContent(): Promise<Resource[]> {
      if (this._searchable.length > 0) return this._searchable;

      pendingContent ??= (async () => {
        this._names = await this.list();

        const resources = await Promise.all(
          Object.keys(this._names).map(async (fid) => {
            try {
              return await this.fetch(fid);
            } catch {
              return [] as Resource<UUID, UUID[] | string>[];
            }
          }),
        );

        this._searchable = resources.flat() as Resource[];

        return this._searchable;
      })().finally(() => {
        pendingContent = null;
      });

      return pendingContent;
    },

    async list(): Promise<Record<UUID, string>> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/folders`);
      return extractBody<Record<UUID, string>>(response);
    },

    async listWithHash(hash: string): Promise<Folder> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/folders/list/${hash}`);
      return extractBody<Folder>(response);
    },

    async fetch(uuid: string): Promise<Resource<UUID, UUID[] | string>[]> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/folders/${uuid}`);
      return extractBody<Resource<UUID>[]>(response);
    },

    async fetchPreview(uuid: UUID): Promise<Resource<UUID>> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/resources/preview/${uuid}`);
      return extractBody<Resource<UUID>>(response);
    },

    async fetchWithHash(uuid: UUID, hash: string): Promise<Resource<UUID>[]> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/folders/${uuid}/${hash}`);
      return extractBody<Resource<UUID>[]>(response);
    },

    async fetchResource(uuid: UUID): Promise<Resource<UUID>> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/resources/${uuid}`);
      return extractBody<Resource<UUID>>(response);
    },

    async extract(uuid: UUID): Promise<Attachment> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/attachments/${uuid}`);
      return extractBody<Attachment>(response);
    },
  },
});
