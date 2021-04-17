import { JsonDocument } from "../../../../../contexts/shared/domain/Types/JsonDocument"
import { Policy } from "./Policy"

export type ProfileJsonDocument = JsonDocument & {
    role: string;
    name: string;
    policies: Policy[]
}

