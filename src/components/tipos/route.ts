import * as controller  from './controller';
import  {validar}  from'../../helpers/aunthentication';
import  { Router,Request,Response } from 'express';
const router = Router();

router.get('/conceptos',validar,async (req:Request,res:Response):Promise<Response>=>{
    try {
        let data:any = await controller.getTiposConceptos(req.query);
        if(data.message){
            return res.status(204).json(data);
        }else{
            return res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});

router.get('/conceptos/:id',validar, async (req:Request, res:Response):Promise<Response> => {
    let {id} = req.params;
    try {
        let data:any = await controller.getOneTipoConcepto(id,req.query);
        if(data.message){
            return res.status(404).json(data);
        }else{
            return res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});



export default router;