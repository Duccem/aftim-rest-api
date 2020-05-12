import * as consult from '../../helpers/consult';
import * as links from '../../helpers/links';
import * as respuestas from '../../errors';
import { ICompras, IDetCompras } from './model';
import { dataURL } from 'keys';

const model = 'adm_enc_compra';
const submodel = 'adm_det_compra';

/**
 * Obtener todas las compras 
 * @param query modifier of the consult
 */
export const get = async (query: any): Promise<any> => {
    try {
        let data: ICompras[] = await consult.get(model, query);
        let totalCount: number = await consult.count(model);
        let count = data.length;
        let { limit } = query;
        if (count <= 0) return respuestas.Empty;
        for (let i = 0; i < data.length; i++) {
            let { id } = data[i];
            let pres: IDetCompras[] = await consult.getOtherByMe(model, id as string, submodel,{});
            data[i].detalles = pres;
        }
        let link = links.pages(data, 'compras', count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Obtener una compra
 * @param id id de la compra
 * @param query modifier of the consult
 */
export const getOne = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let data: ICompras = await consult.getOne(model, id, query);
        let count: number = await consult.count(model);

        if (!data) return respuestas.ElementNotFound;

        let pres: IDetCompras[] = await consult.getOtherByMe(model, id as string, submodel,{});
        data.detalles = pres;
        let link = links.records(data, 'compras', count);
        let response = Object.assign({ data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error al consultar la base de datos, error: ${error}`);
        return respuestas.InternalServerError;
    }
}
