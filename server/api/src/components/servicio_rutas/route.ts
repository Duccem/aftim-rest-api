import * as controller  from './controller';
import  {validar}  from'../../helpers/aunthentication';
import { InternalServerError } from '../../errors';
import  { Router,Request,Response } from 'express';
const router = Router();

router.get('/',validar,async (req:Request,res:Response):Promise<Response>=>{
    try {
        let {message,response,code}= await controller.get(req.query);
        return res.status(code).json(message || response);
    } catch (error) {
        console.log(error);
        return res
                .status(InternalServerError.code)
                .json({message:InternalServerError.message});
    }
});

router.get('/:id',validar, async (req:Request, res:Response):Promise<Response> => {
    let {id} = req.params;
    try {
        let {message,response,code} = await controller.getOne(id,req.query);
        return res.status(code).json(message || response);
    } catch (error) {
        console.log(error);
        return res
                .status(InternalServerError.code)
                .json({message:InternalServerError.message});
    }
});

export default router;
