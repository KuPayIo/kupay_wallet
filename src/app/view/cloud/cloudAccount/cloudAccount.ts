/**
 * 云端首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../store/dataCenter';
import { formatBalanceValue } from '../../../utils/tools';

interface Props {
    ktBalance: number;
    ethBalance: number;
}
export class CloudAccount extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        this.state = {
            accoutNickName: '昵称未设置',// 账户昵称
            accoutHeadImg: 'img_avatar1.jpg',// 账户头像
            accountAssets: '',// 账户资产
            coinList: [{
                coinIcon: 'cloud_cointype_btc.png',// 代币图标
                coinType: 'KT',// 代币名称
                coinBalance: this.props.ktBalance// 代币余额
            }, {
                coinIcon: 'cloud_cointype_eth.png',
                coinType: 'ETH',
                coinBalance: this.props.ethBalance
            }]
        };
        const all = dataCenter.getExchangeRate('KT').CNY * this.props.ktBalance
            + dataCenter.getExchangeRate('ETH').CNY * this.props.ethBalance;
        this.state.accountAssets = `≈${formatBalanceValue(all)} CNY`;
    }
    public backClick() {
        this.ok && this.ok();
    }
    public itemClicked(e: any, coinType: any) {
        const coinBalance = this.state.coinList.filter(v => v.coinType === coinType)[0].coinBalance;
        popNew('app-view-cloud-accountAssests-accountAssests', { coinType, coinBalance });
    }

}