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
// =======================================================导出
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
            maskHeight: getHeight(),
            routePath: 'app-view-cloud-accountAssests-others',
            panelBtns: [{
                label: '其他',
                isActive: true,
                component: 'app-view-cloud-accountAssests-others'
            }, {
                label: '充值',
                isActive: false,
                component: 'app-view-cloud-accountAssests-charge'
            }, {
                label: '提币',
                isActive: false,
                component: 'app-view-cloud-accountAssests-withdraw'
            }],
            showChargeAndWithdraw: this.props.coinType === 'ETH'
        };

    }
    public backClick() {
        this.ok && this.ok();
    }
    // 点击面板按钮
    public panelBtnClicked(e: any, index: any) {
        // 按钮样式改变
        for (let i = 0; i < this.state.panelBtns.length; i++) {
            const temp = this.state.panelBtns[i];
            temp.isActive = false;
            if (i === index) {
                temp.isActive = true;
                // 动态组件改变
                this.state.routePath = temp.component;
            }
        }
        this.paint();
    }

    public chargeClicked() {
        popNew('app-view-cloud-assestsManage-charge', { currencyName: this.props.coinType });
    }
    public withdrawClicked() {
        popNew('app-view-cloud-assestsManage-withdraw', { currencyName: this.props.coinType });
    }

    public dataProcess() {
        this.state.coinType = this.props.coinType;
        if (this.props.coinType === 'KT') {
            this.state.coinIcon = 'cloud_cointype_btc.png';
        } else if (this.props.coinType === 'ETH') {
            this.state.coinIcon = 'cloud_cointype_eth.png';
        }
    }
}