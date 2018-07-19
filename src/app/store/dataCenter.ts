import {  BtcApi } from '../core/btc/api';
import { Api as EthApi } from '../core/eth/api';
import { ERC20Tokens } from '../core/eth/tokens'; 
import { GaiaWallet } from '../core/eth/wallet';
import { defaultExchangeRateJson,ethTokenTransferCode,supportCurrencyList } from '../utils/constants';
import {
    ethTokenDivideDecimals, getAddrsByCurrencyName, getCurrentWallet, getLocalStorage, sat2Btc,setLocalStorage,wei2Eth
} from '../utils/tools';
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

    public rate: string;
    public addrInfos: any[] = [];
    public addrs: string[] = [];
    public timerRef: number = 0;
    public transactions: any[] = [];

    public updateList: any[] = [];

    public exchangeRateJson:any = defaultExchangeRateJson;
    public currencyList: any[] = supportCurrencyList;
    /**
     * 初始化
     */
    public init() {

        this.updateList.push(['exchangeRate', 'ETH']);
        this.updateList.push(['exchangeRate', 'BTC']);

        // 从缓存中获取地址进行初始化
        const addrs = getLocalStorage('addrs');
        if (addrs) {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
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
    }
    /**
     * addAddr
     */
    public addAddr(addr: string, addrName: string, currencyName: string) {
        // return;
        // 更新对应地址交易记录
        if (currencyName !== 'BTC') {
            this.updateList.push(['balance', addr, currencyName]);
        }
        this.updateList.push(['transaction', addr, currencyName]);
    }

    /**
     * 通过货币类型获取当前钱包地址详情
     */
    public getAddrInfosByCurrencyName(currencyName: string) {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        if (!wallet) return;
        const retAddrs = getAddrsByCurrencyName(wallet, currencyName);
        const addrs = getLocalStorage('addrs') || [];

        return addrs.filter(v => retAddrs.indexOf(v.addr) !== -1 && v.currencyName === currencyName);
    }

    /**
     * 通过地址获取地址余额
     */
    public getAddrInfoByAddr(addr: string,currencyName:string) {
        const addrs = getLocalStorage('addrs') || [];

        return addrs.filter(v => v.addr === addr && v.currencyName === currencyName)[0];
    }

    /**
     * 通过地址获取所有的交易记录
     */
    public getAllTransactionsByAddr(addr: string, currencyName: string) {
        // 从缓存中取出对应地址的交易记录
        const transactions = getLocalStorage('transactions') || [];

        // return transactions.filter(v => v.addr === addr);

        let list = [];
        if (currencyName === 'ETH' || ERC20Tokens[currencyName]) {
            list = transactions.filter(v => v.addr === addr && v.currencyName === currencyName);
        } else if (currencyName === 'BTC') {
            list = transactions.filter(v => v.addr === addr && v.currencyName === currencyName).map(v => {
                if (v.iIndex >= 0) {
                    v.from = addr;
                    v.to = v.outputs[0];
                } else {
                    v.from = v.inputs[0];
                    v.to = addr;
                }

                return v;
            });

            // 合并记录数据
            list.filter(v => v.from === v.to).forEach(v => {
                const tList = list.filter(v1 => v1.hash === v.hash);
                if (tList.length > 1) {
                    let value = 0;
                    let maxValue = 0;
                    let fromAddr = '';
                    let to = '';
                    tList.forEach(v1 => {
                        if (v1.to === addr) {
                            value += v1.value;
                        } else {
                            value -= v1.value;
                        }
                        if (v1.value > maxValue) {
                            maxValue = v1.value;
                            fromAddr = v1.from;
                            to = v1.to;
                        }
                    });
                    let done = false;
                    list = list.map(v1 => {
                        if (v1.hash !== v.hash) return v1;
                        if (done) return 'clear';
                        v1.from = fromAddr;
                        v1.to = to;
                        v1.value = Math.abs(value) - v1.fees;
                        done = true;

                        return v1;
                    }).filter(v1 => v1 !== 'clear');
                }
            });
        }

        return list;
    }

    /**
     * 获取汇率
     */
    public getExchangeRate(currencyName: string) {
        return this.exchangeRateJson[currencyName];
    }
    /**
     * 更新记录
     */
    public updatetTransaction(addr: string, currencyName: string) {
        if (currencyName !== 'BTC') {
            this.updateList.push(['balance', addr, currencyName]);
        }
        this.updateList.push(['transaction', addr, currencyName]);
    }

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
                case 'BtcTransactionTxref': this.parseBtcTransactionTxrefDetails(update[1], update[2]); break;
                case 'balance': this.updateBalance(update[1], update[2]); break;
                case 'exchangeRate': this.exchangeRate(update[1]); break;

                default:
            }
        }
    }

    /**
     * 解析交易详情
     */
    private parseTransactionDetails(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            this.parseEthERC20TokenTransactionDetails(addr,currencyName);

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
        const res = await api.getTokenTransferEvents(contractAddress,addr);
        const list = [];
        const transactions = getLocalStorage('transactions') || [];
        res.result.forEach(v => {
            if (transactions.some(v1 => (v1.hash === v.hash) && (v1.addr === addr) && (v1.currencyName === currencyName))) return;
            // todo 移除缓存记录
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
            // setLocalStorage('transactions', transactions.concat(list), false);
        }
    }
    private async parseEthTransactionDetails(addr: string) {
        const api = new EthApi();
        const r: any = await api.getAllTransactionsOf(addr);
        const ethTrans = this.filterEthTrans(r.result);
        const list = [];
        // const hashList = [];
        const transactions = getLocalStorage('transactions') || [];
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
            // setLocalStorage('transactions', transactions.concat(list), false);
        }
    }
    // 过滤eth交易记录，过滤掉token的交易记录
    private filterEthTrans(trans:any[]) {

        return trans.filter(item => {
            if (item.to.length === 0) return false;
            if (item.input.indexOf(ethTokenTransferCode) === 0) return false;
            
            return true;
        });

    }
    private async parseBtcTransactionDetails(addr: string) {
        // return;
        const info = await BtcApi.getAddrInfo(addr);
        if (!info) return;
        const num = sat2Btc(info.balance);
        this.setBalance(addr, 'BTC',num);
        // console.log('getAddrInfo', info);
        if (info.txrefs) {
            const transactions = getLocalStorage('transactions') || [];
            info.txrefs.forEach(v => {
                const t = transactions.filter(v1 => v1.hash === v.tx_hash);
                if (t.length > 0) {
                    this.addTransactions(transactions, v, t, addr);

                    return;
                }
                // 移除缓存记录
                this.updateList.unshift(['BtcTransactionTxref', v, addr]);
            });
        }
    }

    private async parseBtcTransactionTxrefDetails(iInfo: any, addr: string) {
        const transactions = getLocalStorage('transactions') || [];
        const t = transactions.filter(v1 => v1.hash === iInfo.tx_hash);
        if (t.length > 0) {
            this.addTransactions(transactions, iInfo, t, addr);

            return;
        }
        const info = await BtcApi.getAddrInfo(addr);
        // console.log('getTxInfo', info);
        let inputs = [];
        let outputs = [];
        info.inputs.forEach(v => {
            inputs = inputs.concat(v.addresses);
        });
        info.outputs.forEach(v => {
            outputs = outputs.concat(v.addresses);
        });

        const record = {
            hash: iInfo.tx_hash,
            value: iInfo.value,
            fees: info.fees,
            time: new Date(info.confirmed).getTime(),
            info: '无',
            inputs: inputs,
            outputs: outputs,
            currencyName: 'BTC',
            iIndex: iInfo.tx_input_n,
            oIndex: iInfo.tx_output_n,
            addr: addr
        };

        // const transactions = getLocalStorage('transactions') || [];
        transactions.push(record);
        this.setTransactionLocalStorage(transactions);
        // setLocalStorage('transactions', transactions, false);

        this.removeRecordAtAddr(addr, iInfo.tx_hash);
    }

    private addTransactions(transactions: any[], iInfo: any, tInfos: any[], addr: string) {

        if (tInfos.some(v => (iInfo.value === v.value) && (addr === v.addr))) return;

        const record = {
            hash: iInfo.tx_hash,
            value: iInfo.value,
            fees: tInfos[0].fees,
            time: tInfos[0].time,
            info: '无',
            inputs: tInfos[0].inputs,
            outputs: tInfos[0].outputs,
            currencyName: 'BTC',
            iIndex: iInfo.tx_input_n,
            oIndex: iInfo.tx_output_n,
            addr: addr
        };

        transactions.push(record);
        this.setTransactionLocalStorage(transactions);
        // setLocalStorage('transactions', transactions, false);

        this.removeRecordAtAddr(addr, iInfo.tx_hash);
    }

    private removeRecordAtAddr(addr: string, hashStr: string) {
        let addrs = getLocalStorage('addrs') || [];
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
            setLocalStorage('addrs', addrs, false);
        }
    }

    /**
     * 更新余额
     */
    private updateBalance(addr: string, currencyName: string) {
        if (ERC20Tokens[currencyName]) {
            const balanceOfCode = GaiaWallet.tokenOperations('balanceof',currencyName,addr);
            // console.log('balanceOfCode',balanceOfCode);
            const api = new EthApi();
            api.ethCall(ERC20Tokens[currencyName],balanceOfCode).then(r => {
                // tslint:disable-next-line:radix
                const num = ethTokenDivideDecimals(Number(r),currencyName);
                // console.log(currencyName,num);
                this.setBalance(addr,currencyName,num);
            });
            
            return;
        }
        switch (currencyName) {
            case 'ETH':
                const api = new EthApi();
                api.getBalance(addr).then(r => {
                    const num = wei2Eth((<any>r).toNumber());
                    this.setBalance(addr,currencyName, num);
                });
                break;
            case 'BTC': break;

            default:
        }
    }

    /**
     * 设置余额
     */
    private setBalance(addr: string,currencyName:string, num: number) {
        let addrs = getLocalStorage('addrs') || [];

        let isUpdate = false;
        addrs = addrs.map(v => {
            if (v.addr === addr && v.currencyName === currencyName && v.balance !== num) {
                v.balance = num;
                isUpdate = true;
            }

            return v;
        });

        if (isUpdate) {
            setLocalStorage('addrs', addrs, true);
        }
    }

    private async exchangeRate(currencyName: string) {
        switch (currencyName) {
            case 'ETH':
                const ethApi: EthApi = new EthApi();
                this.exchangeRateJson.ETH = await ethApi.getExchangeRate();
                break;
            case 'BTC': 
                this.exchangeRateJson.BTC = await BtcApi.getExchangeRate();
                break;
            default:
        }

    }

    private setTransactionLocalStorage(transactions:any[],notify:boolean= false) {
        const addrs = getLocalStorage('addrs');
        const existedAddrs = [];
        addrs.forEach(addr => existedAddrs.push(addr.addr));
        const trans = transactions.filter(trans => existedAddrs.indexOf(trans.addr) >= 0);
        setLocalStorage('transactions',trans,notify);
    }
}

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();