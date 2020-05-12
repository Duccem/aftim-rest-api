import * as consult from '../../helpers/consult';
import * as links from '../../helpers/links';
import * as respuestas from '../../errors';
import { IEmpresa } from './model';

const model = "adm_empresa";

/**
 * Get all companies
 * @param query modifier 
 */
export const get = async (query: any): Promise<any> => {
    try {
        let data: IEmpresa[] = await consult.get(model, query);
        let totalCount: number = await consult.count(model); // consulto el total de registros de la BD
        let count = data.length;
        let { limit } = query;
        if (count <= 0) return respuestas.Empty;

        let link = links.pages(data, model, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };

    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get one company
 * @param id id of the company
 * @param query modifier of the consult
 */
export const getOne = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;
        let data: IEmpresa = await consult.getOne(model, id, query);
        let count: number = await consult.count(model);
        if (!data) return respuestas.ElementNotFound;

        let link = links.records(data, model, count);
        let response = Object.assign({ data }, link);
        return { response, code: respuestas.Ok.code };

    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}


/**
 * Get all concepts of a company
 * @param id id of the company 
 * @param query modifier of the consult
 */
export const getConceptsByEmpresa = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;
        let recurso: IEmpresa = await consult.getOne(model, id, { fields: 'id' });

        if (!recurso) return respuestas.ElementNotFound;

        let { fields, limit } = query;

        if(query.fields){
            let aux = query.fields.split(',');
            let filtrados = aux.filter((e:any) => e !== 'presentaciones' && e!=='existencias');
            query.fields = filtrados.join(',');
        }

        let data: any = await consult.getOtherByMe(model, id, 'adm_conceptos', query);
        let totalCount = await consult.countOther(model, 'adm_conceptos', id);
        let count = data.length;

        if (count <= 0) return respuestas.Empty;

        for (let i = 0; i < data.length; i++) {
            let { id } = data[i];
            if(!fields || fields.includes('presentaciones')){
                let pres: any[] = await consult.getOtherByMe('adm_conceptos', id as string, 'adm_presentaciones', {});
                data[i].presentaciones = pres;
            }
            if(!fields || fields.includes('existencias')){
                let movDep: any[] = await consult.getOtherByMe('adm_conceptos',id as string,'adm_movimiento_deposito',{fields:'adm_depositos_id,existencia'});
                data[i].existencias = movDep;
            }
        }

        let link = links.pages(data, `empresa/${id}/conceptos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get all deposits of a company
 * @param id id of the company 
 * @param query modifier of the consult
 */
export const getDepositsByEmpresa = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IEmpresa = await consult.getOne(model, id, { fields: 'id' });

        if (!recurso) return respuestas.ElementNotFound;

        let data: any = await consult.getOtherByMe(model, id, 'adm_depositos', query);
        let totalCount = await consult.countOther(model, 'adm_depositos', id);
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;

        let link = links.pages(data, `empresa/${id}/depositos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get all the groups that use a company
 * @param id id of the company
 * @param query modifier of the consult
 */
export const getGroupsByEmpresa = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IEmpresa = await consult.getOne(model, id, { fields: 'id' });

        if (!recurso) return respuestas.ElementNotFound;
        let limite = await consult.count('adm_conceptos');
        let conceptos: any[] = await consult.getOtherByMe(model, id, 'adm_conceptos', { fields: 'id,adm_grupos_id', orderField: 'adm_grupos_id', limit: limite || 50 });

        if (!conceptos) return respuestas.Empty;

        let grp = conceptos[0].adm_grupos_id;
        let data:any[]  = [];
        if(grp != null){
            let data1 = await consult.getOne('adm_grupos', grp, {}); 
            data.push(data1);
        }
        for (let index = 0; index < conceptos.length; index++) {
            if (conceptos[index].adm_grupos_id !== grp && conceptos[index].adm_grupos_id !== null) {
                let group: any = await consult.getOne('adm_grupos', conceptos[index].adm_grupos_id, {});
                data.push(group);
                grp = conceptos[index].adm_grupos_id;
            }
        }
        let totalCount = await consult.count('adm_grupos');
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;

        let link = links.pages(data, `empresa/${id}/grupos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };

    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/** 
* Get all the groups that use a company
* @param id id of the company
* @param query modifier of the consult
*/
export const getSubgroupsByEmpresa = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IEmpresa = await consult.getOne(model, id, { fields: 'id' });

        if (!recurso) return respuestas.ElementNotFound;

        let conceptos: any[] = await consult.getOtherByMe(model, id, 'adm_conceptos', { fields: 'id,adm_subgrupos_id', orderField: 'adm_subgrupos_id' });

        if (!conceptos) return respuestas.Empty;

        let grp = conceptos[0].adm_subgrupos_id;
        let data: any[] = [];
        if(grp!== null){
            let data1 =  await consult.getOne('adm_subgrupos', grp, {});
            data.push(data1);
        }
        for (let index = 0; index < conceptos.length; index++) {
            if (conceptos[index].adm_subgrupos_id !== grp && conceptos[index].adm_subgrupos_id !== null) {
                let group: any = await consult.getOne('adm_subgrupos', conceptos[index].adm_subgrupos_id, {});
                data.push(group);
                grp = conceptos[index].adm_subgrupos_id;
            }
        }
        let totalCount = await consult.count('adm_subgrupos');
        let count = data.length;
        let { limit } = query;
        
        if (count <= 0) return respuestas.Empty

        let link = links.pages(data, `empresa/${id}/subgrupos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: 200 };

    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

export const getPedidosByEmpresa = async (id: string | number, query: any): Promise<any> =>{
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IEmpresa = await consult.getOne(model, id, { fields: 'id' });
        if (!recurso) return respuestas.ElementNotFound;

        let data: any = await consult.getOtherByMe(model, id, 'rest_pedidos', query);
        let totalCount = await consult.countOther(model, 'rest_pedidos', id);
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;

        for (let i = 0; i < data.length; i++) {
            let { id } = data[i];
            let pres: any[] = await consult.getOtherByMe('rest_pedidos', id as string, 'rest_det_pedidos', {});
            data[i].detalles = pres;
        }

        let link = links.pages(data, `empresa/${id}/pedidos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get all concepts of a group ofa company
 * @param id id of the company 
 * @param query modifier of the consult
 */
export const getConceptsByGroupByEmpresa = async (eId: string | number, gId: string | number, query: any): Promise<any> => {
    try {
      if (isNaN(eId as number) || isNaN(gId as number)) return respuestas.InvalidID;

        let sql =  `SELECT * FROM adm_conceptos WHERE adm_empresa_id=${eId} AND adm_grupos_id=${gId}`;

        let data = await consult.getPersonalized(sql);
        let totalCount = await consult.count('adm_conceptos');
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;

        let link = links.pages(data, `empresa/${eId}/grupos/${gId}`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

export async function getUserByCompany(id: string | number, query: any): Promise<any>{
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;
        let recurso: IEmpresa = await consult.getOne(model, id, { fields: 'id' });

        if (!recurso) return respuestas.ElementNotFound;

        let data: any = await consult.getOtherByMe(model, id, 'usuario', query);
        let totalCount = await consult.countOther(model, 'usuario', id);
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;

        let link = links.pages(data, `empresa/${id}/usuario`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Create a new company
 * @param body data of the new company
 */
export const create = async (body: any): Promise<any> => {
    let { data } = body;
    let newCliente: IEmpresa = data;
    try {
        let { insertId } = await consult.create(model, newCliente);
        let link = links.created(model, insertId);
        let response = Object.assign({ message: respuestas.Created.message}, { link: link });
        return { response, code: respuestas.Created.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}


/**
 * Update a company
 * @param params params request object
 * @param body data of the company
 */
export const update = async (params: any, body: any): Promise<any> => {
    const { id } = params;
    let { data } = body;
    let newCliente: IEmpresa = data;

    try {
        if(isNaN(id as number)) return respuestas.InvalidID;

        let { affectedRows } = await consult.update(model, id, newCliente);
        let link = links.created(model, id);
        let response = Object.assign({ message: respuestas.Update.message, affectedRows }, { link: link });
        return { response, code: respuestas.Update.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Delete a company
 * @param params params request object
 */
export const remove = async (params: any): Promise<any> => {
    let { id } = params;
    try {

        if(isNaN(id as number)) return respuestas.InvalidID;

        await consult.remove(model, id);
        return respuestas.Deleted;
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;

        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}