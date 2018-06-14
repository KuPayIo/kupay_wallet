
/**
 * BTC HD wallet implementaion
 */
import { Cipher } from '../crypto/cipher';
import { Mnemonic } from '../thirdparty/bip39';
import { bitcore } from '../thirdparty/bitcore-lib';
import { Api } from './api';

const HDWallet = bitcore.HDPrivateKey;
const Transaction = bitcore.Transaction;
const Script = bitcore.Script;
const Unit = bitcore.Unit;

const cipher = new Cipher();

export type LANGUAGE = 'english' | 'chinese_simplified' | 'chinese_traditional';
export type NETWORK = 'mainnet' | 'testnet';
export type PRIORITY = 'high' | 'medium' | 'low';

export class UTXO {
    public txid: string; // transaction hash that generate this utxo
    public vout: number; // previous output index
    public address: string; // who own this utxo
    public scriptPubKey: string; // public key hash
    public amount: number; // BTC unit
    public confirmations?: number;
}

export class Output {
    public toAddr: string;
    public amount: number;
    public chgAddr?: string;
}

export class BTCWallet {
    // m/bip_number/coin_type/account/internal_or_external/index, we don't use change address
    public static BIP44_BTC_TESTNET_BASE_PATH: string = 'm/44\'/1\'/0\'/0/';
    public static BIP44_BTC_MAINNET_BASE_PATH: string = 'm/44\'/0\'/0\'/0/';

    // most look ahead addresses
    public static GAP_LIMIT: number = 3;

    // minimum confirmations
    public static MIN_CONFIRMATIONS: number = 6;

    public static SAFELOW_FEE: number = 2;
    public static HIGHEST_FEE: number = 10;
    // funds that have at least `MIN_CONFIRMATION`
    public balance: number;

    public usedAdresses:any = {};
    public utxos: any = [];
    public network: NETWORK;
    public language: LANGUAGE;

    // used to retreive all the utxos of this wallet
    public rootXpub: string;

    public api: Api;    

    // dedicated for HD wallet, should be encrypted
    private rootXpriv: string;
    private mnemonics: string;

    private isLocked: boolean = false;
    private isInitialized: boolean = false;

    constructor() {
        this.api = new Api();
    }

    /* tslint:disable:jsdoc-format */
    /* tslint:disable: no-redundant-jsdoc*/
     /**
     * Generate an HD wallet from scratch
     * 
     * @static
     * @param {string} passwd Password used to encrypt secrets
     * @param {number} strength Default to 128, must be a divided by 32
     * @param {NETWORK} network Network idenitifer
     * @param {LANGUAGE} lang Mnenomic language
     * @param {string} [passphrase] Salt used to provide extra credentials to generate seed, default to null
     * @returns {BTCWallet} 
     * @memberof BTCWallet
     */
    public static generate(passwd: string, strength: number, network: NETWORK, lang: LANGUAGE, passphrase?: string): BTCWallet {
        const mn = new Mnemonic(lang);
        passphrase = passphrase || '';
        strength = strength || 128;

        // TODO: check passwd

        const mnemonics = mn.generate(strength);
        if (!mn.check(mnemonics)) {
            throw new Error('Invalid Mnemonic words!');
        }
        const seed = mn.toSeed(mnemonics, passphrase);
        const hdpriv = HDWallet.fromSeed(seed, network);

        const btcwallet = new BTCWallet();
        btcwallet.rootXpriv = hdpriv.toString();
        btcwallet.rootXpub = hdpriv.xpubkey;
        // TODO: encrypt
        btcwallet.mnemonics = mnemonics;

        return btcwallet;
    }

    /**
     * Build HD wallet from mnemonic words
     * 
     * @static
     * @param {string} mnemonic Mnemonic words
     * @param {("mainnet" | "testnet")} network Which network to use
     * @param {("english" | "chinese_simplified" | "chinese_traditional")} lang Language
     * @param {string} [passphrase] Passphrase used as salt, don't recommand to use
     * @returns {BTCWallet} 
     * @memberof BTCWallet
     */
    public static fromMnemonic(passwd: string, mnemonic: string, network: NETWORK, lang: LANGUAGE, passphrase?: string): BTCWallet {
        const mn = new Mnemonic(lang);
        passphrase = passphrase || '';

        if (!mn.check(mnemonic)) {
            throw new Error('Invalid Mnemonic words!');
        }
        const seed = mn.toSeed(mnemonic, passphrase);

        const hdpriv = HDWallet.fromSeed(seed, network);
        const btcwallt = new BTCWallet();
        
        btcwallt.rootXpriv = hdpriv.toString();
        btcwallt.mnemonics = mnemonic;
        btcwallt.rootXpub = hdpriv.xpubkey;
        btcwallt.network = network;
        btcwallt.language = lang;

        btcwallt.lock(passwd);

        return btcwallt;
    }

    /**
     * Restore wallet from previously exported json string
     *
     * @static
     * @param {string} json
     * @param {string} passwd
     * @param {string} passphrase
     * @returns {BTCWallet}
     * @memberof BTCWallet
     */
    public static fromJSON(json: string, passwd: string, passphrase?: string): BTCWallet {
        const obj = JSON.parse(json);
        const mnemonics = cipher.decrypt(passwd, obj.mnemonics);
        const network = obj.network;
        const language = obj.language;

        return BTCWallet.fromMnemonic(passwd, mnemonics, network, language, passphrase);
    }

    public getBlance(): number {
        return this.balance;
    }
    public setBlance(balance: number): void {
        this.balance = balance;
    }
    
    public lock(passwd: string): void {
        if (this.isLocked === false) {
            this.rootXpriv = cipher.encrypt(passwd, this.rootXpriv);
            this.mnemonics = cipher.encrypt(passwd, this.mnemonics);
            this.isLocked = true;
        }
    }

    public unlock(passwd: string): void {
        if (this.isLocked === true) {
            this.rootXpriv = cipher.decrypt(passwd, this.rootXpriv);
            this.mnemonics = cipher.decrypt(passwd, this.mnemonics);
            this.isLocked = false;
        }
    }

    public exportMnemonics(): string {
        if (this.isLocked === true) {
            throw new Error('You need to unlock wallet first!');
        }

        return this.mnemonics;
    }

    /**
     * Export WIF format private key for specified index
     * 
     * @param {number} index 
     * @returns {string} 
     * @memberof BTCWallet
     */
    public exportWIFOf(index: number): string {
        return this.privateKeyOf(index).toWIF();
    }

    public toJSON(): string {
        if (!this.isLocked) {
            throw new Error('You must lock the wallet first and then export the JSON format representation');
        }
        
        return JSON.stringify({ mnemonics: this.mnemonics,
            network: this.network,
            language: this.language});
    }

    /**
     * Derive address according to `index`
     *
     * @param {number} index Index number
     * @returns {string} Derived address
     * @memberof BTCWallet
     */
    public derive(index: number): string {
        return this.privateKeyOf(index).toAddress().toString();
    }

    /**
     * Spend btc from all available utxos, using index 0 address as the default change address.
     * 
     * Our spend policies are:
     * 
     * 1. utxo must at least `MIN_CONFIRMATIONS`
     * 2. spend the most matured coins
     * 
     * TODO: design a smarter stratagy (http://bitcoinfees.com/)
     *
     * @param {Output} output Specify `toAddr`, `amount` and `chgaddr`
     * @param {PRIORITY} priority How long the user wish to waiting for
     * @returns {Promise<string>} Transaction hash of this transaction
     * @memberof BTCWallet
     */
    public async spend(output: Output, priority: PRIORITY): Promise<string> {
        if (!this.isInitialized) {
            throw new Error('Wallet uninitialized!');
        }

        if (output.amount >= this.balance) {
            throw new Error('Insufficient balance!');
        }

        // TODO: check error
        let fee = await this.api.feePerByte();
        switch (priority) {
            case 'high':
                fee = fee.fastestFee;
                break;
            case 'medium':
                fee = fee.halfHourFee;
                break;
            case 'low':
                fee = fee.hourFee;
                break;
            default:
                fee = BTCWallet.SAFELOW_FEE;
        }

        if (fee < BTCWallet.SAFELOW_FEE || fee > BTCWallet.HIGHEST_FEE) {
            throw new Error('Abnormal fee rate');
        }

        // sort by transaction confirmations
        this.utxos.sort((a, b) => a.confirmations - b.confirmations);

        const collected = [];
        let accumlated = 0;
        for (let i = 0; i < this.utxos.length; i++) {
            accumlated += this.utxos[i].amount;
            collected.push(this.utxos[i]);
            if (accumlated > output.amount) {
                break;
            }
        }

        const keySet = [];
        for (let i = 0; i < collected.length; i++) {
            keySet.push(this.privateKeyOf(this.usedAdresses[collected[i].address]));
        }

        console.log('collected: ', collected);
        console.log('accumlated: ', accumlated);
        console.log('keyset length: ', keySet.length);

        output.amount = Unit.fromBTC(output.amount).toSatoshis();
        const rawTx = new Transaction().feePerKb(fee * 2000)
            .from(collected)
            .to(output.toAddr, output.amount)
            .change(output.chgAddr === undefined ? this.derive(0) : output.chgAddr)
            .sign(keySet);

        console.log('rawTx:', rawTx);

        const serialized = rawTx.serialize(true);
        console.log('serialized:', serialized);

        const res = await this.api.sendRawTransaction(serialized);
        if (res === undefined || res.hasOwnProperty('error')) {
            throw new Error(res.error);
        }
        console.log('txHash: ',res.tx.hash);
        
        return res.tx.hash;
    }

    // TODO: we should distinguish `confirmed`, `unconfirmed` and `spendable`
    public async calcBalance(address?:string): Promise<number> {
        let sum = 0;

        // TODO: use array.reduce ?
        if (address === undefined) {
            for (let i = 0; i < this.utxos.length; i++) {
                sum += this.utxos[i].amount;
            }
        } else {
            for (let i = 0; i < this.utxos.length; i++) {
                if (this.utxos[i].address === address) {
                    sum += this.utxos[i].amount;
                }
            }
        }
 
        return sum;
    }

    public async init(): Promise<void> {
        if (!this.isInitialized) {
            try {
                await this.scanUsedAddress();
                await this.getUnspentOutputs();
                this.balance = await this.calcBalance();
                this.isInitialized = true;
            } catch (e) {
                throw new Error('Failed to initialize wallet!');
            }
        }

        console.log('Wallet initialize successfully!');
    }

    public async getUnspentOutputs(confirmations: number = 1): Promise<UTXO[]> {
        this.utxos = [];
        for (let i = 0; i < Object.keys(this.usedAdresses).length; i++) {
            const address = this.derive(i);
            // TODO: batch requrest (https://blockcypher.github.io/documentation/#batching)
            const addrinfo = await this.api.getAddrInfo(address, true);
            if (addrinfo === undefined || addrinfo.hasOwnProperty('error')) {
                throw new Error('Response error!');
            }
            if (addrinfo.final_balance !== 0 && addrinfo.txrefs.length !== 0) {
                const utxo = addrinfo.txrefs;
                for (let j = 0; j < utxo.length; j++) {
                    if (utxo[j].confirmations >= confirmations) {
                        this.utxos.push({
                            txid: utxo[j].tx_hash,
                            vout: utxo[j].tx_output_n,
                            address: address,
                            scriptPubKey: this.p2pkh(address).toHex(),
                            amount: Unit.fromSatoshis(utxo[j].value).BTC,
                            confirmations: utxo[j].confirmations
                        });
                    }
                }
            }
        }
        
        return this.utxos;
    }

    public async scanUsedAddress(): Promise<number> {
        let count = 0;
        let i     = 0;
        this.usedAdresses = [];
        for (i = 0; ; i++) {
            const res = await this.api.getAddrInfo(this.derive(i));
            if (res === undefined || res.hasOwnProperty('error')) {
                throw new Error('Response error!');
            }
            if (res.total_received === 0 && res.total_sent === 0) {
                count = count + 1;
            } else {
                this.usedAdresses[res.address] = i;
                count = 0;
            }

            if (count > BTCWallet.GAP_LIMIT) {
                break;
            }
        }

        return i - BTCWallet.GAP_LIMIT;
    }

    private privateKeyOf(index: number): any {
        if (this.isLocked === true) {
            throw new Error('You need to unlock wallet first!');
        }

        let path: string;
        const parent = new HDWallet(this.rootXpriv);

        if (parent.network.name === 'testnet') {
            path = BTCWallet.BIP44_BTC_TESTNET_BASE_PATH + index;
        } else if (parent.network.name === 'livenet') {
            path = BTCWallet.BIP44_BTC_MAINNET_BASE_PATH + index;
        } else {
            throw new Error('Unexpected network name!');
        }

        return parent.derive(path).privateKey;
    }

    private p2pkh(address: string): any {
        return Script.buildPublicKeyHashOut(address);
    }
}