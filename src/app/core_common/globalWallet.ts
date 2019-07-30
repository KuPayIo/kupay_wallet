/**
 * global wallet
 */
import { btcNetwork, ERC20Tokens, lang, strength } from '../publicLib/config';
import { AddrInfo, CurrencyRecord } from '../publicLib/interface';
import { u8ArrayToHexstr } from '../publicLib/tools';
import { encrypt, getMnemonic } from '../remote/wallet';
import { importBTCWallet, importEthWallet } from './commonjs';
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
    public static async fromMnemonic(secrectHash:string,mnemonic: string) {
        const gwlt = new GlobalWallet();
        const vault = getRandomValuesByMnemonic(lang, mnemonic);

        // tslint:disable-next-line:max-line-length
        const [_vault,_glwtId,EthWallet] = await Promise.all([encrypt(u8ArrayToHexstr(vault),secrectHash),this.initGwlt(gwlt, mnemonic),importEthWallet()]);
        gwlt._vault = _vault;
        gwlt._glwtId = _glwtId;
        gwlt._publicKey = EthWallet.EthWallet.getPublicKeyByMnemonic(mnemonic, lang);

        return gwlt;
    }

    /**
     * create GlobalWallet
     * @param passwd password
     * @param walletName  wallet name
     * @param passphrase passphrase
     */
    public static async generate(secrectHash:string, vault?: Uint8Array) {
        const gwlt = new GlobalWallet();
        const start1 = new Date().getTime();
        vault = vault || generateRandomValues(strength);
        console.log('计算耗时 generateRandomValues = ',new Date().getTime() - start1);
        const start2 = new Date().getTime();
        gwlt._vault = await encrypt(u8ArrayToHexstr(vault),secrectHash);
        console.log('计算耗时 encrypt = ',new Date().getTime() - start2);
        const start3 = new Date().getTime();
        const mnemonic = toMnemonic(lang, vault);
        console.log('计算耗时 toMnemonic = ',new Date().getTime() - start3);
        const start4 = new Date().getTime();
        gwlt._glwtId = await this.initGwlt(gwlt, mnemonic);
        console.log('计算耗时 initGwlt = ',new Date().getTime() - start4);
        const start5 = new Date().getTime();
        const EthWallet = await importEthWallet();
        gwlt._publicKey = EthWallet.EthWallet.getPublicKeyByMnemonic(mnemonic, lang);
        console.log('计算耗时 getPublicKeyByMnemonic = ',new Date().getTime() - start5);
        
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
    public static async createWltByMnemonic(mnemonic: string, currencyName: string, i: number) {
        let wlt;
        if (currencyName === 'ETH') {
            const EthWallet = await importEthWallet();
            const ethWallet = EthWallet.EthWallet.fromMnemonic(mnemonic, lang);
            wlt = ethWallet.selectAddressWlt(i);
        } else if (currencyName === 'BTC') {
            const BTCWallet = await importBTCWallet();
            wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        } else if (ERC20Tokens[currencyName]) {
            const EthWallet = await importEthWallet();
            const ethWallet = EthWallet.EthWallet.fromMnemonic(mnemonic, lang);
            wlt = ethWallet.selectAddressWlt(i);
        }

        return wlt;
    }

    /**
     * 
     * 通过助记词获得指定位置的钱包地址
     */
    public static async getWltAddrByMnemonic(mnemonic: string, currencyName: string, i: number) {
        let addr;
        if (currencyName === 'ETH') {
            const EthWallet = await importEthWallet();
            const ethWallet = EthWallet.EthWallet.fromMnemonic(mnemonic, lang);
            addr = ethWallet.selectAddress(i);
        } else if (currencyName === 'BTC') {
            const BTCWallet = await importBTCWallet();
            const wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
            wlt.unlock();
            addr = wlt.derive(i);
            wlt.lock();
        } else if (ERC20Tokens[currencyName]) {
            const EthWallet = await importEthWallet();
            const ethWallet = EthWallet.EthWallet.fromMnemonic(mnemonic, lang);
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
    private static async initGwlt(gwlt: GlobalWallet, mnemonic: string) {
        // 创建ETH钱包
        // 创建BTC钱包
        const [ethCurrencyRecord,btcCurrencyRecord] = await Promise.all([this.createEthGwlt(mnemonic),this.createBtcGwlt(mnemonic)]);
        gwlt._currencyRecords.push(ethCurrencyRecord);
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

    private static async createEthGwlt(mnemonic: string) {
        const start1 = new Date().getTime();
        const EthWallet = await importEthWallet();
        const ethWallet = EthWallet.EthWallet.fromMnemonic(mnemonic, lang);
        console.log('计算耗时 EthWallet.fromMnemonic = ',new Date().getTime() - start1);
        const start2 = new Date().getTime();
        const address = ethWallet.selectAddress(0);
        console.log('计算耗时 ethWallet.selectAddress = ',new Date().getTime() - start2);
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

    private static async createBtcGwlt(mnemonic: string) {
        const start1 = new Date().getTime();
        const BTCWallet = await importBTCWallet();
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        console.log('计算耗时 BTCWallet.fromMnemonic = ',new Date().getTime() - start1);
        const start2 = new Date().getTime();
        btcWallet.unlock();
        const address = btcWallet.derive(0);
        btcWallet.lock();
        console.log('计算耗时 BTCWallet.derive = ',new Date().getTime() - start2);
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
