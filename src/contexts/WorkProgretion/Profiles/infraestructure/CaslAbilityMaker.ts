import { Ability, AbilityBuilder } from "@casl/ability";
import { AbilityMaker } from "../domain/Interfaces/AbilityMaker";
import { Profile } from "../domain/Profile";
import { Action, Operation, Policy } from "../domain/types/Policy";

export class CaslAbilityMaker implements AbilityMaker {
    public buildAbility(profile: Profile): any{
        const { can, cannot, build } = new AbilityBuilder(Ability);
        profile.policies.forEach((policy: Policy)=>{
            can(policy.action, policy.entity);
        });
        return build();
    }

    public checkIfCan(ability: Ability, action: Operation | Action, entity: string): boolean {
        return ability.can(action, entity);
    }
}