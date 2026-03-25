import { defineStore } from 'pinia'
import { extractBody } from 'src/resources/loader'
import type { AxiosResponse } from 'axios'
import type { Resource } from 'src/contracts/Resource'
import type { Folder } from 'src/contracts/Folder'
import type { Attachment } from 'src/contracts/Attachment'
import type { UUID } from 'src/contracts/UUID'
import type { ApiResponse } from 'src/contracts/ApiResponse'
import api from 'src/utils/api'

interface ResourceState {
  _searchable: Resource[]
  _names: Folder[]
}

export const useResourceStore = defineStore('resource', {
  state: (): ResourceState => ({
    _searchable: [],
    _names: []
  }),

  actions: {
    async getContent(): Promise<Resource[]> {
      this._names = await this.list()

      await Promise.all(
        Object.entries(this._names).map(async ([key]) => {
          const item = await this.fetch(key)
          this._searchable.push(item.pop() as Resource);
        })
      )

      return this._searchable
    },

    async list(): Promise<Folder[]> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/folders`)
      return extractBody<Folder[]>(response)
    },

    async listWithHash(hash: string): Promise<Folder> {
      const response: AxiosResponse<ApiResponse> = await api.get(
        `/folders/list/${hash}`
      )
      return extractBody<Folder>(response)
    },

    async fetch(uuid: string): Promise<Resource<UUID, UUID[] | string>[]> {
      const response: AxiosResponse<ApiResponse> = await api.get(
        `/folders/${uuid}`
      )
      return extractBody<Resource<UUID>[]>(response)
    },

    async fetchPreview(uuid: UUID): Promise<Resource<UUID>> {
      const response: AxiosResponse<ApiResponse> = await api.get(
        `/resources/preview/${uuid}`
      )
      return extractBody<Resource<UUID>>(response)
    },

    async fetchWithHash(uuid: UUID, hash: string): Promise<Resource<UUID>[]> {
      const response: AxiosResponse<ApiResponse> = await api.get(
        `/folders/${uuid}/${hash}`
      )
      return extractBody<Resource<UUID>[]>(response)
    },

    async fetchResource(uuid: UUID): Promise<Resource<UUID>> {
      const response: AxiosResponse<ApiResponse> = await api.get(
        `/resources/${uuid}`
      )
      return extractBody<Resource<UUID>>(response)
    },

    async extract(uuid: UUID): Promise<Attachment> {
      const response: AxiosResponse<ApiResponse> = await api.get(
        `/attachments/${uuid}`
      )
      return extractBody<Attachment>(response)
    }
  }
})
