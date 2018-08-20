/**
 * 云端资产
 */
interface Props {
    coinType: string;
    coinBalance: number;
}
// ========================================================导入
import { getHeight, popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

import { Forelet } from '../../../../pi/widget/forelet';
import { CurrencyType } from '../../../store/interface';
import { getBorn, register } from '../../../store/store';
// =======================================================导出
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AccountAssests extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.init();
        this.dataProcess();
    }
    public init(): void {
        this.state = {
            coinBalance:0,
            maskHeight: getHeight(),
            isActive: 0,
            panelBtns: [{
                label: '全部',
                component: 'app-view-cloud-accountAssests-others'
            }, {
                label: '充值',
                component: 'app-view-cloud-accountAssests-charge'
            }, {
                label: '提币',
                component: 'app-view-cloud-accountAssests-withdraw'
            }],
            showChargeAndWithdraw: this.props.coinType === 'ETH'
        };
        this.updateBalance();

    }
    public backClick() {
        this.ok && this.ok();
    }
    // 点击面板按钮
    public panelBtnClicked(e: any, index: any) {
        this.state.isActive = index;
        this.paint();
    }

    public chargeClicked() {
        popNew('app-view-cloud-assestsManage-charge', { currencyName: this.props.coinType },() => {
            console.log('充值---------------');
            this.state.isActive = 1;
            this.paint();
        });
    }
    public withdrawClicked() {
        popNew('app-view-cloud-assestsManage-withdraw', { currencyName: this.props.coinType },() => {
            console.log('提现---------------');
            this.state.isActive = 2;
            this.paint();
        });
    }

    public dataProcess() {
        this.state.coinType = this.props.coinType;
        if (this.props.coinType === 'KT') {
            this.state.coinIcon = 'cloud_cointype_btc.png';
        } else if (this.props.coinType === 'ETH') {
            this.state.coinIcon = 'cloud_cointype_eth.png';
        }
    }
    public updateBalance() {
        console.log('cloudBalance',getBorn('cloudBalance').get(101));
        this.state.coinBalance = getBorn('cloudBalance').get(CurrencyType[this.props.coinType]);
        this.paint();
    }
}
// ============================本地
register('cloudBalance', cloudBalance => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});