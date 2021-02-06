import { Unauthorized } from "../../domain/Errors/Errors";
import { NextFunction, Response } from "express";
import { AuthMiddleWare } from "../../domain/Auth/AuthMiddleware";
import { RequestTokenized } from "../../domain/Auth/IResquest";
import { Auth } from '../../../ClientAttention/Users/domain/Interfaces/Auth';
import { Inject } from "typedi";

export class RestAuth implements AuthMiddleWare {
    constructor(@Inject("Auth") private auth: Auth){}
    public async use(req: RequestTokenized, res: Response, next: NextFunction): Promise<any>{
        try {
            const token = <string>req.headers.authorization?.split(' ')[1];
            if(!token) return next(new Unauthorized("Token is ausent", 401));
            const userVerifiedToken = this.auth.verifyToken(token);
            req.user = userVerifiedToken;
            next();
        } catch (error) {
           throw error;
        }
    }
}