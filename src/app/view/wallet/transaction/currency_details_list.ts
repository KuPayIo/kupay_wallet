/**
 * 货币详情列表
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    list: any[];
    height: number;
}

export class CurrencyDetailsList extends Widget {

    public ok: () => void;

    constructor() {
        super();
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e: any, index: number) {
        popNew('app-view-wallet-transaction-transaction_details', this.props.list[index]);
    }

}
