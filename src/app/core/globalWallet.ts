/**
 * global wallet
 */
import { btcNetwork, ERC20Tokens } from '../config';
import { AddrInfo, CurrencyRecord } from '../store/interface';
import { encrypt } from '../utils/cipherTools';
import { lang, strength } from '../utils/constants';
import { getMnemonic, u8ArrayToHexstr } from '../utils/tools';
import { BTCWallet } from './btc/wallet';
import { EthWallet } from './eth/wallet';
import { generateRandomValues, getRandomValuesByMnemonic, toMnemonic } from './genmnemonic';

/* tslint:disable: variable-name */
export class GlobalWallet {
    private _glwtId: string;
    private _currencyRecords: CurrencyRecord[] = [];
    private _vault: string;// 加密后的随机数种子
    private _isBackup: boolean = false;// 助记词备份
    private _publicKey: string;

    get glwtId(): string {
        return this._glwtId;
    }
    get currencyRecords() {
        return this._currencyRecords;
    }

    get vault() {
        return this._vault;
    }
    set isBackup(isBackup: boolean) {
        this._isBackup = isBackup;
    }
    get isBackup() {
        return this._isBackup;
    }

    get publicKey() {
        return this._publicKey;
    }

    public static fromJSON(jsonstring: string): GlobalWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new GlobalWallet();

        gwlt._glwtId = wlt.glwtId;
        gwlt._vault = wlt.vault;
        gwlt._isBackup = wlt.isBackup;
        gwlt._publicKey = wlt.publicKey;

        return gwlt;
    }

    /**
     * 通过助记词导入钱包
     */
    public static fromMnemonic(secrectHash:string,mnemonic: string) {
        const gwlt = new GlobalWallet();
        const vault = getRandomValuesByMnemonic(lang, mnemonic);
        
        gwlt._vault = encrypt(u8ArrayToHexstr(vault),secrectHash);

        gwlt._glwtId = this.initGwlt(gwlt, mnemonic);

        gwlt._publicKey = EthWallet.getPublicKeyByMnemonic(mnemonic, lang);

        return gwlt;
    }

    /**
     * create GlobalWallet
     * @param passwd password
     * @param walletName  wallet name
     * @param passphrase passphrase
     */
    public static generate(secrectHash:string, vault?: Uint8Array) {
        const gwlt = new GlobalWallet();
        vault = vault || generateRandomValues(strength);
        console.time('pi_create generate encrypt need');
        gwlt._vault = encrypt(u8ArrayToHexstr(vault),secrectHash);
        console.timeEnd('pi_create generate encrypt need');
        console.time('pi_create generate toMnemonic need');
        const mnemonic = toMnemonic(lang, vault);
        console.timeEnd('pi_create generate toMnemonic need');
        console.time('pi_create generate initGwlt need');
        gwlt._glwtId = this.initGwlt(gwlt, mnemonic);
        console.timeEnd('pi_create generate initGwlt need');
        console.time('pi_create generate getPublicKeyByMnemonic need');
        gwlt._publicKey = EthWallet.getPublicKeyByMnemonic(mnemonic, lang);
        console.timeEnd('pi_create generate getPublicKeyByMnemonic need');

        return gwlt;
    }
    /**
     * 动态创建钱包(地址)对象
     */
    public static async createWlt(currencyName: string, passwd: string, i: number) {
        // todo
        const mnemonic = await getMnemonic(passwd);

        return this.createWltByMnemonic(mnemonic, currencyName, i);
    }

    /**
     * 通过助记词创建对应钱包对象
     */
    public static createWltByMnemonic(mnemonic: string, currencyName: string, i: number) {
        let wlt;
        if (currencyName === 'ETH') {
            console.time('trans EthWallet.fromMnemonic');
            const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
            console.timeEnd('trans EthWallet.fromMnemonic');
            console.time('trans ethWallet.selectAddressWlt');
            wlt = ethWallet.selectAddressWlt(i);
            console.timeEnd('trans ethWallet.selectAddressWlt');
        } else if (currencyName === 'BTC') {
            wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        } else if (ERC20Tokens[currencyName]) {
            const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
            wlt = ethWallet.selectAddressWlt(i);
        }

        return wlt;
    }

    /**
     * 
     * 通过助记词获得指定位置的钱包地址
     */
    public static getWltAddrByMnemonic(mnemonic: string, currencyName: string, i: number) {
        let addr;
        if (currencyName === 'ETH') {
            const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
            addr = ethWallet.selectAddress(i);
        } else if (currencyName === 'BTC') {
            const wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
            wlt.unlock();
            addr = wlt.derive(i);
            wlt.lock();
        } else if (ERC20Tokens[currencyName]) {
            const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
            addr = ethWallet.selectAddress(i);
        }

        return addr;
    }

    /*****************************************
     * 私有静态函数
     * ************************************************************

    /**
     * init GlobalWallet
     * @param passwd password
     * @param walletName  wallet name
     * @param passphrase passphrase
     */
    private static initGwlt(gwlt: GlobalWallet, mnemonic: string) {
        // 创建ETH钱包
        console.time('pi_create createEthGwlt');
        const ethCurrencyRecord = this.createEthGwlt(mnemonic);
        console.timeEnd('pi_create createEthGwlt');
        gwlt._currencyRecords.push(ethCurrencyRecord);

        // 创建BTC钱包
        console.time('pi_create createBtcGwlt');
        const btcCurrencyRecord = this.createBtcGwlt(mnemonic);
        console.timeEnd('pi_create createBtcGwlt');
        gwlt._currencyRecords.push(btcCurrencyRecord);

        const ethTokenList = [];
        for (const k in ERC20Tokens) {
            if (ERC20Tokens.hasOwnProperty(k)) {
                ethTokenList.push(k);
            }
        }
        // ETH代币创建
        ethTokenList.forEach(tokenName => {
            const ethAddrInfo = ethCurrencyRecord.addrs[0];
            const erc20AddrInfo:AddrInfo = {
                addr: ethAddrInfo.addr,               
                balance: 0,                
                txHistory: [],          
                nonce: 0 
            };
            const tokenRecord = {
                ...ethCurrencyRecord,
                currencyName: tokenName,
                addrs:[erc20AddrInfo]
            };
            gwlt._currencyRecords.push(tokenRecord);
        });

        return ethCurrencyRecord.currentAddr;
    }

    private static createEthGwlt(mnemonic: string) {
        console.time('pi_create EthWallet.fromMnemonic');
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        console.timeEnd('pi_create EthWallet.fromMnemonic');
        console.time('pi_create ethWallet.selectAddress');
        const address = ethWallet.selectAddress(0);
        console.timeEnd('pi_create ethWallet.selectAddress');
        const addrInfo:AddrInfo = {
            addr: address,                  // 地址
            balance: 0,              // 余额
            txHistory: [],         // 交易记录
            nonce: 0                  // 本地维护的nonce(对BTC无效)
        };
        // tslint:disable-next-line:no-unnecessary-local-variable
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: address,
            addrs: [addrInfo],
            updateAddr: false
        };

        return currencyRecord;
    }

    private static createBtcGwlt(mnemonic: string) {
        console.time('pi_create BTCWallet.fromMnemonic');
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        console.timeEnd('pi_create BTCWallet.fromMnemonic');
        btcWallet.unlock();
        console.time('pi_create btcWallet.derive');
        const address = btcWallet.derive(0);
        console.timeEnd('pi_create btcWallet.derive');
        btcWallet.lock();
        const addrInfo:AddrInfo = {
            addr: address,                  // 地址
            balance: 0,              // 余额
            txHistory: [],         // 交易记录
            nonce: 0                  // 本地维护的nonce(对BTC无效)
        };
        // tslint:disable-next-line:no-unnecessary-local-variable
        const currencyRecord: CurrencyRecord = {
            currencyName: 'BTC',
            currentAddr: address,
            addrs: [addrInfo],
            updateAddr: false
        };

        return currencyRecord;
    }

    /**********************************************
     * 公共内部函数
     * *******************************************************************/
    /** 
     * 当前对象转化为json字符串
     */
    public toJSON(): string {
        const wlt = {
            glwtId: this._glwtId,
            vault: this._vault,
            isBackup: this._isBackup,
            publicKey: this._publicKey
        };

        return JSON.stringify(wlt);
    }

}
