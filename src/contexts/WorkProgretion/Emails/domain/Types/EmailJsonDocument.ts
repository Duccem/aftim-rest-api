import { JsonDocument } from "../../../../shared/domain/Types/JsonDocument";

export type EmailJsonDocument = JsonDocument & {
    subject: string;
    content: string;
    sender: string;
    reciver: string;
}