import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { config } from '../core/config';
import { Api as EthApi } from '../core/eth/api';
import { ERC20Tokens } from '../core/eth/tokens';
import { EthWallet } from '../core/eth/wallet';
import { shapeshift } from '../exchange/shapeshift/shapeshift';
// tslint:disable-next-line:max-line-length
import { btcNetwork, defaultExchangeRateJsonMain, defaultExchangeRateJsonTest, ethTokenTransferCode, lang, shapeshiftApiPrivateKey, shapeshiftTransactionRequestNumber, supportCurrencyListMain, supportCurrencyListTest } from '../utils/constants';
import {
    btc2Sat, ethTokenDivideDecimals, getAddrsAll, getAddrsByCurrencyName, getDefaultAddr, getLocalStorage,
    getMnemonic, sat2Btc, setLocalStorage, wei2Eth
} from '../utils/tools';
import { Addr, CurrencyRecord, Wallet } from '../view/interface';
import { find, getBorn, updateStore } from './store';
/**
 * 创建事件处理器表
 * @example
 */
export class DataCenter {
    public static MAX_ADDRNAME_LEN: number = 9;// 最长地址名

    public static MAX_SHARE_LEN: number = 3;
    public static MIN_SHARE_LEN: number = 2;
    public static SHARE_SPLIT: string = '&&&&';
    public static MNEMONIC_SPLIT: string = ' ';
    public static LIMIT_CONFIRMATIONS: number = 1;

    public addrs: string[] = [];
    public timerRef: number = 0;
    public transactions: any[] = [];

    public updateList: any[] = [];

    public currencyExchangeTimer: number;

    /**
     * 初始化
     */
    public init() {
        this.updateList.push(['shapeShiftCoins']);
        this.updateList.push(['exchangeRate', 'ETH']);
        this.updateList.push(['exchangeRate', 'BTC']);

        // 从缓存中获取地址进行初始化
        const addrs = find('addrs');
        if (addrs) {
            const wallet = find('curWallet');
            if (!wallet) return;
            let list = [];
            wallet.currencyRecords.forEach(v => {
                list = list.concat(v.addrs);
            });
            addrs.forEach(v => {
                if (list.indexOf(v.addr) >= 0) {
                    this.addAddr(v.addr, v.addrName, v.currencyName);
                }
            });
        }

        // 启动定时器更新
        if (!this.timerRef) this.openCheck();
        if (!this.currencyExchangeTimer) this.currencyExchangeTimerStart();
    }

    public initStore() {
        // 从localStorage中取wallets
        // 从localStorage中取addrs
        // 从localStorage中取transactions
        // 从localStorage中的wallets中初始化salt
        // 从localStorage中的wallets中初始化curWallet

        // 初始化默认兑换汇率列表
        const rateJson = config.currentNetIsTest ? defaultExchangeRateJsonTest : defaultExchangeRateJsonMain;
        const m = new Map();
        for (const key in rateJson) {
            if (rateJson.hasOwnProperty(key)) {
                m.set(key, rateJson[key]);
            }
        }
        updateStore('exchangeRateJson', m);

        // 初始化货币信息列表
        updateStore('exchangeRateJson', config.currentNetIsTest ? supportCurrencyListTest : supportCurrencyListMain);

    }

    /**
     * 初始化地址对象
     */
    public initAddr(address: string, currencyName: string, addrName?: string): Addr {
        return {
            addr: address,
            addrName: addrName || getDefaultAddr(address),
            record: [],
            balance: 0,
            currencyName: currencyName
        };
    }
    /**
     * addAddr
     */
    public addAddr(addr: string, addrName: string, currencyName: string) {
        this.updatetTransaction(addr, currencyName);
    }

    /**
     * 通过货币类型获取当前钱包地址详情
     */
    public getAddrInfosByCurrencyName(currencyName: string) {
        const wallet = find('curWallet');
        if (!wallet) return;
        const retAddrs = getAddrsByCurrencyName(wallet, currencyName);
        const addrs = find('addrs') || [];

        return addrs.filter(v => retAddrs.indexOf(v.addr) !== -1 && v.currencyName === currencyName);
    }

    /**
     * 通过地址获取地址余额
     */
    public getAddrInfoByAddr(addr: string, currencyName: string) {
        const addrs = find('addrs') || [];

        return addrs.filter(v => v.addr === addr && v.currencyName === currencyName)[0];
    }

    /**
     * 通过地址获取所有的交易记录
     */
    public getAllTransactionsByAddr(addr: string, currencyName: string) {
        // 从缓存中取出对应地址的交易记录
        const transactions = find('transactions') || [];

        // return transactions.filter(v => v.addr === addr);

        let list = [];
        if (currencyName === 'ETH' || ERC20Tokens[currencyName]) {
            list = transactions.filter(v => v.addr === addr && v.currencyName === currencyName);
        } else if (currencyName === 'BTC') {
            list = transactions.filter(v => v.addr === addr && v.currencyName === currencyName).map(v => {
                if (v.inputs.indexOf(addr) >= 0) {
                    v.from = addr;
                    v.to = v.outputs[0];
                } else {
                    v.from = v.inputs[0];
                    v.to = addr;
                }

                return v;
            });
        }

        return list;
    }

    /**
     * 获取汇率
     */
    public getExchangeRate(currencyName: string) {
        return find('exchangeRateJson', currencyName);
    }
    /**
     * 更新记录
     */
    public updatetTransaction(addr: string, currencyName: string) {
        // if (currencyName !== 'BTC') {
        //     this.updateList.push(['balance', addr, currencyName]);   
        // }
        this.updateList.push(['balance', addr, currencyName]);
        this.updateList.push(['transaction', addr, currencyName]);
    }
    /**
     * 添加常用联系人地址
     */
    public addTopContacts(currencyName: string, addresse: string, tags: string) {
        let topContacts = find('TopContacts');
        if (!topContacts) {
            topContacts = [];
        }
        const item = {
            currencyName,
            tags,
            addresse
        };
        topContacts.push(item);
        updateStore('TopContacts', topContacts);
    }
    /**
     * 获取常用联系人地址
     */
    public getTopContacts(currencyName: string) {
        let topContacts = find('TopContacts');
        if (!topContacts) {
            topContacts = [];
        }
        topContacts = topContacts.filter(v => v.currencyName === currencyName);

        return topContacts;
    }

    /**
     * 设置缓存hash
     */
    public setHash(key: string, hash: string) {
        if (!key) return;
        updateStore('hashMap', getBorn('hashMap').set(key, hash));
    }
    /**
     * 获取缓存hash
     */
    public getHash(key: string) {
        return find('hashMap', key);
    }

    // 获取币币交易交易记录
    public fetchCurrencyExchangeTx() {
        const wallet = find('curWallet');
        if (!wallet) return;
        const curAllAddrs = getAddrsAll(wallet);
        curAllAddrs.forEach(item => {
            this.getTransactionsByAddr(item);
        });

    }

    /**
     * 设置连接用户
     */
    public getUser() {
        return find('conUser');
    }
    /**
     * 获取连接用户
     */
    public setUser(user: string) {
        updateStore('conUser', user);
    }

    /**
     * 设置连接用户
     */
    public getUserPublicKey() {
        return find('conUserPublicKey');
    }
    /**
     * 获取连接用户
     */
    public setUserPublicKey(publicKey: string) {
        updateStore('conUserPublicKey', publicKey);
    }

    /**
     * 设置连接随机数
     */
    public getConRandom() {
        return find('conRandom');
    }
    /**
     * 获取连接随机数
     */
    public setConRandom(random: string) {
        updateStore('conRandom', random);
    }

    /**
     * 设置连接随机数
     */
    public getConUid() {
        return find('conUid');
    }
    /**
     * 获取连接随机数
     */
    public setConUid(uid: number) {
        updateStore('conUid', uid);
    }

    /****************************************************************************************************
     * 私有函数
     ******************************************************************************************/

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 5 * 1000);
        if (this.updateList.length > 0) {
            const update = this.updateList.shift();
            console.log('openCheck updateList', update);
            switch (update[0]) {
                case 'transaction': this.parseTransactionDetails(update[1], update[2]); break;
                // case 'BtcTransactionTxref': this.parseBtcTransactionTxrefDetails(update[1], update[2]); break;
                case 'balance': this.updateBalance(update[1], update[2]); break;
                case 'exchangeRate': this.exchangeRate(update[1]); break;
                case 'shapeShiftCoins': this.getShapeShiftCoins();
                default:
            }

            return;
        }

        // 检查地址--放于最后一步
        this.checkAddr();
    }

    // 币币交易记录定时器
    private currencyExchangeTimerStart() {
        this.fetchCurrencyExchangeTx();
        this.currencyExchangeTimer = setTimeout(() => {
            this.currencyExchangeTimerStart();
        }, 10 * 60 * 1000);
    }
    private async checkAddr() {
        const walletList = find('walletList');
        if (!walletList || walletList.length <= 0) return;
        const list = [];
        walletList.forEach((v, i) => {
            if (dataCenter.getHash(v.walletId)) {
                v.currencyRecords.forEach((v1, i1) => {
                    if (!v1.updateAddr) list.push([i, i1]);
                });
            }
        });

        if (list[0]) {
            let addrs = find('addrs');
            const wallet = walletList[list[0][0]];
            const currencyRecord: CurrencyRecord = wallet.currencyRecords[list[0][1]];
            console.log('checkAddr', currencyRecord.currencyName);
            let addAddrs;
            if (currencyRecord.currencyName === 'ETH') {
                addAddrs = await this.checkEthAddr(wallet, currencyRecord);
            } else if (currencyRecord.currencyName === 'BTC') {
                addAddrs = await this.checkBtcAddr(wallet, currencyRecord);
            } else if (ERC20Tokens[currencyRecord.currencyName]) {
                addAddrs = await this.checkEthERC20TokenAddr(wallet, currencyRecord);
            }
            if (addAddrs.length > 0) {
                addrs = addrs.concat(addAddrs);
                updateStore('addrs', addrs);
            }
            currencyRecord.updateAddr = true;
            updateStore('walletList', walletList);
        }
    }

    private getShapeShiftCoins() {
        shapeshift.coins((err, data) => {
            if (err) {
                console.log(err);

                return;
            }
            const list = [];
            for (const k in data) {
                list.push(data[k]);
            }
            if (list.length > 0) updateStore('shapeShiftCoins', list);
        });
    }
    /**
     * 解析交易详情
     */
    private parseTransactionDetails(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            this.parseEthERC20TokenTransactionDetails(addr, currencyName);

            return;
        }
        switch (currencyName) {
            case 'ETH': this.parseEthTransactionDetails(addr); break;
            case 'BTC': this.parseBtcTransactionDetails(addr); break;
            default:
        }

    }

    private async parseEthERC20TokenTransactionDetails(addr: string, currencyName: string) {
        const api = new EthApi();
        const contractAddress = ERC20Tokens[currencyName];
        const res = await api.getTokenTransferEvents(contractAddress, addr);
        const list = [];
        const transactions = find('transactions') || [];
        res.result.forEach(v => {
            if (transactions.some(v1 => (v1.hash === v.hash) && (v1.addr === addr) && (v1.currencyName === currencyName))) return;
            // 移除缓存记录
            this.removeRecordAtAddr(addr, v.hash);
            // info--input  0x636573--ces

            const record = {
                hash: v.hash,
                from: v.from,
                to: v.to,
                value: parseFloat(v.value),
                fees: parseFloat(v.gasUsed) * parseFloat(v.gasPrice),
                time: parseInt(v.timeStamp, 10) * 1000,
                info: '无',
                currencyName,
                addr
            };
            list.push(record);
        });
        if (list.length > 0) {
            this.setTransactionLocalStorage(transactions.concat(list));
        }
    }
    private async parseEthTransactionDetails(addr: string) {
        const api = new EthApi();
        const r: any = await api.getAllTransactionsOf(addr);
        const ethTrans = this.filterEthTrans(r.result);
        const list = [];
        // const hashList = [];
        const transactions = find('transactions') || [];
        ethTrans.forEach(v => {
            if (transactions.some(v1 => (v1.hash === v.hash) && (v1.addr === addr))) return;
            // 移除缓存记录
            this.removeRecordAtAddr(addr, v.hash);
            // info--input  0x636573--ces

            const record = {
                hash: v.hash,
                from: v.from,
                to: v.to,
                value: parseFloat(v.value),
                fees: parseFloat(v.gasUsed) * parseFloat(v.gasPrice),
                time: parseInt(v.timeStamp, 10) * 1000,
                info: '无',
                currencyName: 'ETH',
                addr: addr
            };
            list.push(record);
            // hashList.push(v.hash);
        });
        if (list.length > 0) {
            this.setTransactionLocalStorage(transactions.concat(list));
        }
    }
    // 过滤eth交易记录，过滤掉token的交易记录
    private filterEthTrans(trans: any[]) {

        return trans.filter(item => {
            if (item.to.length === 0) return false;
            if (item.input.indexOf(ethTokenTransferCode) === 0) return false;

            return true;
        });

    }
    private async parseBtcTransactionDetails(addr: string) {
        // return;
        // const info = await BtcApi.getAddrInfo(addr);
        const info = await BtcApi.getAddrTxHistory(addr);
        if (!info) return;
        // const num = sat2Btc(info.balance);
        // this.setBalance(addr, 'BTC',num);

        // console.log('getAddrInfo', info);
        if (info.txs) {
            const transactions = find('transactions') || [];
            const list = [];

            info.txs.forEach(v => {
                if (transactions.some(v1 => (v1.hash === v.txid) && (v1.addr === addr))) return;
                if (v.confirmations < DataCenter.LIMIT_CONFIRMATIONS) return;
                this.removeRecordAtAddr(addr, v.txid);
                list.push(this.parseBtcTransactionTxRecord(addr, v));
            });
            if (list.length > 0) {
                this.setTransactionLocalStorage(transactions.concat(list));
            }
        }
    }

    /**
     * 解析btc交易详情记录
     */
    private parseBtcTransactionTxRecord(addr: string, tx: any) {
        console.log('parseBtcTransactionTxRecord', tx);
        let value = 0;
        const inputs = tx.vin.map(v => {
            return v.addr;
        });
        const outputs = tx.vout.map(v => {
            if (!value) {
                if (inputs.indexOf(addr) >= 0) {
                    value = parseFloat(v.value);
                } else if (addr === v.scriptPubKey.addresses[0]) {
                    value = parseFloat(v.value);
                }
            }

            return v.scriptPubKey.addresses[0];
        });

        return {
            addr: addr,
            currencyName: 'BTC',
            hash: tx.txid,
            time: tx.time * 1000,
            info: '无',
            fees: btc2Sat(tx.fees),
            value: btc2Sat(value),
            inputs: inputs,
            outputs: outputs
        };
    }

    private removeRecordAtAddr(addr: string, hashStr: string) {
        let addrs = find('addrs') || [];
        let isUpdate = false;
        addrs = addrs.map(v => {
            if (v.addr !== addr) return v;
            const t = v.record.filter(v1 => v1.id !== hashStr);
            if (v.record.length !== t.length) {
                isUpdate = true;
                v.record = t;
            }

            return v;
        });
        if (isUpdate) {
            updateStore('addrs', addrs);
        }
    }

    /**
     * 更新余额
     */
    private updateBalance(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            const balanceOfCode = EthWallet.tokenOperations('balanceof', currencyName, addr);
            // console.log('balanceOfCode',balanceOfCode);
            const api = new EthApi();
            api.ethCall(ERC20Tokens[currencyName], balanceOfCode).then(r => {
                // tslint:disable-next-line:radix
                const num = ethTokenDivideDecimals(Number(r), currencyName);
                // console.log(currencyName,num);
                this.setBalance(addr, currencyName, num);
            });

            return;
        }
        switch (currencyName) {
            case 'ETH':
                const api = new EthApi();
                api.getBalance(addr).then(r => {
                    const num = wei2Eth((<any>r).toNumber());
                    this.setBalance(addr, currencyName, num);
                });
                break;
            case 'BTC':
                BtcApi.getBalance(addr).then(r => {
                    this.setBalance(addr, currencyName, sat2Btc(r));
                });
                break;
            default:
        }
    }

    /**
     * 设置余额
     */
    private setBalance(addr: string, currencyName: string, num: number) {
        let addrs = find('addrs') || [];

        let isUpdate = false;
        addrs = addrs.map(v => {
            if (v.addr === addr && v.currencyName === currencyName && v.balance !== num) {
                v.balance = num;
                isUpdate = true;
            }

            return v;
        });

        if (isUpdate) {
            updateStore('addrs', addrs);
        }
    }

    private async exchangeRate(currencyName: string) {
        switch (currencyName) {
            case 'ETH':
                const ethApi: EthApi = new EthApi();
                const ethRate = await ethApi.getExchangeRate();
                updateStore('exchangeRateJson', find('exchangeRateJson').set('ETH', ethRate));
                break;
            case 'BTC':
                const btcRate = await BtcApi.getExchangeRate();
                updateStore('exchangeRateJson', find('exchangeRateJson').set('BTC', btcRate));
                break;
            default:
        }

    }

    private setTransactionLocalStorage(transactions: any[], notify: boolean = false) {
        const addrs = find('addrs');
        const existedAddrs = [];
        addrs.forEach(addr => existedAddrs.push(addr.addr));
        const trans = transactions.filter(trans => existedAddrs.indexOf(trans.addr) >= 0);
        updateStore('transactions', trans);
    }

    /**
     * 检查eth地址
     */
    private async checkEthAddr(wallet: Wallet, currencyRecord: CurrencyRecord) {
        const mnemonic = await getMnemonic(wallet, '');
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const cnt = await ethWallet.scanUsedAddress();
        const addrs: Addr[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = ethWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            addrs.push(this.initAddr(address, 'ETH'));
        }

        return addrs;
    }

    /**
     * 检查btc地址
     */
    private async checkBtcAddr(wallet: Wallet, currencyRecord: CurrencyRecord) {
        const mnemonic = await getMnemonic(wallet, '');
        const btcWallet = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
        btcWallet.unlock();
        const cnt = await btcWallet.scanUsedAddress();

        const addrs: Addr[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = btcWallet.derive(i);
            currencyRecord.addrs.push(address);
            addrs.push(this.initAddr(address, 'BTC'));
        }
        btcWallet.lock();

        return addrs;
    }

    /**
     * 检查eth erc20 token地址
     */
    private async checkEthERC20TokenAddr(wallet: Wallet, currencyRecord: CurrencyRecord) {
        const mnemonic = await getMnemonic(wallet, '');
        const ethWallet = EthWallet.fromMnemonic(mnemonic, lang);
        const cnt = await ethWallet.scanTokenUsedAddress(ERC20Tokens[currencyRecord.currencyName]);
        const addrs: Addr[] = [];

        for (let i = 1; i < cnt; i++) {
            const address = ethWallet.selectAddress(i);
            currencyRecord.addrs.push(address);
            addrs.push(this.initAddr(address, currencyRecord.currencyName));
        }

        return addrs;
    }

    private async getTransactionsByAddr(addr: string) {
        const addrLowerCase = addr.toLowerCase();
        const transactions = (addr: string): Promise<any> => {
            return new Promise((resolve, reject) => {
                shapeshift.transactions(shapeshiftApiPrivateKey, addr, (err, transactions) => {
                    if (err || transactions.length === 0) {
                        reject(err || new Error('null array'));
                    }
                    resolve(transactions);
                });
            });
        };
        let count = shapeshiftTransactionRequestNumber;
        while (count >= 0) {

            let txs;
            try {
                txs = await transactions(addrLowerCase);
            } catch (err) {
                // tslint:disable-next-line:prefer-template
            }
            if (txs) {
                const currencyExchangeTxs = getLocalStorage('currencyExchangeTxs') || {};
                const oldTxs = currencyExchangeTxs[addrLowerCase] || [];
                txs.forEach(tx => {
                    const index = this.getTxByHash(oldTxs, tx.inputTXID);
                    if (index >= 0) {
                        oldTxs[index] = tx;
                    } else {
                        oldTxs.push(tx);
                    }
                });
                currencyExchangeTxs[addrLowerCase] = oldTxs;
                setLocalStorage('currencyExchangeTxs', currencyExchangeTxs);

                return;
            }
            count--;
        }
    }

    private getTxByHash(txs: any[], hash: string) {
        for (let i = 0; i < txs.length; i++) {
            // tslint:disable-next-line:possible-timing-attack
            if (txs[i].inputTXID === hash) {
                return i;
            }
        }

        return -1;
    }
}

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();