/**
 * global wallet
 */
import { dataCenter } from '../store/dataCenter';
import { btcNetwork, defaultEthToken, lang, strength } from '../utils/constants';
import { calcHashValuePromise, decrypt, getDefaultAddr, getMnemonic, u8ArrayToHexstr } from '../utils/tools';
import { Addr, CurrencyRecord } from '../view/interface';
import { BTCWallet } from './btc/wallet';
import { Cipher } from './crypto/cipher';
import { ERC20Tokens } from './eth/tokens';
import { GaiaWallet } from './eth/wallet';
import { generate, generateRandomValues, getRandomValuesByMnemonic, toMnemonic, toSeed } from './genmnemonic';

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

    public static async fromMnemonic(mnemonic: string, passwd: string, passphrase?: string): Promise<GlobalWallet> {
        const hash = await calcHashValuePromise(passwd, 'somesalt');

        const gwlt = new GlobalWallet();

        const vault = getRandomValuesByMnemonic(lang, mnemonic);
        gwlt._vault = cipher.encrypt(hash, u8ArrayToHexstr(vault));

        // 创建ETH钱包
        const ethGwlt = await this.fromMnemonicETH(mnemonic);
        gwlt._glwtId = ethGwlt.addrs[0].addr;
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(...ethGwlt.addrs);

        // 创建BTC钱包
        const btcGwlt = await this.fromMnemonicBTC(mnemonic);
        gwlt._currencyRecords.push(btcGwlt.currencyRecord);
        gwlt._addrs.push(...btcGwlt.addrs);

        // ETH代币创建
        for (let i = 0; i < defaultEthToken.length; i++) {
            const tokenName = defaultEthToken[i];
            const contractAddress = ERC20Tokens[tokenName];
            const tokenGwlt = await GlobalWallet.fromMnemonicEthToken(tokenName, contractAddress, mnemonic);
            gwlt._currencyRecords.push(tokenGwlt.currencyRecord);
            gwlt._addrs.push(...tokenGwlt.addrs);

            // 更新内存数据中心
            tokenGwlt.addrs.forEach(item => {
                dataCenter.addAddr(item.addr, item.addrName, item.currencyName);
            });
        }

        // todo 动态异步创建其他货币地址

        // 更新内存数据中心
        ethGwlt.addrs.forEach(item => {
            dataCenter.addAddr(item.addr, item.addrName, item.currencyName);
        });
        btcGwlt.addrs.forEach(item => {
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
        const hash = await calcHashValuePromise(passwd, 'somesalt');
        const gwlt = new GlobalWallet();
        gwlt._nickName = walletName;
        vault = vault || generateRandomValues(strength);
        gwlt._vault = cipher.encrypt(hash, u8ArrayToHexstr(vault));
        // console.log('generate hash', hash, gwlt._vault, passwd, u8ArrayToHexstr(vault));

        const mnemonic = toMnemonic(lang, vault);

        // 创建ETH钱包
        const ethGwlt = this.createEthGwlt(mnemonic);
        gwlt._glwtId = ethGwlt.addr.addr;
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(ethGwlt.addr);

        // 创建BTC钱包
        const btcGwlt = this.createBtcGwlt(mnemonic);
        gwlt._currencyRecords.push(btcGwlt.currencyRecord);
        gwlt._addrs.push(btcGwlt.addr);

        // ETH代币创建
        defaultEthToken.forEach(tokenName => {
            const tokenRecord = {
                ...ethGwlt.currencyRecord,
                tokenName
            };
            const tokenAddr = {
                ...ethGwlt.addr,
                tokenName
            };
            gwlt._currencyRecords.push(tokenRecord);
            gwlt._addrs.push(tokenAddr);

        });

        // dataCenter.addAddr(ethGwlt.addr.addr, ethGwlt.addr.addrName, ethGwlt.addr.currencyName);
        // dataCenter.addAddr(btcGwlt.addr.addr, btcGwlt.addr.addrName, btcGwlt.addr.currencyName);

        return gwlt;
    }
    public static async fromSeedEthToken(tokenName: string, contractAddress: string, passwd: string, seed: string) {
        // const hash = await calcHashValuePromise(passwd, 'somesalt');

        const _seed = cipher.decrypt(passwd, seed);
        const gaiaWallet = GaiaWallet.fromSeed(_seed, lang);
        const cnt = await gaiaWallet.scanTokenUsedAddress(contractAddress);
        const currencyRecord: CurrencyRecord = {
            currencyName: tokenName,
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const firstAddr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            record: [],
            balance: 0,
            currencyName: tokenName
        };
        const addrs: Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1; i < cnt; i++) {
            const address = gaiaWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            const addr: Addr = {
                addr: address,
                addrName: getDefaultAddr(address),
                record: [],
                balance: 0,
                currencyName: tokenName
            };
            addrs.push(addr);
        }

        return {
            currencyRecord,
            addrs
        };
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

    private static createEthGwlt(mnemonic: string) {
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
        const address = gaiaWallet.selectAddress(0);
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: address,
            addrs: [address]
        };
        const addr: Addr = {
            addr: address,
            addrName: getDefaultAddr(address),
            record: [],
            balance: 0,
            currencyName: 'ETH'
        };

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
            addrs: [address]
        };

        const addr: Addr = {
            addr: address,
            addrName: getDefaultAddr(address),
            record: [],
            balance: 0,
            currencyName: 'BTC'
        };

        return {
            currencyRecord,
            addr
        };
    }

    private static async fromMnemonicETH(mnemonic: string) {
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
        const cnt = await gaiaWallet.scanUsedAddress();
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const firstAddr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            record: [],
            balance: 0,
            currencyName: 'ETH'
        };
        const addrs: Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1; i < cnt; i++) {
            const address = gaiaWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            const addr: Addr = {
                addr: address,
                addrName: getDefaultAddr(address),
                record: [],
                balance: 0,
                currencyName: 'ETH'
            };
            addrs.push(addr);
        }

        return {
            currencyRecord,
            addrs
        };
    }

    private static async fromMnemonicEthToken(tokenName: string, contractAddress: string, mnemonic: string) {
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang);
        const cnt = await gaiaWallet.scanTokenUsedAddress(contractAddress);
        const currencyRecord: CurrencyRecord = {
            currencyName: tokenName,
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const firstAddr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            record: [],
            balance: 0,
            currencyName: tokenName
        };
        const addrs: Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1; i < cnt; i++) {
            const address = gaiaWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            const addr: Addr = {
                addr: address,
                addrName: getDefaultAddr(address),
                record: [],
                balance: 0,
                currencyName: tokenName
            };
            addrs.push(addr);
        }

        return {
            currencyRecord,
            addrs
        };
    }

    private static async fromMnemonicBTC(mnemonic: string) {
        // todo 测试阶段，使用测试链，后续改为主链
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        btcWallet.unlock();
        const cnt = await btcWallet.scanUsedAddress();
        const address = btcWallet.derive(0);

        const currencyRecord: CurrencyRecord = {
            currencyName: 'BTC',
            currentAddr: address,
            addrs: [address]
        };

        const firstAddr: Addr = {
            addr: address,
            addrName: getDefaultAddr(address),
            record: [],
            balance: 0,
            currencyName: 'BTC'
        };

        const addrs: Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1; i < cnt; i++) {
            const address = btcWallet.derive(i);
            currencyRecord.addrs.push(address);
            const addr: Addr = {
                addr: address,
                addrName: getDefaultAddr(address),
                record: [],
                balance: 0,
                currencyName: 'BTC'
            };
            addrs.push(addr);
        }
        btcWallet.lock();

        return {
            currencyRecord,
            addrs
        };
    }

    public exportSeed(passwd: string): string {
        // todo 这里处理导出种子
        return '';
        // return cipher.decrypt(passwd, this._seed);
    }

    public toJSON(): string {
        const wlt = {
            glwtId: this._glwtId,
            nickname: this._nickName,
            vault: this._vault,
            mnemonicBackup: this._mnemonicBackup
        };

        return JSON.stringify(wlt);
    }

    public async passwordChange(oldPsw: string, newPsw: string) {
        // todo 这里需要处理修改密码
        const oldHash = await calcHashValuePromise(oldPsw, 'somesalt');
        const newHash = await calcHashValuePromise(newPsw, 'somesalt');
        // console.log('passwordChange hash', oldHash, this._vault, oldPsw, newHash, newPsw);

        const oldVault = cipher.decrypt(oldHash, this._vault);
        this._vault = cipher.encrypt(newHash, oldVault);
    }
}