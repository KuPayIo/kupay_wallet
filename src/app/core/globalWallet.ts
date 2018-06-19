/**
 * global wallet
 */
import { getDefaultAddr } from '../utils/tools';
import { Addr, CurrencyRecord } from '../view/interface';
import { BTCWallet } from './btc/wallet';
import { Cipher } from './crypto/cipher';
import { GaiaWallet } from './eth/wallet';
import { generate } from './genmnemonic';

const cipher = new Cipher();

const strength = 128;
const btcNetwork = 'testnet';
const lang = 'english';

/* tslint:disable: variable-name */
export class GlobalWallet {
    private _glwtId:string;
    private _nickName: string;
    private _mnemonic: string;
    private _currencyRecords:CurrencyRecord[] = [];
    private _addrs:Addr[] = [];
    
    get glwtId():string {
        return this._glwtId;
    }
    get nickName() : string {
        return this._nickName;
    }

    set nickName(name: string) {
        this._nickName = name;
    }
    get mnemonic() : string {
        return this._mnemonic;
    }
    set mnemonic(mnemonic: string) {
        this._mnemonic = mnemonic;
    }

    get currencyRecords() {
        return this._currencyRecords;
    }

    get addrs() {
        return this._addrs;
    }

    public static fromJSON(jsonstring: string) : GlobalWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new GlobalWallet();

        gwlt._glwtId = wlt.glwtId;
        gwlt._nickName = wlt.nickname;
        gwlt._mnemonic = wlt.mnemonic;

        return gwlt;
    }

    public static fromMnemonic(mnemonic: string, passwd: string, passphrase?: string) : GlobalWallet {
        const gwlt = new GlobalWallet();
        gwlt._mnemonic = cipher.encrypt(passwd, mnemonic);

        // 创建ETH钱包
        const ethGwlt = this.createEthGwlt(passwd,mnemonic);
        gwlt._glwtId = ethGwlt.addr.addr;
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(ethGwlt.addr);

        // 创建BTC钱包
        const btcGwlt = this.createBtcGwlt(passwd,mnemonic);
        gwlt._currencyRecords.push(btcGwlt.currencyRecord);
        gwlt._addrs.push(btcGwlt.addr);

        return gwlt;
    }

    /**
     * create GlobalWallet
     * @param passwd password
     * @param walletName  wallet name
     * @param passphrase passphrase
     */
    public static generate(passwd: string,walletName:string, passphrase?: string) : GlobalWallet {
        const gwlt = new GlobalWallet();
        gwlt._nickName = walletName;

        const mnemonic = generate(lang, strength);
        gwlt._mnemonic = cipher.encrypt(passwd, mnemonic);

        // 创建ETH钱包
        const ethGwlt = this.createEthGwlt(passwd,mnemonic);
        gwlt._glwtId = ethGwlt.addr.addr;
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(ethGwlt.addr);

        // 创建BTC钱包
        const btcGwlt = this.createBtcGwlt(passwd,mnemonic);
        gwlt._currencyRecords.push(btcGwlt.currencyRecord);
        gwlt._addrs.push(btcGwlt.addr);

        return gwlt;
    }

    private static createEthGwlt(passwd: string,mnemonic:string) {
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang, passwd);
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const addr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            wlt: gaiaWallet.toJSON(),
            record: [],
            balance: 0,
            currencyName: 'ETH'
        };

        return {
            currencyRecord,
            addr
        };
    }

    private static createBtcGwlt(passwd: string,mnemonic:string) {
        // todo 测试阶段，使用测试链，后续改为主链
        const btcWallet = BTCWallet.fromMnemonic(passwd, mnemonic, btcNetwork, lang);
        btcWallet.unlock(passwd);
        const address = btcWallet.derive(0);
        btcWallet.lock(passwd);
        const currencyRecord: CurrencyRecord = {
            currencyName: 'BTC',
            currentAddr: address,
            addrs: [address]
        };
    
        const addr: Addr = {
            addr: address,
            addrName: getDefaultAddr(address),
            wlt: btcWallet.toJSON(),
            record: [],
            balance: 0,
            currencyName: 'BTC'
        };
    
        return {
            currencyRecord,
            addr
        };
    }

    /**
     * export the mnemonic words of this wallet
     *
     * @param  passwd used to decrypt the mnemonic words
     * @returns  mnemonic
     */
    public exportMnemonic(passwd: string) : string {
        if (this._mnemonic.length !== 0) {
            return cipher.decrypt(passwd, this._mnemonic);
        } else {
            throw new Error('Mnemonic unavailable');
        }
    }

    public toJSON() : string {
        const wlt = {
            glwtId:this._glwtId,
            nickname: this._nickName,
            mnemonic: this._mnemonic
        };

        return JSON.stringify(wlt);
    }

}