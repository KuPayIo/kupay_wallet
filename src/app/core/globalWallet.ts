/**
 * global wallet
 */
import { dataCenter } from '../store/dataCenter';
import { btcNetwork, lang, strength } from '../utils/constants';
import { calcHashValuePromise, getMnemonic, u8ArrayToHexstr } from '../utils/tools';
import { Addr, CurrencyRecord } from '../view/interface';
import { BTCWallet } from './btc/wallet';
import { Cipher } from './crypto/cipher';
import { ERC20Tokens } from './eth/tokens';
import { GaiaWallet } from './eth/wallet';
import { generateRandomValues, getRandomValuesByMnemonic, toMnemonic } from './genmnemonic';

const cipher = new Cipher();

/* tslint:disable: variable-name */
export class GlobalWallet {
    private _glwtId: string;
    private _nickName: string;
    private _currencyRecords: CurrencyRecord[] = [];
    private _addrs: Addr[] = [];
    private _vault: string;
    private _mnemonicBackup: boolean = false;// 助记词备份

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

    public static fromJSON(jsonstring: string): GlobalWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new GlobalWallet();

        gwlt._glwtId = wlt.glwtId;
        gwlt._nickName = wlt.nickname;
        gwlt._vault = wlt.vault;
        gwlt._mnemonicBackup = wlt.mnemonicBackup;

        return gwlt;
    }

    /**
     * 通过助记词导入钱包
     */
    public static async fromMnemonic(mnemonic: string, passwd: string, passphrase?: string): Promise<GlobalWallet> {
        const hash = await calcHashValuePromise(passwd, dataCenter.salt, null);
        const gwlt = new GlobalWallet();

        const vault = getRandomValuesByMnemonic(lang, mnemonic);
        gwlt._vault = cipher.encrypt(hash, u8ArrayToHexstr(vault));

        gwlt._glwtId = this.initGwlt(gwlt, mnemonic);

        dataCenter.setHash(gwlt._glwtId, hash);

        // 更新内存数据中心
        gwlt._addrs.forEach(item => {
            dataCenter.addAddr(item.addr, item.addrName, item.currencyName);
        });

        return gwlt;
    }

    /**
     * create GlobalWallet
     * @param passwd password
     * @param walletName  wallet name
     * @param passphrase passphrase
     */
    public static async generate(passwd: string, walletName: string, passphrase?: string, vault?: Uint8Array) {
        const hash = await calcHashValuePromise(passwd, dataCenter.salt, null);
        const gwlt = new GlobalWallet();
        gwlt._nickName = walletName;
        vault = vault || generateRandomValues(strength);
        gwlt._vault = cipher.encrypt(hash, u8ArrayToHexstr(vault));
        // console.log('generate hash', hash, gwlt._vault, passwd, u8ArrayToHexstr(vault));

        const mnemonic = toMnemonic(lang, vault);
        gwlt._glwtId = this.initGwlt(gwlt, mnemonic);

        dataCenter.setHash(gwlt._glwtId, hash);

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
            const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
            wlt = gaiaWallet.selectAddressWlt(i);
        } else if (currencyName === 'BTC') {
            wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        } else if (ERC20Tokens[currencyName]) {
            const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
            wlt = gaiaWallet.selectAddressWlt(i);
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
            const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
            addr = gaiaWallet.selectAddress(i);
        } else if (currencyName === 'BTC') {
            const wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
            wlt.unlock();
            addr = wlt.derive(i);
            wlt.lock();
        } else if (ERC20Tokens[currencyName]) {
            const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
            addr = gaiaWallet.selectAddress(i);
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

        const ethTokenList = Object.keys(ERC20Tokens);
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
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
        const address = gaiaWallet.selectAddress(0);
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: address,
            addrs: [address],
            updateAddr: false
        };
        const addr: Addr = dataCenter.initAddr(address, 'ETH');

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

        const addr: Addr = dataCenter.initAddr(address, 'BTC');

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
            nickname: this._nickName,
            vault: this._vault,
            mnemonicBackup: this._mnemonicBackup
        };

        return JSON.stringify(wlt);
    }

    /**
     * 修改密码
     */
    public async passwordChange(oldPsw: string, newPsw: string, walletId: string) {
        // todo 这里需要处理修改密码
        const oldHash = await calcHashValuePromise(oldPsw, dataCenter.salt, walletId);
        const newHash = await calcHashValuePromise(newPsw, dataCenter.salt, null);
        // console.log('passwordChange hash', oldHash, this._vault, oldPsw, newHash, newPsw);

        const oldVault = cipher.decrypt(oldHash, this._vault);
        this._vault = cipher.encrypt(newHash, oldVault);

        // 更新hash
        dataCenter.setHash(walletId, newHash);
    }

}