import type { AttachmentData } from "./Types";
import type { UUID } from "./UUID";

interface Attachment {
    id: UUID,
    fid: UUID,
    data: AttachmentData
}

export type { Attachment };