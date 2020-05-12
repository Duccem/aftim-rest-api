import { IFacturas, IDetFacturas } from './model';
import * as consult from '../../helpers/consult';
import * as respuestas from '../../errors';
import * as links from '../../helpers/links';

const model = "adm_enc_facturas";
const submodel = "adm_det_facturas";

/**
 * Get all invoces 
 * @param query modifier of the consult
 */
export const get = async (query: any): Promise<any> => {
    try {
        let data: IFacturas[] = await consult.get(model, query);
        let totalCount: number = await consult.count(model);
        let count = data.length;
        let { limit } = query;
        if (count <= 0) return respuestas.Empty;
        for (let i = 0; i < data.length; i++) {
            let { id } = data[i];
            let pres: IDetFacturas[] = await consult.getOtherByMe(model, id as string, submodel,{});
            data[i].detalles = pres;
        }
        let link = links.pages(data, 'facturas', count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get one invoice
 * @param id id of the invoice
 * @param query modifier of the invoice
 */
export const getOne = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let data: IFacturas = await consult.getOne(model, id, query);
        let count: number = await consult.count(model);

        if (!data) return respuestas.ElementNotFound;

        let pres: IDetFacturas[] = await consult.getOtherByMe(model, id as string, submodel,{});
        data.detalles = pres;
        let link = links.records(data, 'facturas', count);
        let response = Object.assign({ data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

export const getTotal = async (query: any):Promise<any> =>{
    try {
        query.fields = 'subtotal,subtotal_dolar';
        query.adm_tipos_facturas_id = ['1','5'];
        query.estatus_pago = '1';
        let facturas:IFacturas[] = await consult.get(model,query);
        let count = facturas.length;

        if (count <= 0) return respuestas.Empty;
        
        let data = {
            subtotal:0,
            subtotal_dolar:0
        };
        for (let index = 0; index < facturas.length; index++) {
            data.subtotal += parseFloat(facturas[index].subtotal as unknown as string);
            data.subtotal_dolar += parseFloat(facturas[index].subtotal_dolar as unknown as string);
        }
        let response = {data}
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Create a invoice
 * @param body data of the new invoice
 */
export const create = async (body: any): Promise<any> => {
    let { data,data1 } = body;
    let newCargo: IFacturas = data;
    let detalles: IDetFacturas[] = data1;
    try {
        let { insertId } = await consult.create(model, newCargo);

        detalles.forEach( async (detalle) =>{
            detalle.enc_facturas_id = insertId;
            await consult.create(submodel,detalle);
        });
        let link = links.created('facturas', insertId);
        let response = Object.assign({ message: respuestas.Created.message }, { link: link });
        return { response, code: respuestas.Created.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Update the data of an invoice
 * @param params params request object
 * @param body the data of the invoice
 */
export const update = async (params: any, body: any): Promise<any> => {
    const { data } = body;
    const { id } = params;
    let newCargo: IFacturas = data;
    try {

        if(isNaN(id)) return respuestas.InvalidID;
        
        let { affectedRows } = await consult.update(model, id, newCargo);
        let link = links.created('factura', id);
        let response = Object.assign({ message: respuestas.Update.message, affectedRows }, { link: link });
        return { response, code: respuestas.Update.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Delete a invoice
 * @param params params request object
 */
export const remove = async (params: any): Promise<any> => {
    let { id } = params;
    try {
        if (isNaN(id)) return respuestas.InvalidID;

        const data: IFacturas = await consult.getOne(model, id, { fields: 'id' });
        if (!data) return respuestas.ElementNotFound;

        const data1: IDetFacturas[] = await consult.getOtherByMe(model, id, submodel, {});
        for (let index = 0; index < data1.length; index++) {
            await consult.remove(submodel, data1[index].id as number);
        }
        await consult.remove(model, id);
        return respuestas.Deleted;
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Add a detail on an invoice
 * @param params params request object
 * @param body data of the detail
 */
export const addDetail = async (params: any, body: any): Promise<any> => {
    let { data } = body;
    let { id } = params;
    if (isNaN(id)) return respuestas.InvalidID;
    try {
        const pedido = await consult.getOne(model, id, { fields: 'id' });
        if (!pedido) return respuestas.ElementNotFound;
        const newDetail: IDetFacturas = data;
        newDetail.enc_facturas_id = id;
        const { insertId } = await consult.create(submodel, newDetail);

        newDetail.id = insertId;
        const response = { data: newDetail, message: respuestas.Created.message}
        return { response, code: respuestas.Created.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Update the data of a detail of an invoice
 * @param params params request object
 * @param body the data of the detail
 */
export const updateDetail = async (params: any, body: any): Promise<any> => {
    let { data } = body;
    let { id, id1 } = params;
    if (isNaN(id) || isNaN(id1)) return respuestas.InvalidID;
    try {
        const pedido = await consult.getOne(model, id, { fields: 'id' });
        if (!pedido) return respuestas.ElementNotFound;

        const detalle = await consult.getOne(submodel, id1,{ fields: 'id' });
        if (!detalle) return respuestas.ElementNotFound;

        const newDetail: IDetFacturas = data;
        
        await consult.update(submodel, id1, newDetail);

        const link = links.created(model, id);
        const response = { message: respuestas.Update.message, link: link }
        return { response, code: respuestas.Update.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Delete a detail of an invoice
 * @param params params request object
 */
export const deleteDetail = async (params: any): Promise<any> => {
    let { id, id1 } = params;
    if (isNaN(id) || isNaN(id1)) return respuestas.InvalidID;
    try {
        const pedido = await consult.getOne(model, id, { fields: 'id' });
        if (!pedido) return respuestas.ElementNotFound;
        
        const detalle = await consult.getOne(submodel,id1,{ fields: 'id' });
        if (!detalle) return respuestas.ElementNotFound;
        
        await consult.remove(submodel, id1);

        return respuestas.Deleted;
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}


export const getCantidad = async (query: any):Promise<any> =>{
    try {
        let facturas:IFacturas[] = await consult.get(model,query);
        let count = facturas.length;
        let totalCount: number = await consult.count(model);
        if (count <= 0) return respuestas.Empty;
        
        let response = Object.assign({ totalCount, count });
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}