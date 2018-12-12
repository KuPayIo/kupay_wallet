/**
 * ETH wallet implementation
 */
import { ERC20Tokens } from '../../config';
import { getEthApiBaseUrl } from '../config';
import { Mnemonic } from '../thirdparty/bip39';
import { ethereumjs } from '../thirdparty/ethereumjs-wallet-hd-0.6.0';
import { Web3 } from '../thirdparty/web3.min';
import { Api } from './api';
import { minABI } from './tokens';

/* tslint:disable:prefer-template */
/* tslint:disable: no-redundant-jsdoc*/
/* tslint:disable: variable-name */

export let web3;

const LANGUAGES = { english: 0, chinese_simplified: 1, chinese_traditional: 2 };
const DEFAULT_DERIVE_PATH = 'm/44\'/60\'/0\'/0/0';

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

        const mn = new Mnemonic(language);
        if (!mn.check(mnemonic)) {
            throw new Error('Invalid Mnemonic');
        }
        const seedBuffer = mn.toSeed(mnemonic);
        const rootNode = ethereumjs.WalletHD.fromMasterSeed(ethereumjs.Buffer.Buffer(seedBuffer, 'hex'));

        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        const gwlt = new EthWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = wlt.getPrivateKey().toString('hex');
        gwlt._mnemonic = mnemonic;
        gwlt._masterSeed = seedBuffer;

        return gwlt;
    }

    public static fromSeed(seed: string, language: string): EthWallet {
        if (!(language in LANGUAGES)) {
            throw new Error('This language does not supported');
        }
        const rootNode = ethereumjs.WalletHD.fromMasterSeed(ethereumjs.Buffer.Buffer(seed, 'hex'));
        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        const gwlt = new EthWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = wlt.getPrivateKey().toString('hex');
        gwlt._masterSeed = seed;

        return gwlt;
    }

    /**
     * recovery wallet from a keystore file
     *
     * @static
     * @param {string} v3string stringfy from keystore file
     * @param {string} passwd used to decrypt keystore file
     * @returns
     * @memberof EthWallet
     */
    public static fromKeyStore(v3string: string, passwd: string): EthWallet {
        const wlt = ethereumjs.Wallet.fromV3(v3string, passwd, true);
        const gwlt = new EthWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = wlt.getPrivateKey().toString('hex');

        return gwlt;
    }

    /**
     * recover wallet from private key
     *
     * @static
     * @param {string} privKey
     * @returns {EthWallet}
     * @memberof EthWallet
     */
    public static fromPrivateKey(privKey: string): EthWallet {
        const sk = ethereumjs.Buffer.Buffer(privKey, 'hex');
        const wlt = ethereumjs.Wallet.fromPrivateKey(sk);
        const gwlt = new EthWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = privKey;

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

        const mn = new Mnemonic(language);
        const mnemonic = mn.generate(strength);
        const seedBuffer = mn.toSeed(mnemonic);
        const rootNode = ethereumjs.WalletHD.fromMasterSeed(ethereumjs.Buffer.Buffer(seedBuffer, 'hex'));

        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        const gwlt = new EthWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = wlt.getPrivateKey().toString('hex');
        gwlt._mnemonic = mnemonic;
        gwlt._balance = 0;
        gwlt._masterSeed = seedBuffer;

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

        const mn = new Mnemonic(language);
        if (!mn.check(mnemonic)) {
            throw new Error('Invalid Mnemonic');
        }
        const seedBuffer = mn.toSeed(mnemonic);
        const rootNode = ethereumjs.WalletHD.fromMasterSeed(ethereumjs.Buffer.Buffer(seedBuffer, 'hex'));

        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        return wlt.getPublicKey().toString('hex');
    }

    /**
     * This is a CPU intensive work, may take about 10 seconds!!!
     *
     * @param {string} passwd used to decrypt the keystore file
     * @returns {string}
     * @memberof EthWallet
     */
    public exportKeystore(passwd: string): string {
        let decrypted = this._privKey;
        decrypted = ethereumjs.Buffer.Buffer(decrypted, 'hex'); // decrypted should be a Buffer
        const wlt = ethereumjs.Wallet.fromPrivateKey(decrypted);

        return wlt.toV3String(passwd);
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
        const tx = new ethereumjs.Tx();

        tx.to = txObj.to;
        tx.nonce = txObj.nonce;
        tx.gasPrice = txObj.gasPrice;
        tx.gasLimit = txObj.gasLimit;
        tx.value = txObj.value;
        tx.data = txObj.data;
        tx.sign(ethereumjs.Buffer.Buffer(this._privKey, 'hex'));

        return tx.serialize();
    }

    public signRawTransactionHash(txObj: Transaction) {
        const tx = new ethereumjs.Tx();

        tx.to = txObj.to;
        tx.nonce = txObj.nonce;
        tx.gasPrice = txObj.gasPrice;
        tx.gasLimit = txObj.gasLimit;
        tx.value = txObj.value;
        tx.data = txObj.data;
        tx.sign(ethereumjs.Buffer.Buffer(this._privKey, 'hex'));

        return {
            nonce:txObj.nonce,
            hash:tx.hash().toString('hex'),
            signedTx:tx.serialize()
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
        const masterSeed = this._masterSeed;

        const rootNode = ethereumjs.WalletHD.fromMasterSeed(ethereumjs.Buffer.Buffer(masterSeed, 'hex'));
        const path = 'm/44\'/60\'/0\'/0/' + index.toString();
        const hdwlt = rootNode.derivePath(path);

        const wlt = hdwlt.getWallet();

        return wlt.getChecksumAddressString();
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
        const masterSeed = this._masterSeed;

        const rootNode = ethereumjs.WalletHD.fromMasterSeed(ethereumjs.Buffer.Buffer(masterSeed, 'hex'));
        const path = 'm/44\'/60\'/0\'/0/' + index.toString();
        const hdwlt = rootNode.derivePath(path);

        const wlt = hdwlt.getWallet();
        const gwlt = new EthWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = wlt.getPrivateKey().toString('hex');
        gwlt._balance = 0;
        gwlt._masterSeed = this._masterSeed;

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