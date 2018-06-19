/**
 * ETH wallet implementation
 */
import { Cipher } from '../crypto/cipher';
import { Mnemonic } from '../thirdparty/bip39';
import { ethereumjs } from '../thirdparty/ethereumjs-wallet-hd-0.6.0';
import { Web3 } from '../thirdparty/web3.min';
import { WORDLIST } from '../thirdparty/wordlist';
import { ERC20Tokens, minABI } from './tokens';

/* tslint:disable:prefer-template */
/* tslint:disable: no-redundant-jsdoc*/
/* tslint:disable: variable-name */

const Buffer = ethereumjs.Buffer.Buffer;
const Wallet = ethereumjs.Wallet;
const WalletHD = ethereumjs.WalletHD;
const ETHTx = ethereumjs.Tx;

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/UHhtxDMNBuXoX8OFJKKM'));

const LANGUAGES = { english: 0, chinese_simplified: 1, chinese_traditional: 2 };
const DEFAULT_DERIVE_PATH = 'm/44\'/60\'/0\'/0/0';

// currently use the default config
const cipher = new Cipher();

export interface Transaction {
    to: string;
    nonce: number | string;
    gasPrice: number | string;
    gasLimit: number | string;
    value: number | string;
    data: string;
}

export class GaiaWallet {

    private _nickName: string;
    private _address: string;
    private _balance: number;
    private _txs: string[];

    private _mnemonic: string;
    private _privKey: string;

    private _masterSeed: string;

    constructor() {
        this._txs = [];
        this._balance = 0;
        this._mnemonic = '';
    }

    public static fromJSON(jsonstring: string) : GaiaWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new GaiaWallet();

        gwlt._nickName = wlt.nickname;
        gwlt._address = wlt.address;
        gwlt._balance = wlt.balance;
        gwlt._mnemonic = wlt.mnemonic;
        gwlt._privKey = wlt.privkey;
        gwlt._txs = wlt.txs;
        gwlt._masterSeed = wlt.masterseed;

        return gwlt;
    }

    get nickName() : string {
        return this._nickName;
    }

    set nickName(name: string) {
        this._nickName = name;
    }

    get address() : string {
        return this._address;
    }

    get balance() : number {
        return this._balance;
    }

    set balance(value: number) {
        this._balance = value;
    }

    // TODO: how to define a tx history?
    get txHistory() : string[] {
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
     * @param {string} passwd used to encrypt the mnemonic
     * @returns {GaiaWallet}
     * @memberof GaiaWallet
     */
    public static fromMnemonic(mnemonic: string, language: string, passwd: string) : GaiaWallet {
        if (!(language in LANGUAGES)) {
            throw new Error('this language does not supported');
        }

        const mn = new Mnemonic(language);
        if (!mn.check(mnemonic)) {
            throw new Error('Invalid Mnemonic');
        }
        const seedBuffer = mn.toSeed(mnemonic);
        const rootNode = WalletHD.fromMasterSeed(Buffer(seedBuffer, 'hex'));

        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        const gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = cipher.encrypt(passwd, wlt.getPrivateKey().toString('hex'));
        gwlt._mnemonic = cipher.encrypt(passwd, mnemonic);
        gwlt._masterSeed = cipher.encrypt(passwd, seedBuffer);

        return gwlt;
    }

    public static fromSeed(passwd: string, seed: string, language: string): GaiaWallet {
        if (!(language in LANGUAGES)) {
            throw new Error('This language does not supported');
        }
        const rootNode = WalletHD.fromMasterSeed(Buffer(seed, 'hex'));
        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        const gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = cipher.encrypt(passwd, wlt.getPrivateKey().toString('hex'));
        gwlt._masterSeed = cipher.encrypt(passwd, seed);

        return gwlt;
    }

    /**
     * recovery wallet from a keystore file
     *
     * @static
     * @param {string} v3string stringfy from keystore file
     * @param {string} passwd used to decrypt keystore file
     * @returns
     * @memberof GaiaWallet
     */
    public static fromKeyStore(v3string: string, passwd: string) : GaiaWallet {
        const wlt = Wallet.fromV3(v3string, passwd, true);
        const gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = cipher.encrypt(passwd, wlt.getPrivateKey().toString('hex'));

        return gwlt;
    }

    /**
     * recover wallet from private key
     *
     * @static
     * @param {string} passwd
     * @param {string} privKey
     * @returns {GaiaWallet}
     * @memberof GaiaWallet
     */
    public static fromPrivateKey(passwd: string, privKey: string) : GaiaWallet {
        const sk = Buffer(privKey, 'hex');
        const wlt = Wallet.fromPrivateKey(sk);
        const gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = cipher.encrypt(passwd, privKey);

        return gwlt;
    }

    /**
     * generate new wallet
     *
     * @static
     * @param {string} language only support "english", "chinese_simplified" and "chinese_traditional"
     * @param {number} strength password strength must be the mutiply of 8 and at least 128
     * @param {string} passwd used to encrypt mnemonic
     * @returns {GaiaWallet}
     * @memberof GaiaWallet
     */
    public static generate(language: string, strength: number, passwd: string) : GaiaWallet {
        if (!(language in LANGUAGES)) {
            throw new Error('this language does not supported');
        }

        if (strength % 32 !== 0 || strength < 128) {
            throw new Error('strength must be the mutiply of 32 and at least 128!');
        }

        const mn = new Mnemonic(language);
        const mnemonic = mn.generate(strength);
        const seedBuffer = mn.toSeed(mnemonic);
        const rootNode = WalletHD.fromMasterSeed(Buffer(seedBuffer, 'hex'));

        const hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        const wlt = hdwlt.getWallet();

        const gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = cipher.encrypt(passwd, wlt.getPrivateKey().toString('hex'));
        gwlt._mnemonic = cipher.encrypt(passwd, mnemonic);
        gwlt._balance = 0;
        gwlt._masterSeed = cipher.encrypt(passwd, seedBuffer);

        return gwlt;
    }

    /**
     * This is a CPU intensive work, may take about 10 seconds!!!
     *
     * @param {string} passwd used to decrypt the keystore file
     * @returns {string}
     * @memberof GaiaWallet
     */
    public exportKeystore(passwd: string) : string {
        let decrypted;
        try {
            decrypted = cipher.decrypt(passwd, this._privKey);
        } catch (e) {
            throw new Error('Invalid operation');
        }
        decrypted = Buffer(decrypted, 'hex'); // decrypted should be a Buffer
        const wlt = Wallet.fromPrivateKey(decrypted);

        return wlt.toV3String(passwd);
    }

    /**
     * export private key of this wallet
     *
     * @param {string} passwd used to decrypt the private key
     * @returns {string}
     * @memberof GaiaWallet
     */
    public exportPrivateKey(passwd: string) : string {
        try {
            return cipher.decrypt(passwd, this._privKey);
        } catch (e) {
            throw new Error('Invalid operation');
        }
    }

    /**
     * export the mnemonic words of this wallet
     *
     * @param {string} passwd used to decrypt the mnemonic words
     * @returns {string}
     * @memberof GaiaWallet
     */
    public exportMnemonic(passwd: string) : string {
        if (this._mnemonic.length !== 0) {
            return cipher.decrypt(passwd, this._mnemonic);
        } else {
            throw new Error('Mnemonic unavailable');
        }
    }

    public deleteMnemonic(passwd: string): void {
        if (this._mnemonic.length === 0) {
            throw new Error('Invalid operation');
        }

        try {
            cipher.decrypt(passwd, this._mnemonic);
        } catch (e) {
            throw new Error('Invalid operation');
        }
        this._mnemonic = '';
    }

    /**
     * sign a raw transaction
     *
     * @param {Transaction} txObj an instance of raw transaction
     * @param {string} passwd passwd to decrypt private key
     * @returns signed and serilized transaction, could be send to Ethereum network via 'sendRawTransaction' RPC call
     * @memberof GaiaWallet
     */
    public signRawTransaction(passwd: string, txObj: Transaction) {
        const tx = new ETHTx();

        tx.to = txObj.to;
        tx.nonce = txObj.nonce;
        tx.gasPrice = txObj.gasPrice;
        tx.gasLimit = txObj.gasLimit;
        tx.value = txObj.value;
        tx.data = txObj.data;

        let privKey;
        try {
            privKey = cipher.decrypt(passwd, this._privKey);
        } catch (e) {
            throw new Error('Invalid operation');
        }
        privKey = Buffer(privKey, 'hex');
        tx.sign(privKey);

        return tx.serialize();
    }

    public getTokenAbiInputData(toAddr: string, amount: number, tokenName: string): string {
        const tokenAddress = ERC20Tokens[tokenName];
        if (tokenAddress === undefined) {
            throw new Error('This token doesn\'t supported');
        }
        const contract = web3.eth.contract(minABI).at(tokenAddress);

        // only support `transfer` method
        return contract.transfer.getData(toAddr, amount);
    }

    public toJSON() : string {
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
     * Derive address according to `index`. Return GaiaWallet object
     *
     * @param {string} passwd Passwd to decrypt `_masterSeed`
     * @param {number} index Which address you want to use
     * @returns {GaiaWallet}
     * @memberof GaiaWallet
     */
    public selectAddress(passwd: string, index: number): GaiaWallet {
        if (this._masterSeed.length === 0) {
            throw new Error('This is not a HD wallet');
        }
        let masterSeed;
        try {
            masterSeed = cipher.decrypt(passwd, this._masterSeed);
        } catch (e) {
            throw new Error('Invalid operation');
        }

        const rootNode = WalletHD.fromMasterSeed(Buffer(masterSeed, 'hex'));
        const path = 'm/44\'/60\'/0\'/0/' + index.toString();
        const hdwlt = rootNode.derivePath(path);

        const wlt = hdwlt.getWallet();
        const gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = cipher.encrypt(passwd, wlt.getPrivateKey().toString('hex'));
        gwlt._balance = 0;
        gwlt._masterSeed = cipher.encrypt(passwd, this._masterSeed);

        return gwlt;
    }
}
