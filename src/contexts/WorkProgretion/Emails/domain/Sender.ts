export interface Sender {
    sender: string;
    send(reciver: string, subject: string, content: string): Promise<void>;
}