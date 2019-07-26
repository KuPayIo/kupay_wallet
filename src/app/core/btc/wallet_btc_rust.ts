
/**
 * BTC HD wallet implementaion
 */
import { BtcApi } from './api';

declare var api;    // 底层挂到window上的对象

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
    * @param {number} strength Default to 128, must be a divided by 32
    * @param {NETWORK} network Network idenitifer
    * @param {LANGUAGE} lang Mnenomic language
    * @param {string} [passphrase] Salt used to provide extra credentials to generate seed, default to null
    * @returns {BTCWallet}
    * @memberof BTCWallet
    */
    public static generate(strength: number, network: NETWORK, lang: LANGUAGE, passphrase?: string): BTCWallet {
        const res = api.btc.btc_generate(strength, network, passphrase);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 
        const btcwallet = new BTCWallet();
        btcwallet.rootXpriv = res[1];
        btcwallet.mnemonics = res[2];

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
    public static fromMnemonic(mnemonic: string, network: NETWORK, lang: LANGUAGE, passphrase?: string): BTCWallet {
        passphrase = passphrase || '';
        const res = api.btc.btc_from_mnemonic(mnemonic, network, lang, passphrase);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 
        const btcwallt = new BTCWallet();

        btcwallt.rootXpriv = res[1];
        btcwallt.mnemonics = mnemonic;
        btcwallt.rootSeed = res[2];
        btcwallt.network = network;
        btcwallt.language = lang;

        btcwallt.lock();

        return btcwallt;
    }

    public static fromSeed(seed: string, network: NETWORK, lang: LANGUAGE): BTCWallet {
        const res = api.btc.btc_from_seed(seed, network, lang);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 
        const btcwallt = new BTCWallet();

        btcwallt.rootXpriv = res[1];
        btcwallt.rootSeed = seed;
        btcwallt.network = network;
        btcwallt.language = lang;

        btcwallt.lock();

        return btcwallt;
    }

    /**
     * Restore wallet from previously exported json string
     *
     * @static
     * @param {string} json
     * @param {string} passphrase
     * @returns {BTCWallet}
     * @memberof BTCWallet
     */
    public static fromJSON(json: string, passphrase?: string): BTCWallet {
        const obj = JSON.parse(json);
        const rootseed = obj.rootseed;
        const network = obj.network;
        const language = obj.language;

        return BTCWallet.fromSeed(rootseed, network, language);
    }

    public getTotalBlance(): number {
        return this.totalBalance;
    }
    public setTotalBlance(totalBalance: number): void {
        this.totalBalance = totalBalance;
    }

    public lock(): void {
        if (this.isLocked === false) {
            this.isLocked = true;
        }
    }

    public unlock(): void {
        if (this.isLocked === true) {
            this.isLocked = false;
        }
    }

    public exportMnemonics(): string {
        if (this.isLocked === true) {
            throw new Error('You need to unlock wallet first!');
        }

        return this.mnemonics;
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
        const res = api.btc.btc_to_address(this.network, this.privateKeyOf(index));
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return res[1];
    }

    public async coinSelector(address: string, amount: number): Promise<any> {
        // TODO: what if utxos is not an array
        const utxos = await BtcApi.getAddrUnspent(address);

        for (let i = 0; i < utxos.length; i++) {
            if (utxos[i].satoshis === amount) {
                return utxos[i];
            }
        }

        const picked = utxos.filter(u => u.satoshis < amount);
        let sum = 0;
        for (let i = 0; i < picked.length; i++) {
            sum += picked[i].satoshis;
        }

        if (sum === amount) {
            return picked;
        }

        if (sum < amount) {
            for (let i = 0; i < utxos.length; i++) {
                if (utxos[i].satoshis > amount) {
                    return utxos[i];
                }
            }
        }

        utxos.sort((x, y) => x.satoshis < y.satoshis);
        let accumlated = 0;
        const result = [];
        for (let i = 0; i < utxos.length; i++) {
            accumlated += utxos[i].satoshis;
            result.push(utxos[i]);
            if (accumlated > amount) {
                return result;
            }
        }

        return [];
    }

    public async buildRawTransactionFromSingleAddress(address: string, output: Output, minerFee: number): Promise<any> {
        const utxos = await this.coinSelector(address, output.amount * 1e8 + minerFee);
        let totalAmount;
        const assembledInputs = [];
        for (const utxo of utxos) {
            assembledInputs.push(`${utxo.txid}${':'}${utxo.vout}`);
            totalAmount += utxo.satoshis;
        }

        console.log('assembledInputs: ', assembledInputs);

        const res0 = api.btc.btc_build_pay_to_pub_key_hash(output.toAddr);
        if (res0[0] !== 0) throw new Error(`err code ${res0[0]}`);  // 所有的res[0]不等于0表示有异常
        const toAddrScript = `${res0[1]}${':'}${output.amount * 1e8}`;
        
        const res1 = api.btc.btc_build_pay_to_pub_key_hash(output.chgAddr);
        if (res1[0] !== 0) throw new Error(`err code ${res1[0]}`);  // 所有的res[0]不等于0表示有异常
        const changeAddrScript = `${res1[1]}${':'}${totalAmount - output.amount * 1e8 - minerFee}`;

        console.log('toAddrScript: ', toAddrScript);
        console.log('changeAddrScript: ', changeAddrScript);

        const res = api.btc.btc_build_raw_transaction_from_single_address(
            address,
            this.privateKeyOf(this.usedAdresses[address.trim()]),
            assembledInputs,
            `${toAddrScript}${';'}${changeAddrScript}`);

        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return {
            rawTx: res[1],
            fee: minerFee,
            hash: res[2]
        };
    }

    // TODO: we should distinguish `;confirmed`, `;unconfirmed` and `;spendable`
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

    public async resendTx(originTxid: string, minerFee: number): Promise<any> {
        let txInfo;
        try {
            txInfo = await BtcApi.getTxInfo(originTxid);
        } catch (_) {
            throw new Error('Re-send an unknown transaction');
        }

        if (txInfo.confirmations > 0 && txInfo.blockheight !== -1) {
            throw new Error('Transaction has been succeed');
        }

        const vin = txInfo.vin;
        const vout = txInfo.vout;
        const utxos = [];
        let fromAddr = '';

        for (let i = 0; i < vin.length; i++) {
            const address = vin[i].addr;
            fromAddr = address;
            const satoshis = vin[i].valueSat;
             
            const res = api.btc.btc_to_address(this.network, address);
            if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 
            const scriptPubkey = res[1];

            utxos.push({
                txid: vin[i].txid,
                vout: vin[i].vout,
                address: vin[i].addr,
                scriptPubKey: scriptPubkey,
                satoshis: satoshis
            });
        }

        const assembledInputs = [];
        for (const utxo of utxos) {
            assembledInputs.push(`${utxo.txid}${':'}${utxo.vout}`);
        }

        const outputs = [];
        for (let i = 0; i < vout.length; i++) {
            const value = vout[i].satoshis;
            const address = vout[i].scriptPubKey.addresses[0];
            const res = api.btc.btc_to_address(this.network, address);
            if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 
            if (address !== fromAddr) {
                outputs.push(`${res[1]}${':'}${value}`);
            } else {
                outputs.push(`${res[1]}${':'}${value - minerFee}}`);
            }
        }

        const outputScripts = outputs.join(';');
        const privateKey = this.privateKeyOf(this.usedAdresses[fromAddr]);

        const res = api.btc.btc_build_raw_transaction_from_single_address(
            fromAddr,
            privateKey,
            assembledInputs,
            outputScripts);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return {
            rawTx: res[1],
            originTxid: originTxid,
            newTxid: res[2],
            fee: minerFee
        };
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
        this.usedAdresses = {};
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

        const res = api.btc.btc_private_key_of(index, this.rootXpriv);
        if (res[0] !== 0) throw new Error(`err code ${res[0]}`);  // 所有的res[0]不等于0表示有异常 

        return res[1];
    }
}
