/**
 * global wallet
 */
import { dataCenter } from '../store/dataCenter';
import { btcNetwork,defaultEthToken,lang,strength } from '../utils/constants';
import { decrypt, getDefaultAddr } from '../utils/tools';
import { Addr, CurrencyRecord } from '../view/interface';
import { BTCWallet } from './btc/wallet';
import { Cipher } from './crypto/cipher';
import { ERC20Tokens } from './eth/tokens';
import { GaiaWallet } from './eth/wallet';
import { generate,toSeed } from './genmnemonic';

const cipher = new Cipher();

/* tslint:disable: variable-name */
export class GlobalWallet {
    private _glwtId:string;
    private _nickName: string;
    private _mnemonic: string;
    private _currencyRecords:CurrencyRecord[] = [];
    private _addrs:Addr[] = [];
    private _seed:string;
    
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

    get currencyRecords() {
        return this._currencyRecords;
    }

    get addrs() {
        return this._addrs;
    }

    get seed() {
        return this._seed;
    }

    public static fromJSON(jsonstring: string) : GlobalWallet {
        const wlt = JSON.parse(jsonstring);
        const gwlt = new GlobalWallet();

        gwlt._glwtId = wlt.glwtId;
        gwlt._nickName = wlt.nickname;
        gwlt._mnemonic = wlt.mnemonic;
        gwlt._seed = wlt.seed;

        return gwlt;
    }

    public static async fromMnemonic(mnemonic: string, passwd: string, passphrase?: string) : Promise<GlobalWallet> {
        const gwlt = new GlobalWallet();
        gwlt._mnemonic = cipher.encrypt(passwd, mnemonic);

        const seed = toSeed(lang,mnemonic);
        gwlt._seed = cipher.encrypt(passwd, seed);

        // 创建ETH钱包
        const ethGwlt = await this.fromMnemonicETH(passwd,mnemonic);
        gwlt._glwtId = ethGwlt.addrs[0].addr;
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(...ethGwlt.addrs);

        // 创建BTC钱包
        const btcGwlt = await this.fromMnemonicBTC(passwd,mnemonic);
        gwlt._currencyRecords.push(btcGwlt.currencyRecord);
        gwlt._addrs.push(...btcGwlt.addrs);

        // ETH代币创建

        for (let i = 0; i < defaultEthToken.length;i++) {
            const tokenName = defaultEthToken[i];
            const contractAddress = ERC20Tokens[tokenName];
            const tokenGwlt = await GlobalWallet.fromMnemonicEthToken(tokenName,contractAddress,passwd,mnemonic);
            gwlt._currencyRecords.push(tokenGwlt.currencyRecord);
            gwlt._addrs.push(...tokenGwlt.addrs);

            // 更新内存数据中心
            tokenGwlt.addrs.forEach(item => {
                dataCenter.addAddr(item.addr, item.addrName, item.currencyName);
            });
        }
        
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
    public static generate(passwd: string,walletName:string, passphrase?: string) : GlobalWallet {
        const gwlt = new GlobalWallet();
        gwlt._nickName = walletName;

        const mnemonic = generate(lang, strength);
        gwlt._mnemonic = cipher.encrypt(passwd, mnemonic);

        const seed = toSeed(lang,mnemonic);
        gwlt._seed = cipher.encrypt(passwd, seed);

        // 创建ETH钱包
        const ethGwlt = this.createEthGwlt(passwd,mnemonic);
        gwlt._glwtId = ethGwlt.addr.addr;
        gwlt._currencyRecords.push(ethGwlt.currencyRecord);
        gwlt._addrs.push(ethGwlt.addr);

        // 创建BTC钱包
        const btcGwlt = this.createBtcGwlt(passwd,mnemonic);
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
    public static async fromSeedEthToken(tokenName:string,contractAddress: string,passwd: string,seed:string) {
        const _seed = cipher.decrypt(passwd,seed);
        const gaiaWallet = GaiaWallet.fromSeed(passwd, _seed, lang);
        const cnt = await gaiaWallet.scanTokenUsedAddress(contractAddress,passwd);
        const currencyRecord: CurrencyRecord = {
            currencyName: tokenName,
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const firstAddr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            wlt: gaiaWallet.toJSON(),
            record: [],
            balance: 0,
            currencyName: tokenName
        };
        const addrs :Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1;i < cnt;i++) {
            const wlt = gaiaWallet.selectAddress(passwd,i);
            currencyRecord.addrs.push(wlt.address);
            const addr : Addr = {
                addr: wlt.address,
                addrName: getDefaultAddr(wlt.address),
                wlt: wlt.toJSON(),
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

    private static async fromMnemonicETH(passwd: string,mnemonic:string) {
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang, passwd);
        const cnt = await gaiaWallet.scanUsedAddress(passwd);
        const currencyRecord: CurrencyRecord = {
            currencyName: 'ETH',
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const firstAddr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            wlt: gaiaWallet.toJSON(),
            record: [],
            balance: 0,
            currencyName: 'ETH'
        };
        const addrs :Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1;i < cnt;i++) {
            const wlt = gaiaWallet.selectAddress(passwd,i);
            currencyRecord.addrs.push(wlt.address);
            const addr : Addr = {
                addr: wlt.address,
                addrName: getDefaultAddr(wlt.address),
                wlt: wlt.toJSON(),
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

    private static async fromMnemonicEthToken(tokenName:string,contractAddress: string,passwd: string,mnemonic:string) {
        const gaiaWallet = GaiaWallet.fromMnemonic(mnemonic, lang, passwd);
        const cnt = await gaiaWallet.scanTokenUsedAddress(contractAddress,passwd);
        const currencyRecord: CurrencyRecord = {
            currencyName: tokenName,
            currentAddr: gaiaWallet.address,
            addrs: [gaiaWallet.address]
        };
        const firstAddr: Addr = {
            addr: gaiaWallet.address,
            addrName: getDefaultAddr(gaiaWallet.address),
            wlt: gaiaWallet.toJSON(),
            record: [],
            balance: 0,
            currencyName: tokenName
        };
        const addrs :Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1;i < cnt;i++) {
            const wlt = gaiaWallet.selectAddress(passwd,i);
            currencyRecord.addrs.push(wlt.address);
            const addr : Addr = {
                addr: wlt.address,
                addrName: getDefaultAddr(wlt.address),
                wlt: wlt.toJSON(),
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

    private static async fromMnemonicBTC(passwd: string,mnemonic:string) {
        // todo 测试阶段，使用测试链，后续改为主链
        const btcWallet = BTCWallet.fromMnemonic(passwd, mnemonic, btcNetwork, lang);
        const btcWalletJson = btcWallet.toJSON();
        btcWallet.unlock(passwd);
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
            wlt: btcWalletJson,
            record: [],
            balance: 0,
            currencyName: 'BTC'
        };

        const addrs :Addr[] = [];
        addrs.push(firstAddr);

        for (let i = 1;i < cnt;i++) {
            const address = btcWallet.derive(i);
            currencyRecord.addrs.push(address);
            const addr : Addr = {
                addr: address,
                addrName: getDefaultAddr(address),
                wlt: btcWalletJson,
                record: [],
                balance: 0,
                currencyName: 'BTC'
            };
            addrs.push(addr);
        }
        btcWallet.lock(passwd);

        return {
            currencyRecord,
            addrs
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

    public exportSeed(passwd: string) : string {
        return cipher.decrypt(passwd, this._seed);
    }

    public toJSON() : string {
        const wlt = {
            glwtId:this._glwtId,
            nickname: this._nickName,
            mnemonic: this._mnemonic,
            seed:this._seed
        };

        return JSON.stringify(wlt);
    }

    public passwordChange(oldPsw:string,newPsw:string) {
        if (this._mnemonic.length === 0) return;
        const mnemonic = this.exportMnemonic(oldPsw);
        this._mnemonic = cipher.encrypt(newPsw, mnemonic);

        const seed = cipher.decrypt(oldPsw,this._seed);
        this._seed = cipher.encrypt(newPsw, seed);
    }

    public deleteMnemonic(passwd: string) {
        if (this._mnemonic.length === 0) {
            throw new Error('Invalid operation');
        }

        try {
            cipher.decrypt(passwd, this._mnemonic);
        } catch (e) {
            throw new Error('Invalid operation');
        }
        this._mnemonic = '';
    }
}