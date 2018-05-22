import { Web3 } from '../thirdparty/web3.min';

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/UHhtxDMNBuXoX8OFJKKM"));
const ETH_CMC_URL = "https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY";

/**
 * API docs: https://github.com/ethereum/wiki/wiki/JavaScript-API
 * 
 * @export
 * @class Api
 */
export class Api {
    
    getBalance(address: string): number {
        return web3.eth.getBalance(address);
    }
 
    sendRawTransaction(serializedTx): string {
        return web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    }

    getTransactionCount(address: string): number {
        return web3.eth.getTransactionCount(address);
    }

    getTransaction(hash: string): string {
        return web3.eth.getTransaction(hash);
    }

    getTransactionReceipt(hash): string {
        return web3.eth.getTransactionReceipt(hash);
    }

    async getExchangeRate(): Promise<{}> {
        try {
            let response = await fetch(ETH_CMC_URL);
            let data = await response.json();
            return {
                "CNY": data['data']['quotes']['CNY']['price'],
                "USD": data['data']['quotes']['USD']['price']
            }
        } catch(e) {
            console.log("Unknown error:", e);
        }
    }
}

