import { DateValueObject } from "../../../../shared/domain/ValueObjects/DateValueObjects";

export class UserBirthDate extends DateValueObject{
    constructor(value: string){
        super(value);
    }
    

    public calculateAge(): number {
        let today = new Date();
		let edad = today.getFullYear() - this.value.getFullYear();
		let m = today.getMonth() - this.value.getMonth();

		if (m < 0 || (m === 0 && today.getDate() < this.value.getDate())) {
			edad--;
		}

		return edad;
    }

    public isBirthDay(): boolean {
        let today = new Date();
        if (today.getDate() == this.value.getDate()) return true;
        return false;
    }
}