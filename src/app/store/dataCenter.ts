import { Api as BtcApi } from '../core/btc/api';
import { Api as EthApi } from '../core/eth/api';
import {
    getCurrentWallet, getLocalStorage, sat2Btc, setLocalStorage, wei2Eth
} from '../utils/tools';

/**
 * 创建事件处理器表
 * @example
 */
export class DataCenter {

    public rate: string;
    public addrInfos: any[] = [];
    public addrs: string[] = [];
    public timerRef: number = 0;
    public transactions: any[] = [];

    public updateList: any[] = [];

    public ethExchangeRate: any;
    public btcExchangeRate: any;

    public currencyList: any[] = [
        { name: 'ETH', description: 'Ethereum' }
        , { name: 'BTC', description: 'Bit coin' }
        , { name: 'EOS', description: 'EOS currency' }
        , { name: 'ETC', description: 'Ethereum Classic' }
        , { name: 'BCH', description: 'Bitcoin Cash' }
        , { name: 'XRP', description: 'Ripple' }];

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
            this.addrInfos = [];
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
        if (this.addrInfos.some(v => v.addr === addr)) return;
        this.addrInfos.push({ addr: addr, balance: 0, currencyName: currencyName, addrName: addrName, transactions: [], record: [] });

        // 更新对应地址交易记录
        if (currencyName !== 'BTC') {
            this.updateList.push(['balance', addr, currencyName]);
        }
        this.updateList.push(['transaction', addr, currencyName]);
    }

    /**
     * 通过货币类型获取地址余额列表
     */
    public getAddrInfosByCurrencyName(currencyName: string) {
        return this.addrInfos.filter(v => v.currencyName === currencyName);
    }

    /**
     * 通过地址获取地址余额
     */
    public getAddrInfoByAddr(addr: string) {
        return this.addrInfos.filter(v => v.addr === addr)[0];
    }

    /**
     * 通过地址获取所有的交易记录
     */
    public getAllTransactionsByAddr(addr: string, currencyName: string) {
        // 从缓存中取出对应地址的交易记录
        const transactions = getLocalStorage('transactions') || [];

        // return transactions.filter(v => v.addr === addr);

        let list = [];
        if (currencyName === 'ETH') {
            list = transactions.filter(v => v.addr === addr);
        } else if (currencyName === 'BTC') {
            list = transactions.filter(v => v.addr === addr).map(v => {
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
        if (currencyName === 'ETH') {
            return this.ethExchangeRate || { CNY: 3337.01, USD: 517.42 };
        } else if (currencyName === 'BTC') {
            return this.btcExchangeRate || { CNY: 6586.55, USD: 1021.28 };
        }
    }
    /**
     * 更新记录
     */
    public updatetTransaction(addr: string, currencyName: string) {
        this.updateList.push(['transaction', addr, currencyName]);
    }

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 1 * 1000);
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
        switch (currencyName) {
            case 'ETH': this.parseEthTransactionDetails(addr); break;
            case 'BTC': this.parseBtcTransactionDetails(addr); break;
            default:
        }

    }

    private async parseEthTransactionDetails(addr: string) {
        const api = new EthApi();
        const r: any = await api.getAllTransactionsOf(addr);

        const list = [];
        // const hashList = [];
        const transactions = getLocalStorage('transactions') || [];
        r.result.forEach(v => {
            if (transactions.some(v1 => v1.hash === v.hash)) return;
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
                currencyName: 'ETH',
                addr: addr
            };
            list.push(record);
            // hashList.push(v.hash);
        });
        if (list.length > 0) {
            setLocalStorage('transactions', transactions.concat(list), false);

            // let addrs = getLocalStorage('addrs') || [];
            // addrs = addrs.map(v => {
            //     if (v.addr === currentAddr) {
            //         const per = v.transactions || [];
            //         v.transactions = per.concat(hashList);
            //     }

            //     return v;
            // });
            // setLocalStorage('addrs', addrs, false);
        }

        // this.state.currentAddrRecords = this.state.currentAddrRecords.filter(v => removeList.indexOf(v.id) < 0);
        // list = list.concat(this.state.currentAddrRecords.map(v => {
        //     v.account = parseAccount(v.to);
        //     v.showPay = `${v.pay} ${this.props.currencyName}`;

        //     return v;
        // }));
        // console.log(list, r)

        // this.state.list = list.sort((a, b) => b.time - a.time);

        // this.resetRecord(this.state.currentAddrRecords, false);

    }

    private async parseBtcTransactionDetails(addr: string) {
        const api = new BtcApi();
        const info = await api.getAddrInfo(addr);
        if (!info) return;
        const num = sat2Btc(info.balance);
        this.setBalance(addr, num);
        console.log('getAddrInfo', info);
        if (info.txrefs) {
            const transactions = getLocalStorage('transactions') || [];
            info.txrefs.forEach(v => {
                const t = transactions.filter(v1 => v1.hash === v.tx_hash);
                if (t.length > 0) {
                    this.addTransactions(transactions, v, t, addr);

                    return;
                }
                // todo 移除缓存记录
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
        const api = new BtcApi();
        const info = await api.getTxInfo(iInfo.tx_hash);
        console.log('getTxInfo', info);
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

        setLocalStorage('transactions', transactions, false);

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

        setLocalStorage('transactions', transactions, false);

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
        switch (currencyName) {
            case 'ETH':
                const api = new EthApi();
                api.getBalance(addr).then(r => {
                    const num = wei2Eth((<any>r).toNumber());
                    this.setBalance(addr, num);
                });
                break;
            case 'BTC': break;

            default:
        }
    }

    /**
     * 设置余额
     */
    private setBalance(addr: string, num: number) {
        this.addrInfos = this.addrInfos.map(v => {
            if (v.addr === addr) v.balance = num;

            return v;
        });
    }

    private async exchangeRate(currencyName: string) {
        switch (currencyName) {
            case 'ETH':
                const api: EthApi = new EthApi();
                this.ethExchangeRate = await api.getExchangeRate();
                break;
            case 'BTC': break;
            default:
        }

    }

}

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();