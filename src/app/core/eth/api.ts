import { Web3 } from '../thirdparty/web3.min';

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/UHhtxDMNBuXoX8OFJKKM"));
const ETH_CMC_URL = "https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY";
const ETHSCAN_ROPSTEN_API_URL = "http://api-ropsten.etherscan.io/api?module=account&action=txlist&address="


/**
 * API docs: https://github.com/ethereum/wiki/wiki/JavaScript-API
 * 
 * @export
 * @class Api
 */
export class Api {

    getBalance(address: string): Promise<number> {
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(address, (err, bal) => {
                if (!err) {
                    return resolve(bal);
                } else {
                    return reject(err);
                }
            })
        })
    }

    sendRawTransaction(serializedTx): Promise<string> {
        return new Promise((resolve, reject) => {
            web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                if (!err) {
                    return resolve(hash);
                } else {
                    return reject(err);
                }
            })
        })
    }

    getTransactionCount(address: string): Promise<number> {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(address, (err, cnt) => {
                if (!err) {
                    return resolve(cnt);
                } else {
                    return reject(err);
                }
            })
        })
    }

    getTransaction(hash: string): Promise<string> {
        return new Promise((resolve, reject) => {
            web3.eth.getTransaction(hash, (err, val) => {
                if (!err) {
                    return resolve(val);
                } else {
                    return reject(err);
                }
            })
        })
    }

    getTransactionReceipt(hash): Promise<string> {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionReceipt(hash, (err, val) => {
                if (!err) {
                    return resolve(val);
                } else {
                    return reject(err);
                }
            })
        })
    }
    /**
     * Estimate gas usage of a transaction obj
     * 
     * @param {{to, data}} obj `to` and `data` shoul be a '0x' prefixed hex string
     * @returns {Promise<number>} 
     * @memberof Api
     */
    estimateGas(obj: {to, data}): Promise<number> {
        return new Promise((resolve, reject) => {
            web3.eth.estimateGas(obj, (err, res) => {
                if(!err) {
                    return resolve(res);
                } else {
                    return reject(err);
                }
            })
        })
    }

    async getExchangeRate(): Promise<{}> {
        try {
            let response = await fetch(ETH_CMC_URL);
            let data = await response.json();
            return {
                "CNY": data['data']['quotes']['CNY']['price'],
                "USD": data['data']['quotes']['USD']['price']
            }
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
    async getAllTransactionsOf(address: string): Promise<{}> {
        try {
            let url = ETHSCAN_ROPSTEN_API_URL + address;
            let response = await fetch(url);
            let data = await response.json();
            return data
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
