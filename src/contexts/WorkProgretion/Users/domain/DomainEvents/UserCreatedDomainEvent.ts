import { UserCreatedDomainEventBody } from "../Types/UserCreatedDomainEventBody";
import { DomainEvent } from "../../../../shared/domain/DomainEvents/DomainEvent";

export class UserCreatedDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'user.created';
    readonly email: string;
    readonly username: string;
    
    constructor(body: UserCreatedDomainEventBody, eventId?: string, ocurredOn?: Date){
        super(UserCreatedDomainEvent.EVENT_NAME, body._id, eventId, ocurredOn);
        this.email = body.email;
        this.username = body.username;
    }

    public toPrimitive(): UserCreatedDomainEventBody {
        return {
            _id: this.entityId,
            email: this.email,
            username: this.username
        }
    }
    public static fromPrimitives(object: any): UserCreatedDomainEvent{
        return new UserCreatedDomainEvent(object)
    }
}