/**
 * 云端首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class CloudAccount extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            accoutNickName:'昵称未设置',// 账户昵称
            accoutHeadImg:'BTC.png',// 账户头像
            accountAssets:'￥50.050',// 账户资产
            coinList:[{
                coinIcon:'cloud_cointype_btc.png',// 代币图标
                coinType:'KPT',// 代币名称
                coinBalance:'0.000000'// 代币余额
            },{
                coinIcon:'cloud_cointype_eth.png',
                coinType:'ETH',
                coinBalance:'0.000000'
            }]
        };
    }
    public backClick() {
        this.ok && this.ok();
    }
    public itemClicked(e:any,coinType:any) {
        popNew('app-view-cloud-accountAssests-accountAssests',{ coinType });
    }

}