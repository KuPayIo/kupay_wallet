/**
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Api } from '../../../core/eth/api';
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
        wallet.currencyRecords.forEach(v => {
            v.addrs.forEach(v1 => {
                this.parseTransactionDetails(v1, getAddrById(v1).record);
            });
        });
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

    public async parseTransactionDetails(addr: any, records: any) {

        const api = new Api();
        const r: any = await api.getAllTransactionsOf(addr);

        const removeList = [];
        let list = r.result.map(v => {
            const pay = effectiveCurrencyNoConversion(parseFloat(v.value), 'ETH', true);
            const fees = effectiveCurrencyNoConversion(parseFloat(v.gasUsed) * parseFloat(v.gasPrice), 'ETH', true);
            const isHave = records.some(v1 => v1.id === v.hash);
            if (isHave) removeList.push(v.hash);
            const isFromMe = v.from.toLowerCase() === addr.toLowerCase();
            const isToMe = v.to.toLowerCase() === addr.toLowerCase();
            const t = parseInt(v.timeStamp, 10) * 1000;
            // info--input  0x636573--ces

            return {
                id: v.hash,
                type: isFromMe ? (isToMe ? '自己' : '转账') : '收款',
                fromAddr: v.from,
                to: v.to,
                pay: pay.num + fees.num,
                tip: fees.show,
                time: t,
                showTime: parseDate(new Date(t)),
                result: '已完成',
                info: '无',
                account: parseAccount(isFromMe ? (isToMe ? v.from : v.to) : v.from),
                showPay: pay.show
            };
        });
        records = records.filter(v => removeList.indexOf(v.id) < 0);
        list = list.concat(records.map(v => {
            v.account = parseAccount(v.to);
            v.showPay = `${v.pay} ETH`;

            return v;
        }));

        list = this.state.list.concat(list);
        // console.log(list, r)

        this.state.list = list.sort((a, b) => b.time - a.time);
        this.paint();

    }
}
