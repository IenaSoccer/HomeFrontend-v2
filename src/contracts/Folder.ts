import type { HexColor, Visibility } from "./Types";
import type { UUID } from "./UUID";

interface Folder {
    id: UUID;
    name: string;
    color: HexColor;
    pid: UUID;
    visibility: Visibility;
    visible: boolean;
    view_mapping: UUID;
}

export type { Folder };