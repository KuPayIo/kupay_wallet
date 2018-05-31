import { Api } from '../core/eth/api';
import { getCurrentWallet, getLocalStorage, wei2Eth } from '../utils/tools';

/**
 * 创建事件处理器表
 * @example
 */
export class DataCenter {

    public rate: string;
    public addrBalances: any[] = [];
    public addrs: string[] = [];
    public timerRef: number = 0;

    /**
     * 初始化
     */
    public init() {
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
            this.addrBalances = [];
            addrs.forEach(v => {
                if (list.indexOf(v.addr) >= 0) {
                    this.addAddr(v.addr, v.addrName, v.currencyName);
                }
            });
        }

        // 启动定时器更新
        if (this.timerRef) this.openCheck();
    }

    /**
     * addAddr
     */
    public addAddr(addr: string, addrName: string, currencyName: string) {
        if (this.addrBalances.some(v => v.addr === addr)) return;
        this.addrBalances.push({ addr: addr, balance: 0, currencyName: currencyName, addrName: addrName });
    }

    /**
     * 通过货币类型获取地址余额列表
     */
    public getAddrBalancesByCurrencyName(currencyName: string) {
        return this.addrBalances.filter(v => v.currencyName === currencyName);
    }

    /**
     * 通过地址获取地址余额
     */
    public getAddrBalanceByAddr(addr: string) {
        return this.addrBalances.filter(v => v.addr === addr)[0];
    }

    /**
     * 设置余额
     */
    private setBalance(addr: string, r: any, currencyName: string) {
        console.log('setBalance', addr, r);
        let num = 0;
        if (currencyName === 'ETH') {
            num = wei2Eth((<any>r).toNumber());
        }
        this.addrBalances = this.addrBalances.map(v => {
            if (v.addr === addr) v.balance = num;

            return v;
        });
    }

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 10 * 1000);
        const api = new Api();
        this.addrBalances.forEach(v => {
            // api.getBalance(v.addr).then(r => {
            //     this.setBalance(v.addr, r, v.currencyName)
            // });
        });
        // this.parseTransactionDetails();
    }

}

// ============================================ 立即执行
/**
 * 消息处理列表
 */
export const dataCenter: DataCenter = new DataCenter();