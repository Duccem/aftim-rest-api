
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { User, UserInput } from '../types/user.type';
import { UserAccessService } from '../../../../contexts/ClientAttention/Users/services/UserAccessService';
import { Inject } from 'typedi';
import { Unauthorized } from '../../../../contexts/shared/domain/Errors/Errors';
import { GraphAuth } from '../../../../contexts/shared/infraestructure/Auth/GraphAuth'
@Resolver(of => User)
export class AccessResolver{
    constructor(@Inject("UserAccessService") private readonly userAccessService: UserAccessService){}
    
    @Query(returns => User)
    async login(@Arg('username') username: string, @Arg('password') password: string): Promise<any>{
        const response = await this.userAccessService.login(username, password);
        return response;
    }

    @UseMiddleware(GraphAuth)
    @Query(returns => String)
    async chooseProfile(): Promise<string | undefined>{
        //throw new Unauthorized("Error", 400);
        return this.userAccessService.log();
    }

    @Mutation(returns => User)
    async signin(@Arg('user') user: UserInput): Promise<any>{
        const response = this.userAccessService.signup(user as any);
        console.log(response)
        return response;
    }
}