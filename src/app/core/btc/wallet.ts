
/**
 * BTC HD wallet implementaion
 */
import { Cipher } from '../crypto/cipher';
import { Mnemonic } from '../thirdparty/bip39';
import { bitcore } from '../thirdparty/bitcore-lib';
import { BtcApi } from './api';

const HDWallet = bitcore.HDPrivateKey;
const Transaction = bitcore.Transaction;
const Unit = bitcore.Unit;

const cipher = new Cipher();

export type LANGUAGE = 'english' | 'chinese_simplified' | 'chinese_traditional' | 'japanese';
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
    public totalBalance: number;

    public usedAdresses: any = {};
    public utxos: any = [];
    public network: NETWORK;
    public language: LANGUAGE;

    // dedicated for HD wallet, should be encrypted
    private rootXpriv: string;
    private mnemonics: string;
    private rootSeed: string;

    private isLocked: boolean = false;
    private isInitialized: boolean = false;

    constructor() {
        // todo
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
        btcwallt.rootSeed = seed;
        btcwallt.network = network;
        btcwallt.language = lang;

        btcwallt.lock(passwd);

        return btcwallt;
    }

    public static fromSeed(passwd: string, seed: string, network: NETWORK, lang: LANGUAGE): BTCWallet {
        // TODO: check seed ?
        const hdpriv = HDWallet.fromSeed(seed, network);
        const btcwallt = new BTCWallet();

        btcwallt.rootXpriv = hdpriv.toString();
        btcwallt.rootSeed = seed;
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
        const rootseed = cipher.decrypt(passwd, obj.rootseed);
        const network = obj.network;
        const language = obj.language;

        return BTCWallet.fromSeed(passwd, rootseed, network, language);
    }

    public getTotalBlance(): number {
        return this.totalBalance;
    }
    public setTotalBlance(totalBalance: number): void {
        this.totalBalance = totalBalance;
    }

    public lock(passwd: string): void {
        if (this.isLocked === false) {
            this.rootXpriv = cipher.encrypt(passwd, this.rootXpriv);
            this.rootSeed = cipher.encrypt(passwd, this.rootSeed);
            if (this.mnemonics !== undefined) {
                this.mnemonics = cipher.encrypt(passwd, this.mnemonics);
            }
            this.isLocked = true;
        }
    }

    public unlock(passwd: string): void {
        if (this.isLocked === true) {
            this.rootXpriv = cipher.decrypt(passwd, this.rootXpriv);
            this.rootSeed = cipher.decrypt(passwd, this.rootSeed);
            if (this.mnemonics !== undefined && this.mnemonics.length !== 0) {
                this.mnemonics = cipher.decrypt(passwd, this.mnemonics);
            }
            this.isLocked = false;
        }
    }

    public exportMnemonics(): string {
        if (this.isLocked === true) {
            throw new Error('You need to unlock wallet first!');
        }

        return this.mnemonics;
    }

    public deleteMnemonics(): void {
        if (this.isLocked === true) {
            throw new Error('You need to unlock wallet first!');
        }
        if (this.mnemonics.length === 0) {
            throw new Error('Mnemonics have been deleted!');
        }
        this.mnemonics = '';
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

        return JSON.stringify({
            rootxpriv: this.rootXpriv,
            rootseed: this.rootSeed,
            mnemonics: this.mnemonics,
            network: this.network,
            language: this.language
        });
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
     * build raw btc transaction from all available utxos, using index 0 address as the default change address.
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
    public async buildRawTransaction(output: Output, priority: PRIORITY): Promise<[string, number]> {
        if (!this.isInitialized) {
            throw new Error('Wallet uninitialized!');
        }

        if (output.amount >= this.totalBalance) {
            throw new Error('Insufficient totalBalance!');
        }

        // TODO: check error
        // let fee: any;
        const priorityMap = {
            low: 6,
            medium: 3,
            high: 2
        };
        const fee = await BtcApi.estimateFee(priorityMap[priority]);

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
        const rawTx = new Transaction().feePerKb(Unit.fromBTC(fee[priorityMap[priority]]).toSatoshis())
            .from(collected)
            .to(output.toAddr, output.amount)
            .change(output.chgAddr === undefined ? this.derive(0) : output.chgAddr)
            .sign(keySet);

        console.log('rawTx:', rawTx);
        console.log('txFee:', rawTx.getFee());

        const serialized = rawTx.serialize(true);
        console.log('serialized:', serialized);

        return [serialized, rawTx.getFee()];
    }

    // TODO: we should distinguish `confirmed`, `unconfirmed` and `spendable`
    public async calcBalance(address?: string): Promise<number> {
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
                this.totalBalance = await this.calcBalance();
                this.isInitialized = true;
            } catch (e) {
                throw new Error('Failed to initialize wallet!');
            }
        }

        console.log('Wallet initialize successfully!');
    }

    public async getUnspentOutputs(): Promise<UTXO[]> {
        this.utxos = [];
        for (let i = 0; i < Object.keys(this.usedAdresses).length; i++) {
            const address = this.derive(i);
            const addrUtxo = await BtcApi.getAddrUnspent(address);
            addrUtxo.forEach((utxo) => {
                this.utxos.push({
                    txid: utxo.txid,
                    vout: utxo.vout,
                    address: address,
                    scriptPubKey: utxo.scriptPubKey,
                    amount: utxo.amount,
                    confirmations: utxo.confirmations
                });
            });
        }

        return this.utxos;
    }

    // TODO: consider make this as a server side api
    public async scanUsedAddress(): Promise<number> {
        let count = 0;
        let i = 0;
        this.usedAdresses = [];
        for (i = 0; ; i++) {
            const addr = this.derive(i);
            const res = await BtcApi.getAddrTxHistory(addr);
            if (!res || res.txs.length === 0) {
                count = count + 1;
            } else {
                this.usedAdresses[addr] = i;
                count = 0;
            }

            if (count > BTCWallet.GAP_LIMIT) {
                break;
            }
        }

        return i - BTCWallet.GAP_LIMIT;
    }

    public privateKeyOf(index: number): any {
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
}