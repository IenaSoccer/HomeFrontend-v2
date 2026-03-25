import type { UUID } from "./UUID";

interface Mappings {
  defaults: Record<string, {
    id: UUID,
    name: string
  }>
  custom: Record<string, UUID>
}

export type { Mappings };