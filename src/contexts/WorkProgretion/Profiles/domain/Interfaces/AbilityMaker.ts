import { Profile } from "../Profile";

export interface AbilityMaker{
    buildAbility(profile: Profile): any;
    checkIfCan(ability: any, action: string, entity: string): boolean;
}