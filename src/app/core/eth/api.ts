/**
 * ETH api
 */
import { config } from '../config';
import { Web3 } from '../thirdparty/web3.min';

let web3;
const ETHSCAN_ROPSTEN_API_URL = config.currentNetIsTest ? config.eth.TEST_ETHSCAN_ROPSTEN_API_URL : config.eth.MAIN_ETHSCAN_ROPSTEN_API_URL;
// tslint:disable-next-line:max-line-length
const ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT = config.currentNetIsTest ? config.eth.TEST_ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT : config.eth.MAIN_ETHSCAN_ROPSTEN_TOKEN_TRANSFER_EVENT;

/* tslint:disable:prefer-template */
/* tslint:disable: no-redundant-jsdoc*/

/**
 * API docs: https://github.com/ethereum/wiki/wiki/JavaScript-API
 *
 * @export
 * @class Api
 */
export class Api {

    public getBalance(address: string): Promise<number> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.getBalance(address, (err, bal) => {
                if (!err) {
                    return resolve(bal);
                } else {
                    return reject(err);
                }
            });
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
    public estimateGas(obj: { to: any; data: any }): Promise<number> {
        return new Promise((resolve, reject) => {
            initWeb3();
            web3.eth.estimateGas(obj, (err, res) => {
                if (!err) {
                    return resolve(res);
                } else {
                    return reject(err);
                }
            });
        });
    }

    public async getExchangeRate(): Promise<any> {
        try {
            const response = await fetch(config.eth.ETH_CMC_URL);
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
        web3 = new Web3(new Web3.providers.HttpProvider(config.currentNetIsTest ? config.eth.testWeb3 : config.eth.mainWeb3));
    }
};
