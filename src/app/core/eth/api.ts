/**
 * ETH api
 */
import { DevMode } from '../../config';
import { config } from '../config';
import { Web3 } from '../thirdparty/web3.min';

let web3;
/* tslint:disable:no-var-keyword */
if (config.dev_mode === DevMode.Ropsten) {
    var ETH_API_BASE_URL = config[DevMode.Ropsten].EthApiBaseUrl;
    var ETH_MARKET_PRICE_ORACLE_URL = config[DevMode.Ropsten].EthMarketPriceOracleUrl;
    var ETHSCAN_ROPSTEN_API_URL = config[DevMode.Ropsten].EthscanRopstenUrl;
    var ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT = config[DevMode.Ropsten].EthscanRopstenTokenTransferEvent;
} else if (config.dev_mode === DevMode.Rinkeby) {
    ETH_API_BASE_URL = config[DevMode.Rinkeby].EthApiBaseUrl;
    ETH_MARKET_PRICE_ORACLE_URL = config[DevMode.Rinkeby].EthMarketPriceOracleUrl;
    ETHSCAN_ROPSTEN_API_URL = config[DevMode.Rinkeby].EthscanRopstenUrl;
    ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT = config[DevMode.Rinkeby].EthscanRopstenTokenTransferEvent;
} else if (config.dev_mode === DevMode.Prod) {
    ETH_API_BASE_URL = config[DevMode.Prod].EthApiBaseUrl;
    ETH_MARKET_PRICE_ORACLE_URL = config[DevMode.Prod].EthMarketPriceOracleUrl;
    ETHSCAN_ROPSTEN_API_URL = config[DevMode.Prod].EthscanRopstenUrl;
    ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT = config[DevMode.Prod].EthscanRopstenTokenTransferEvent;
}

/* tslint:disable:prefer-template */
/* tslint:disable: no-redundant-jsdoc*/

/**
 * API docs: https://github.com/ethereum/wiki/wiki/JavaScript-API
 *
 * @export
 * @class Api
 */
export class Api {

    public getBalance(address: string): Promise<any> {
        return new Promise((resovle, reject) => {
            try {
                const response = fetch(ETH_API_BASE_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: 1,
                        method: 'eth_getBalance',
                        params: [address, 'latest']
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                resovle(response.then(res => res.json()));
            } catch (e) {
                reject(e);
            }

        });
    }

    public sendRawTransaction(serializedTx: any): Promise<string> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                if (!err) {
                    return resolve(hash);
                } else {
                    return reject(err);
                }
            });
        });
    }

    public getTransactionCount(address: string): Promise<number> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.getTransactionCount(address, (err, cnt) => {
                if (!err) {
                    return resolve(cnt);
                } else {
                    return reject(err);
                }
            });
        });
    }

    public getTransaction(hash: string): Promise<string> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.getTransaction(hash, (err, val) => {
                if (!err) {
                    return resolve(val);
                } else {
                    return reject(err);
                }
            });
        });
    }
    public getBlockNumber():Promise<string> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.getBlockNumber((err, val) => {
                if (!err) {
                    return resolve(val);
                } else {
                    return reject(err);
                }
            });
        });
    }
    public getBlock(blockHash:string):Promise<string> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.getBlock(blockHash,(err, val) => {
                if (!err) {
                    return resolve(val);
                } else {
                    return reject(err);
                }
            });
        });
    }

    public getTransactionReceipt(hash: string): Promise<string> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.getTransactionReceipt(hash, (err, val) => {
                if (!err) {
                    return resolve(val);
                } else {
                    return reject(err);
                }
            });
        });
    }
    /**
     * Estimate gas usage of a transaction obj
     *
     * @param {{to, data}} obj `to` and `data` shoul be a '0x' prefixed hex string
     * @returns {Promise<number>}
     * @memberof Api
     */
    // tslint:disable-next-line:no-reserved-keywords
    public estimateGas(obj: { to: any; from?: any ;value?:any;data: any }): Promise<number> {
        return new Promise((resolve, reject) => {
            initWeb3();
            if (obj.data) {
                obj.data = web3.toHex(obj.data);
            }
            web3.eth.estimateGas(obj, (err, res) => {
                if (!err) {
                    // console.log(obj,res);

                    return resolve(res);
                } else {
                    // console.log(obj,err);

                    return reject(err);
                }
            });
        });
    }

    public async getExchangeRate(): Promise<any> {
        try {
            const response = await fetch(ETH_MARKET_PRICE_ORACLE_URL);
            const data = await response.json();

            return {
                CNY: data.data.quotes.CNY.price,
                USD: data.data.quotes.USD.price
            };
        } catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * Docs: https://etherscan.io/apis#accounts
     * Get maxmum last 10000 histroy transactions of `address`
     *
     * @param {string} address
     * @returns {Promise<{}>}
     * @memberof Api
     */
    public async getAllTransactionsOf(address: string): Promise<any> {
        try {
            const url = ETHSCAN_ROPSTEN_API_URL + address;
            const response = await fetch(url);

            return await response.json();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * Invoke contract calls that don't modify blockchain state
     *
     * @param {string} contractAddress Address of the called contract
     * @param {string} callData Contract call parameters
     * @returns {Promise<any>} Json response
     * @memberof Api
     */
    public async ethCall(contractAddress: string, callData: string): Promise<any> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.call({
                to: contractAddress,
                data: callData
            }, (err, res) => {
                if (!err) {
                    return resolve(res);
                } else {
                    return reject(err);
                }
            });
        });
    }

    /**
     * Get token transfer events of an address
     *
     * @param {string} contractAddress Token contract address
     * @param {string} address Which address to query
     * @returns {Promise<any>} Json response
     * @memberof Api
     */
    public async getTokenTransferEvents(contractAddress: string, address: string): Promise<any> {
        const path = ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT + `&contractAddress=${contractAddress}&address=${address}`;
        // console.log(path);
        try {
            const response = await fetch(path);

            return response.json();
        } catch (e) {
            return Promise.reject(e);
        }
    }

}

const initWeb3 = () => {
    if (!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider(ETH_API_BASE_URL));
    }
};
