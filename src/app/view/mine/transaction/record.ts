/**
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../store/dataCenter';
import {
    effectiveCurrencyNoConversion, getAddrById, getCurrentWallet, getLocalStorage, parseAccount, parseDate
} from '../../../utils/tools';

interface State {
    list: any[];
}

export class AddAsset extends Widget {
    public state: State;

    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public init(): void {

        this.state = { list: [] };
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        if (!wallet.currencyRecords) return;
        let list = [];
        wallet.currencyRecords.forEach(v => {
            v.addrs.forEach(v1 => {
                list = list.concat(this.parseTransactionDetails(v1, v.currencyName));
            });
        });
        this.state.list = list.sort((a, b) => b.time - a.time);
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e: any, index: number) {
        popNew('app-view-wallet-transaction-transaction_details', this.state.list[index]);
    }

    public parseTransactionDetails(currentAddr: string, currencyName: string) {

        let list = dataCenter.getAllTransactionsByAddr(currentAddr, currencyName);
        list = list.map(v => {

            const pay = effectiveCurrencyNoConversion(v.value, currencyName, true);
            const fees = effectiveCurrencyNoConversion(v.fees, currencyName, true);
            const isFromMe = v.from.toLowerCase() === currentAddr.toLowerCase();
            const isToMe = v.to.toLowerCase() === currentAddr.toLowerCase();

            return {
                id: v.hash,
                type: isFromMe ? (isToMe ? '自己' : '转账') : '收款',
                fromAddr: v.from,
                to: v.to,
                pay: pay.num,
                tip: fees.show,
                time: v.time,
                showTime: parseDate(new Date(v.time)),
                result: '已完成',
                info: v.info,
                account: parseAccount(isFromMe ? (isToMe ? v.from : v.to) : v.from).toLowerCase(),
                showPay: pay.show,
                currencyName: currencyName
            };
        });

        const addr = getAddrById(currentAddr);
        let recordList = [];
        if (addr) {
            recordList = addr.record.map(v => {
                const pay = effectiveCurrencyNoConversion(v.pay, currencyName, false);

                v.account = parseAccount(v.to).toLowerCase();
                v.showPay = pay.show;

                return v;
            });
        }

        return list.concat(recordList);

    }
}
