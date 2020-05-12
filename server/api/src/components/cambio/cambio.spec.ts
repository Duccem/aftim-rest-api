import { get, getOne } from './controller';

describe('Cambio controller',()=>{
    test('Get', async ()=>{
        const data = await get({});
        expect(data.code).toBe(200);
        expect(data.response).toBeDefined();
    });
    test('Get One', async () =>{
        const data = await getOne(1,{});
        expect(data.code).toBe(200);
        expect(data.response).toBeDefined();
    });
});
