const Telegraf = require('telegraf');
const axios = require('axios');
const { telegram } = require('../keys');
const bot = new Telegraf(telegram.TELEGRAM_BOT_ID);
const { Extra, Markup } = Telegraf;



bot.start((ctx) => {
    console.log(ctx.chat)
    return ctx.reply('hi')
});

bot.action('Detalles', async (ctx) => {
    console.log(ctx.callbackQuery.text)
    ctx.reply('PEPSI!!!')
});



bot.command('login', async (ctx) => {
    try {
        let text = ctx.message.text.split(' ');
        let user = text[2];
        let password = text[4];
        let { data } = await axios.post('http://localhost:82/auth/login/', {
            data: {
                user,
                password
            }
        });
        if (!data) ctx.reply('Invalid')
        await axios.post(`http://localhost:83/data/mysql/usuario/${data.data.id}`, {
            data: {
                chat_id: ctx.chat.id
            }
        })
        await bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        ctx.reply(`Welcome ${data.data.login}!!`);
    } catch (error) {
        console.log(error);
        ctx.reply('Error');
    }
});

bot.command('orders', async (ctx) => {
    try {
        let { id } = ctx.chat;

        let userRes = await axios.get(`http://localhost:83/data/mysql/usuario/?chat_id=${id}`);
        if (!userRes.data[0]) ctx.reply('You are not logged');

        let pedidos = `<b>Pedidos del usuario ${userRes.data[0].login}</b> \n\n`;

        let { data } = await axios.get(`http://localhost:83/data/mysql/usuario/${userRes.data[0].id}/rest_pedidos`);
        data.forEach(element => {
            pedidos += `Pedido nro <i>${element.id}</i> estado (${element.estado}) \n`;
        });

        ctx.replyWithHTML(pedidos);
    } catch (error) {
        console.log(error);
        ctx.reply('Error');
    }
});

bot.command('detalles', async (ctx) => {
    try {
        let text = ctx.message.text.split(' ');
        let order = text[1];
        let { data } = await axios.get('http://localhost:81/api/pedidos/' + order, {
            headers: {
                'x-access-control': '{"user":"admin","password":"123456"}'
            }
        })
        let conceptsData = await axios.get('http://localhost:81/api/pedidos/' + order + '/conceptos', {
            headers: {
                'x-access-control': '{"user":"admin","password":"123456"}'
            }
        })
        let pedido = `<b>Pedido ${data.data.id} (${data.data.estado})</b> \n\n Detalles: \n\n`;
        conceptsData.data.data.forEach(element => {
            pedido += ` <b>${element.nombre}</b> Precio ${element.precio_a} Bs \n`;
        });
        ctx.replyWithHTML(pedido);
    } catch (error) {
        console.log(error);
        ctx.reply('Error');
    }
})


module.exports = bot;