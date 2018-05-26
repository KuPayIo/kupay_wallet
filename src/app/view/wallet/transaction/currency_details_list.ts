import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getCurrentWallet, getLocalStorage, wei2Eth, parseAccount, setLocalStorage, effectiveCurrency, effectiveCurrencyNoConversion, parseDate } from "../../../utils/tools";
import { Api } from "../../../core/eth/api";
import { register } from "../../../store/store";

interface Props {
    list: any[];
    height: number;
}

export class CurrencyDetailsList extends Widget {
    public props: Props;

    public ok: () => void;

    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {

    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e, index) {
        popNew("app-view-wallet-transaction-transaction_details", this.props.list[index])
    }

}

