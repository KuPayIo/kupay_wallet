/**
 * Api v2
 */
import { DevMode } from '../../publicLib/config';
import { piFetch } from '../../publicLib/tools';
import { config } from '../config';

/* tslint:disable:no-var-keyword */
if (config.dev_mode === DevMode.Prod) {
    var BTC_API_BASE_URL = config[DevMode.Prod].BtcApiBaseUrl;
    var BTC_MARKET_PRICE_ORACLE_URL = config[DevMode.Prod].BtcMarketPriceOracleUrl;
} else {
    BTC_API_BASE_URL = config[DevMode.Ropsten].BtcApiBaseUrl;
    BTC_MARKET_PRICE_ORACLE_URL = config[DevMode.Ropsten].BtcMarketPriceOracleUrl;
}

type BlanceType = 'balance' | 'totalReceived' | 'totalSent' | 'unconfirmed';

interface Options {
    method?: 'GET' | 'POST';
    body?: string;
}

const sendRequest = async (endpoint: string, opt: Options = { method: 'GET' }): Promise<any> => {
    opt.method = opt.method || 'GET';
    let response: any;
    if (opt.method === 'GET') {
        response = await piFetch(endpoint);
    } else if (opt.method === 'POST') {
        response = await piFetch(endpoint, {
            method: opt.method,
            body: JSON.stringify({ rawtx:opt.body }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return  response;
};

export const BtcApi = {
    getAddrUnspent: async (addr: string): Promise<any> => {
        const endpoint = `${BTC_API_BASE_URL}/addr/${addr}/utxo`;

        return sendRequest(endpoint);
    },

    getBalance: async (addr: string, option: BlanceType = 'balance'): Promise<any> => {
        const endpoint: string = `${BTC_API_BASE_URL}/addr/${addr}/${option}`;

        return sendRequest(endpoint);
    },

    getAddrInfo: async (addr: string): Promise<any> => {
        const endpoint = `${BTC_API_BASE_URL}/addr/${addr}`;

        return sendRequest(endpoint);
    },

    getAddrTxHistory: async (addr: string): Promise<any> => {
        const endpoint = `${BTC_API_BASE_URL}/txs/?address=${addr}`;

        return sendRequest(endpoint);
    },

    sendRawTransaction: async (rawTx: string): Promise<any> => {
        const endpoint = `${BTC_API_BASE_URL}/tx/send`;

        return sendRequest(endpoint, { method: 'POST', body: rawTx });
    },

    getTxInfo: async (txHash: string): Promise<any> => {
        const endpoint = `${BTC_API_BASE_URL}/tx/${txHash}`;

        return sendRequest(endpoint);
    },

    estimateFee: async (nbBlocks: number = 2): Promise<any> => {
        const endpoint = `${BTC_API_BASE_URL}/utils/estimatefee?nbBlocks=${nbBlocks}`;

        return sendRequest(endpoint);
    },

    estimateMinerFee: async (): Promise<any> => {
        // use blockcypher.com at present
        const response = await piFetch('https://api.blockcypher.com/v1/btc/main');

        return {
            high: response.high_fee_per_kb,
            medium: response.medium_fee_per_kb,
            low: response.low_fee_per_kb
        };
    },

    getExchangeRate: async (): Promise<any> => {
        const data = await sendRequest(BTC_MARKET_PRICE_ORACLE_URL);

        return {
            CNY: data.data.quotes.CNY.price,
            USD: data.data.quotes.USD.price
        };
    }
};
