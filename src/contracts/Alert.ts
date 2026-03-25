import type { UUID } from "./UUID";

enum AlertPriority {
    Info = 0,
    Avviso = 1,
    Importante = 2
}

interface Alert {
    id: UUID,
    title: string,
    summary: string,
    priority: AlertPriority,
    expiration: Date
}

export type { Alert, AlertPriority };