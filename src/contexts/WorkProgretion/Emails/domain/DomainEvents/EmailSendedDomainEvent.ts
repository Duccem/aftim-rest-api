import { DomainEvent } from "../../../../shared/domain/DomainEvents/DomainEvent";

export class EmailSendedDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'email.sended';
    readonly reciver: string;
    readonly sender: string;
    
    constructor(body: any, eventId?: string, ocurredOn?: Date){
        super(EmailSendedDomainEvent.EVENT_NAME, body._id, eventId, ocurredOn);
        this.reciver = body.reciver;
        this.sender = body.sender;
    }

    public toPrimitive(): any {
        return {
            _id: this.entityId,
            email: this.reciver,
            username: this.sender
        }
    }
    public static fromPrimitives(object: any): any{
        return new EmailSendedDomainEvent(object)
    }
}