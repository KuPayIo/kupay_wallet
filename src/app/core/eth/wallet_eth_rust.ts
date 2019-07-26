/**
 * ETH wallet implementation
 */
import { ERC20Tokens } from '../../publicLib/config';
import { getEthApiBaseUrl } from '../config';
import { Web3 } from '../thirdparty/web3.min';
import { Api } from './api';
import { minABI } from './tokens';

/* tslint:disable:prefer-template */
/* tslint:disable: no-redundant-jsdoc*/
/* tslint:disable: variable-name */
declare var api;    // 底层挂到window上的对象

export let web3;

const LANGUAGES = { english: 0, chinese_simplified: 1, chinese_traditional: 2 };

// currently use the default config
export interface Transaction {
    to: string;
    nonce: number | string;
    gasPrice: number | string;
    gasLimit: number | string;
    value: number | string;
    data: string;
}

export class EthWallet {

    public static GAP_LIMIT: number = 3;
    private _nickName: string;
    private _address: string;
    private _balance: number;
    private _txs: string[];

    private _mnemonic: string;
    private _privKey: string;

    private _masterSeed: string;
    private api: Api;

    constructor() {
        this._txs = [];
        this._balance = 0;
        this._mnemonic = '';
        this.api = new Api();
    }

    public static fromJSON(jsonstring: string): EthWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new EthWallet();

        gwlt._nickName = wlt.nickname;
        gwlt._address = wlt.address;
        gwlt._balance = wlt.balance;
        gwlt._mnemonic = wlt.mnemonic;
        gwlt._privKey = wlt.privkey;
        gwlt._txs = wlt.txs;
        gwlt._masterSeed = wlt.masterseed;

        return gwlt;
    }

    get nickName(): string {
        return this._nickName;
    }

    set nickName(name: string) {
        this._nickName = name;
    }

    get address(): string {
        return this._address;
    }

    get balance(): number {
        return this._balance;
    }

    set balance(value: number) {
        this._balance = value;
    }

    // TODO: how to define a tx history?
    get txHistory(): string[] {
        return this._txs;
    }

    set txHistory(txs: string[]) {
        this._txs = txs;
    }

    get masterSeed() {
        return this._masterSeed;
    }
    /**
     * recover wallet from mnenomic words
     *
     * @static
     * @param {string} mnemonic words
     * @param {string} language what's the language of the mnenomic words
     * @returns {EthWallet}
     * @memberof EthWallet
     */
    public static fromMnemonic(mnemonic: string, language: string): EthWallet {
        if (!(language in LANGUAGES)) {
            throw new Error('this language does not supported');
        }
        const res = api.eth.eth_from_mnemonic(mnemonic, language);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        const gwlt = new EthWallet();
        gwlt._address = res[1];
        gwlt._privKey = res[2];
        gwlt._mnemonic = mnemonic;
        gwlt._masterSeed = res[3];

        return gwlt;
    }

    /**
     * generate new wallet
     *
     * @static
     * @param {string} language only support "english", "chinese_simplified" and "chinese_traditional"
     * @param {number} strength password strength must be the mutiply of 8 and at least 128
     * @returns {EthWallet}
     * @memberof EthWallet
     */
    public static generate(language: string, strength: number): EthWallet {
        if (!(language in LANGUAGES)) {
            throw new Error('this language does not supported');
        }

        if (strength % 32 !== 0 || strength < 128) {
            throw new Error('strength must be the mutiply of 32 and at least 128!');
        }

        const res = api.eth.eth_generate(strength, language);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        const gwlt = new EthWallet();
        gwlt._address = res[1];
        gwlt._privKey = res[2];
        gwlt._mnemonic = res[4];
        gwlt._balance = 0;
        gwlt._masterSeed = res[3];

        return gwlt;
    }

    public static tokenOperations(method: string, tokenName: string, toAddr?: string, amount?: number | string): string {
        const tokenAddress = ERC20Tokens[tokenName].contractAddr;
        if (tokenAddress === undefined) {
            throw new Error('This token doesn\'t supported');
        }
        initWeb3();
        const contract = web3.eth.contract(minABI).at(tokenAddress);

        switch (method) {
            case 'totalsupply':
                return contract.totalSupply.getData();
            case 'decimals':
                return contract.decimals.getData();
            case 'balanceof':
                if (toAddr !== undefined) {
                    return contract.balanceOf.getData(toAddr);
                } else {
                    throw new Error('Please specifiy the address you want to query balance');
                }
            case 'transfer':
                if (toAddr !== undefined && amount !== undefined) {
                    return contract.transfer.getData(toAddr, amount);
                } else {
                    throw new Error('Need toAddr and amount');
                }
            default:
                throw new Error('Not supported method');
        }
    }

    /**
     * get publickey by mnemonic
     */
    public static getPublicKeyByMnemonic(mnemonic: string, language: string): string {
        if (!(language in LANGUAGES)) {
            throw new Error('this language does not supported');
        }

        const res = api.eth.get_public_key_by_mnemonic(mnemonic, language);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return res[1];
    }

    /**
     * export private key of this wallet
     *
     * @returns {string}
     * @memberof EthWallet
     */
    public exportPrivateKey(): string {
        return this._privKey;
    }

    /**
     * export the mnemonic words of this wallet
     *
     * @returns {string}
     * @memberof EthWallet
     */
    public exportMnemonic(): string {
        return this._mnemonic;
    }

    /**
     * sign a raw transaction
     *
     * @param {Transaction} txObj an instance of raw transaction
     * @returns signed and serilized transaction, could be send to Ethereum network via 'sendRawTransaction' RPC call
     * @memberof EthWallet
     */
    public signRawTransaction(txObj: Transaction) {
        const network = getEthApiBaseUrl();
        let res;
        if (network.search('mainnet') > 0) {
            res = api.eth.eth_sign_raw_transaction(1, txObj.nonce, txObj.to, txObj.value,
                txObj.gasLimit, txObj.gasPrice, txObj.data, this._privKey);
        } else if (network.search('ropsten') > 0) {
            res = api.eth.eth_sign_raw_transaction(3, txObj.nonce, txObj.to, txObj.value,
                txObj.gasLimit, txObj.gasPrice, txObj.data, this._privKey);
        } else if (network.search('rinkeby') > 0) {
            res = api.eth.eth_sign_raw_transaction(4, txObj.nonce, txObj.to, txObj.value,
                txObj.gasLimit, txObj.gasPrice, txObj.data, this._privKey);
        }
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return res[2];
    }

    public signRawTransactionHash(txObj: Transaction) {
        const network = getEthApiBaseUrl();
        let res;
        if (network.search('mainnet') > 0) {
            res = api.eth.eth_sign_raw_transaction(1, txObj.nonce, txObj.to, txObj.value,
                txObj.gasLimit, txObj.gasPrice, txObj.data, this._privKey);
        } else if (network.search('ropsten') > 0) {
            res = api.eth.eth_sign_raw_transaction(3, txObj.nonce, txObj.to, txObj.value,
                txObj.gasLimit, txObj.gasPrice, txObj.data, this._privKey);
        } else if (network.search('rinkeby') > 0) {
            res = api.eth.eth_sign_raw_transaction(4, txObj.nonce, txObj.to, txObj.value,
                txObj.gasLimit, txObj.gasPrice, txObj.data, this._privKey);
        }

        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return {
            nonce: txObj.nonce,
            hash: res[1],
            signedTx: res[2]
        };
    }

    public toJSON(): string {
        const wlt = {
            nickname: this._nickName,
            address: this._address,
            balance: this._balance,
            txs: this._txs,
            mnemonic: this._mnemonic,
            privkey: this._privKey,
            masterseed: this._masterSeed
        };

        return JSON.stringify(wlt);
    }

    /**
     * Derive address according to `index`. Return EthWallet object
     *
     * @param {number} index Which address you want to use
     * @returns {EthWallet}
     * @memberof EthWallet
     */
    public selectAddress(index: number): string {
        if (this._masterSeed.length === 0) {
            throw new Error('This is not a HD wallet');
        }
        const res = api.eth.eth_select_wallet('english', this._masterSeed, index);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return res[1];
    }

    /**
     * Derive address according to `index`. Return EthWallet object
     *
     * @param {number} index Which address you want to use
     * @returns {EthWallet}
     * @memberof EthWallet
     */
    public selectAddressWlt(index: number): EthWallet {
        if (this._masterSeed.length === 0) {
            throw new Error('This is not a HD wallet');
        }
        const res = api.eth.eth_select_wallet('english', this._masterSeed, index);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        const gwlt = new EthWallet();
        gwlt._address = res[1];
        gwlt._privKey = res[2];
        gwlt._balance = 0;

        return gwlt;
    }

    public async scanUsedAddress(): Promise<number> {
        let count = 0;
        let i = 0;
        for (i = 0; ; i++) {
            const addr = this.selectAddress(i);
            const res = await this.api.getAllTransactionsOf(addr);
            if (res === undefined || res.hasOwnProperty('error')) {
                throw new Error('Response error!');
            }
            if (res.result.length === 0) {
                count = count + 1;
            } else {
                count = 0;
            }

            if (count > EthWallet.GAP_LIMIT) {
                break;
            }
        }

        return i - EthWallet.GAP_LIMIT;
    }

    public async scanTokenUsedAddress(contractAddress: string): Promise<number> {
        let count = 0;
        let i = 0;
        for (i = 0; ; i++) {
            const addr = this.selectAddress(i);
            const res = await this.api.getTokenTransferEvents(contractAddress, addr);
            if (res === undefined || res.hasOwnProperty('error')) {
                throw new Error('Response error!');
            }
            if (res.result.length === 0) {
                count = count + 1;
            } else {
                count = 0;
            }

            if (count > EthWallet.GAP_LIMIT) {
                break;
            }
        }

        return i - EthWallet.GAP_LIMIT;
    }
}

export const initWeb3 = () => {
    if (!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider(getEthApiBaseUrl()));
    }
};