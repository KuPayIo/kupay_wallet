import { Web3 } from '../thirdparty/web3.min';

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/UHhtxDMNBuXoX8OFJKKM"));


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
}

