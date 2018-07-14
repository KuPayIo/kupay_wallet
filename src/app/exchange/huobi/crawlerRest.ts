
/**
 * 
 */
import { get } from './httpClient';

const BASE_URL = 'https://api.huobipro.com';

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

const cmpAsk = (a, b) => {
    return a[0] - b[0];
};

const cmpBid = (a, b) => {
    return b[0] - a[0];
};

const handle = (coin, asks, bids, currency) => {
    const a = asks.sort(cmpAsk);
    const b = bids.sort(cmpBid);

    const mySymbol = (coin + currency).toLowerCase();
    orderbook[mySymbol] = {
        asks: a,
        bids: b
    };
    // console.log(orderbook[symbol]);
    // TODO 根据数据生成你想要的K线 or whatever...
    // TODO 记录数据到你的数据库或者Redis
};

const getDepth = (coin, currency) => {
    return new Promise(resolve => {
        const url = `${BASE_URL}/market/depth?symbol=${coin}${currency}&type=step0`;
        get(url, {
            timeout: 1000,
            gzip: true
        }).then(data => {
            // console.log(data);
            const json = JSON.parse(<any>data);
            const asks = json.tick.asks;
            const bids = json.tick.bids;

            handle(coin, asks, bids, currency);
            resolve(null);
        }).catch(ex => {
            // console.log(coin, currency, ex);
            resolve(null);
        });
    });
};

const run = () => {
    // console.log(`run ${moment()}`);
    // let list_btc = ['ltc-btc', 'eth-btc', 'etc-btc', 'bcc-btc', 'dash-btc', 'omg-btc', 'eos-btc', 'xrp-btc', 'zec-btc', 'qtum-btc'];
    // let list_usdt = ['btc-usdt', 'ltc-usdt', 'eth-usdt', 'etc-usdt', 'bcc-usdt', 'dash-usdt', 'xrp-usdt'
    // , 'eos-usdt', 'omg-usdt', 'zec-usdt', 'qtum-usdt'];
    // let list_eth = ['omg-eth', 'eos-eth', 'qtum-eth'];
    // let list = list_btc.concat(list_usdt).concat(list_eth);
    const list = ['xrp-btc'];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const coin = item.split('-')[0];
        const currency = item.split('-')[1];
        getDepth(coin, currency);
    }
    setTimeout(run, 10000);
    // Promise.map(list, item => {
    //     const coin = item.split('-')[0];
    //     const currency = item.split('-')[1];

    //     return getDepth(coin, currency);
    // }).then(() => {
    //     setTimeout(run, 100);
    // });
};
