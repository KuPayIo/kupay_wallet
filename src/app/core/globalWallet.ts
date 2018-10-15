/**
 * global wallet
 */
import { ERC20Tokens } from '../config';
import { Addr, CurrencyRecord } from '../store/interface';
import { find } from '../store/store';
import { btcNetwork, lang, strength } from '../utils/constants';
import { calcHashValuePromise, u8ArrayToHexstr, initAddr } from '../utils/tools';
import { getMnemonic } from '../utils/walletTools';
import { BTCWallet } from './btc/wallet';
import { Cipher } from './crypto/cipher';
import { EthWallet } from './eth/wallet';
import { generateRandomValues, getRandomValuesByMnemonic, toMnemonic } from './genmnemonic';

const cipher = new Cipher();

/* tslint:disable: variable-name */
export class GlobalWallet {
    private _glwtId: string;
    private _nickName: string;
    private _currencyRecords: CurrencyRecord[] = [];
    private _addrs: Addr[] = [];
    private _vault: string;//加密后的随机数种子
    private _mnemonicBackup: boolean = false;// 助记词备份
    private _publicKey: string;

    get glwtId(): string {
        return this._glwtId;
    }
    get nickName(): string {
        return this._nickName;
    }

    set nickName(name: string) {
        this._nickName = name;
    }
    get currencyRecords() {
        return this._currencyRecords;
    }

    get addrs() {
        return this._addrs;
    }

    get vault() {
        return this._vault;
    }
    set mnemonicBackup(mnemonicBackup: boolean) {
        this._mnemonicBackup = mnemonicBackup;
    }
    get mnemonicBackup() {
        return this._mnemonicBackup;
    }

    get publicKey() {
        return this._publicKey;
    }

    public static fromJSON(jsonstring: string): GlobalWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new GlobalWallet();

        gwlt._glwtId = wlt.glwtId;
        gwlt._nickName = wlt.nickName;
        gwlt._vault = wlt.vault;
        gwlt._mnemonicBackup = wlt.mnemonicBackup;
        gwlt._publicKey = wlt.publicKey;

        return gwlt;
    }

    /**
     * 通过助记词导入钱包
     */
    public static fromMnemonic(hash:string,mnemonic: string){
        const gwlt = new GlobalWallet();
        const vault = getRandomValuesByMnemonic(lang, mnemonic);
        
        gwlt._vault = cipher.encrypt(hash, u8ArrayToHexstr(vault));

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
    public static generate(hash:string, walletName: string, vault?: Uint8Array) {
        const gwlt = new GlobalWallet();
        gwlt._nickName = walletName;
        console.time('generateRandomValues');
        vault = vault || generateRandomValues(strength);
        console.timeEnd('generateRandomValues');
        console.time('encrypt');
        gwlt._vault = cipher.encrypt(hash, u8ArrayToHexstr(vault));
        console.timeEnd('encrypt');
        // console.log('generate hash', hash, gwlt._vault, passwd, u8ArrayToHexstr(vault));
        console.time('toMnemonic');
        const mnemonic = toMnemonic(lang, vault);
        console.timeEnd('toMnemonic');
        console.time('initGwlt');
        gwlt._glwtId = this.initGwlt(gwlt, mnemonic);
        console.timeEnd('initGwlt');
        console.time('getPublicKeyByMnemonic');
        gwlt._publicKey = EthWallet.getPublicKeyByMnemonic(mnemonic, lang);
        console.timeEnd('getPublicKeyByMnemonic');

        // dataCenter.addAddr(ethGwlt.addr.addr, ethGwlt.addr.addrName, ethGwlt.addr.currencyName);
        // dataCenter.addAddr(btcGwlt.addr.addr, btcGwlt.addr.addrName, btcGwlt.addr.currencyName);

        return gwlt;
    }
    /**
     * 动态创建钱包(地址)对象
     */
    public static async createWlt(currencyName: string, passwd: string, wallet: any, i: number) {
        // todo
        const mnemonic = await getMnemonic(wallet, passwd);

        return this.createWltByMnemonic(mnemonic, currencyName, i);
    }

    /**
     * 通过助记词创建对应钱包对象
     */
    public static createWltByMnemonic(mnemonic: string, currencyName: string, i: number) {
        let wlt;
        if (currencyName === 'ETH') {
            const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
            wlt = ethWallet.selectAddressWlt(i);
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

    /**
     * 获取钱包地址的位置
     */
    public static getWltAddrIndex(wallet: any, addr: string, currencyName: string): number {
        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        if (!currencyRecord) return -1;

        return currencyRecord.addrs.indexOf(addr);
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
        const ethGwlt = this.createEthGwlt(mnemonic);
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(ethGwlt.addr);

        // 创建BTC钱包
        const btcGwlt = this.createBtcGwlt(mnemonic);
        gwlt._currencyRecords.push(btcGwlt.currencyRecord);
        gwlt._addrs.push(btcGwlt.addr);

        const ethTokenList = [];
        for (const k in ERC20Tokens) {
            if (ERC20Tokens.hasOwnProperty(k)) {
                ethTokenList.push(k);
            }
        }
        // ETH代币创建
        ethTokenList.forEach(tokenName => {
            const tokenRecord = {
                ...ethGwlt.currencyRecord,
                currencyName: tokenName
            };
            const tokenAddr = {
                ...ethGwlt.addr,
                currencyName: tokenName
            };
            gwlt._currencyRecords.push(tokenRecord);
            gwlt._addrs.push(tokenAddr);

        });

        // dataCenter.addAddr(ethGwlt.addr.addr, ethGwlt.addr.addrName, ethGwlt.addr.currencyName);
        // dataCenter.addAddr(btcGwlt.addr.addr, btcGwlt.addr.addrName, btcGwlt.addr.currencyName);

        return ethGwlt.addr.addr;
    }

    private static createEthGwlt(mnemonic: string) {
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const address = ethWallet.selectAddress(0);
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: address,
            addrs: [address],
            updateAddr: false
        };
        const addr: Addr = initAddr(address, 'ETH');

        return {
            currencyRecord,
            addr
        };
    }

    private static createBtcGwlt(mnemonic: string) {
        // todo 测试阶段，使用测试链，后续改为主链
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        btcWallet.unlock();
        const address = btcWallet.derive(0);
        btcWallet.lock();
        const currencyRecord: CurrencyRecord = {
            currencyName: 'BTC',
            currentAddr: address,
            addrs: [address],
            updateAddr: false
        };

        const addr: Addr = initAddr(address, 'BTC');

        return {
            currencyRecord,
            addr
        };
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
            nickName: this._nickName,
            vault: this._vault,
            mnemonicBackup: this._mnemonicBackup,
            publicKey: this._publicKey
        };

        return JSON.stringify(wlt);
    }

    /**
     * 修改密码
     */
    public async passwordChange(oldPsw: string, newPsw: string) {
        const salt = find('salt');
        const oldHash = await calcHashValuePromise(oldPsw, salt);
        const newHash = await calcHashValuePromise(newPsw, salt);
        // console.log('passwordChange hash', oldHash, this._vault, oldPsw, newHash, newPsw);

        const oldVault = cipher.decrypt(oldHash, this._vault);
        this._vault = cipher.encrypt(newHash, oldVault);

    }

}
