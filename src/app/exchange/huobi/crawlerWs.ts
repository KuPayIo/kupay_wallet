/**
 * 
 */
import { inflate, pako } from './thirdparty/pako.min';

const WS_URL = 'wss://api.huobi.pro/ws';

const symbols = ['xrpbtc'];

const orderbook = {};

/**
 * 获取订阅数据
 */
export const getOrderBook = () => {
    return orderbook;
};

/**
 * 初始启动
 */
export const init = () => {
    run();
};

const handle = (data) => {
    // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
    const mySymbol = data.ch.split('.')[1];
    orderbook[mySymbol] = data.tick;
};

const run = () => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
        console.log('open');
        // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
        // for (const mySymbol of symbols) {
        //     ws.send(JSON.stringify({
        //         sub: `market.${mySymbol}.depth.step0`,
        //         id: `${mySymbol}`
        //     }));
        // }
    };
    ws.onmessage = (e) => {
        console.log(e.data);
        // console.log(e.data.toString());

        // const reader = new FileReader();
        // // reader.readAsText(e.data, 'utf-8');
        // reader.readAsText(e.data);
        // reader.onload = (e) => {
        //     console.info(reader.result,e);
        // };

        // const reader = new FileReader();
        // reader.readAsArrayBuffer(e.data);
        // reader.onload = (e) => {
        //     console.info(reader.result); // ArrayBuffer {}
        //     // 经常会遇到的异常 Uncaught RangeError: byte length of Int16Array should be a multiple of 2
        //     // var buf = new int16array(reader.result);
        //     // console.info(buf);

        //     // // 将 ArrayBufferView  转换成Blob
        //     // const buf1 = new Uint8Array(reader.result);
        //     // console.info(buf1); // [228, 184, 173, 230, 150, 135, 229, 173, 151, 231, 172, 166, 228, 184, 178]
        //     // reader.readAsText(new Blob([buf1]), 'utf-8');
        //     // reader.onload = () => {
        //     //     console.info(reader.result); // 中文字符串
        //     // };

        //     // 将 ArrayBufferView  转换成Blob
        //     const buf2 = new DataView(reader.result);
        //     console.info(buf2); // DataView {}
        //     reader.readAsText(new Blob([buf2]), 'utf-8');
        //     reader.onload = () => {
        //         console.info(reader.result); // 中文字符串
        //     };
        // };

        // console.log(pako, inflate);
        const text = inflate(e.data, {
            to: 'string'
        });
        console.log(text);

        // const text = pako.inflate(data, {
        //     to: 'string'
        // });
        // const msg = JSON.parse(text);
        // if (msg.ping) {
        //     ws.send(JSON.stringify({
        //         pong: msg.ping
        //     }));
        // } else if (msg.tick) {
        //     handle(msg);
        // } else {
        //     console.log(text);
        // }
    };
    ws.onclose = () => {
        console.log('close');
        // run();
    };
    ws.onerror = err => {
        console.log('error', err);
        // run();
    };
};
