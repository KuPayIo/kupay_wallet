
import { Mnemonic } from '../thirdparty/bip39';
import { WORDLISTS } from '../thirdparty/wordlist';
import { ethereumjs } from '../thirdparty/ethereumjs-wallet-hd-0.6.0';

const Buffer = ethereumjs.Buffer.Buffer;;
const Wallet = ethereumjs.Wallet;
const WalletHD = ethereumjs.WalletHD;
const ETHTx = ethereumjs.Tx;
const ETHUtil = ethereumjs.Util;

const LANGUAGES = {"english": 0, "chinese_simplified": 1, "chinese_traditional": 2};
const DEFAULT_DERIVE_PATH = "m/44'/60'/0'/0/0";

export class GaiaWallet {

    private _nickName: string;
    private _address: string;
    private _balance: number;
    private _txs: string[];

    private _mnemonic: string;
    private _privKey: string;

    // private _lastUsedIndex: number;

    constructor() {
        this._txs = [];
        this._balance = 0;
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

    get txHistory() : string[] {
        return this._txs;
    }

    /**
     * recover wallet from mnenomic words
     * 
     * @static
     * @param {string} mnenomic words
     * @param {string} language what's the language of the mnenomic words
     * @param {string} passwd used to encrypt the mnemonic
     * @returns {GaiaWallet} 
     * @memberof GaiaWallet
     */
    static fromMnemonic(mnenomic: string, language: string, passwd: string) : GaiaWallet {
        if (!(language in LANGUAGES)) {
            throw new Error("this language does not supported")
        }

        let mn = new Mnemonic(language);
        let seedBuffer = mn.toSeed(mnenomic);
        let rootNode = WalletHD.fromMasterSeed(Buffer(seedBuffer, 'hex'));
        
        let hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        let wlt = hdwlt.getWallet();

        let gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        //TODO: encrypt _privKey
        gwlt._privKey = wlt.getPrivateKey();
        // TODD: encrypt mnemonic
        gwlt._mnemonic = mnenomic;

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
    static fromKeyStore(v3string: string, passwd: string) : GaiaWallet {    
        let wlt = Wallet.fromV3(v3string, passwd, true);
        let gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = wlt.getPrivateKey();
        // TODO: intialize another field

        return gwlt;
    }

    /**
     * recover wallet from private key
     * 
     * @static
     * @param {string} privKey 
     * @returns {GaiaWallet} 
     * @memberof GaiaWallet
     */
    static fromPrivateKey(privKey: string) : GaiaWallet {
        let wlt = Wallet.fromPrivateKey(privKey);
        let gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        gwlt._privKey = Buffer(privKey, 'hex');
        // TODO: intialize another field

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
    static generate(language: string, strength: number, passwd: string) : GaiaWallet {
        if (!(language in LANGUAGES)) {
            throw new Error("this language does not supported")
        }

        if (strength % 8 != 0 || strength < 128) {
            throw new Error("strength must be the mutiply of 8 and at least 128!");
        }

        let mn = new Mnemonic(language);
        let mnemonic = mn.generate(strength);
        let seedBuffer = mn.toSeed(mnemonic);
        let rootNode = WalletHD.fromMasterSeed(Buffer(seedBuffer, 'hex'));
        
        let hdwlt = rootNode.derivePath(DEFAULT_DERIVE_PATH);
        let wlt = hdwlt.getWallet();

        let gwlt = new GaiaWallet();
        gwlt._address = wlt.getChecksumAddressString();
        // TODO: encrypt private key
        gwlt._privKey = wlt.getPrivateKey();
        // TODO: encrypt mnemonic
        gwlt._mnemonic = mnemonic;
        gwlt._balance = 0;

        return gwlt;
    }

    /**
     * This is a CPU intensive work, may take about 10 seconds!!!
     * 
     * @param {string} passwd used to decrypt the keystore file
     * @returns {string} 
     * @memberof GaiaWallet
     */
    exportKeystore(passwd: string) : string {
        let wlt = Wallet.fromPrivateKey(this._privKey);
        return wlt.toV3String(passwd);
    }

    /**
     * export private key of this wallet
     * 
     * @param {string} passwd used to decrypt the private key
     * @returns {string} 
     * @memberof GaiaWallet
     */
    exportPrivateKey(passwd: string) : string {
        //TODO: decrypt _privKey
        return this._privKey.toString();
    }

    /**
     * export the mnemonic words of this wallet
     * 
     * @param {string} passwd used to decrypt the mnemonic words
     * @returns {string} 
     * @memberof GaiaWallet
     */
    exportMnemonic(passwd: string) : string {
        //TODO: decrypt: _mnemonic
        return this._mnemonic;
    }

    /**
     * sign a raw transaction
     * 
     * @param {any} txObj an instance of raw transaction
     * @returns signed and serilized transaction, could be send to Ethereum network via 'sendRawTransaction' RPC call
     * @memberof GaiaWallet
     */
    signRawTransaction(txObj) {
        let tx = new ETHTx();

        tx.nonce = txObj['nonce'];
        tx.gasPrice = txObj['gasPrice'];
        tx.gasLimit = txObj['gasLimit'];
        tx.value = txObj['value'];
        tx.data = txObj['data'];

        //TODO: decrypt _privKey
        tx.sign(this._privKey)
        let serializedTx = tx.serialize();

        return serializedTx;
    }
}