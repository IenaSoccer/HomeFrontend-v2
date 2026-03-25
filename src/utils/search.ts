import type { Attachment } from "src/contracts/Attachment"
import type { Folder } from "src/contracts/Folder"
import type { Resource } from "src/contracts/Resource"

type Searchable = Resource | Attachment | Folder

function search<T extends Searchable>(blob: T[], query: string): T[] {
  const regExp = new RegExp(query, "gi")

  const check = (obj: Searchable): boolean => {
    if (obj === null || obj === undefined) return false
    if (Array.isArray(obj)) return obj.some(check)
    if (typeof obj === "object") return Object.values(obj).some(check)
    return (typeof obj === "string" || typeof obj === "number") && regExp.test(String(obj))
  }

  return blob.filter(check)
}

export const SearchEngine = search
export type { Searchable }