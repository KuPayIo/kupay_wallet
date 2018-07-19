/**
 * 分享片段给好友
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BTCWallet } from '../../../core/btc/wallet';
import { GaiaWallet } from '../../../core/eth/wallet';
import { GlobalWallet } from '../../../core/globalWallet';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable } from '../../../utils/account';
import { defalutShowCurrencys, walletNumLimit } from '../../../utils/constants';
import { encrypt, getDefaultAddr, getLocalStorage, setLocalStorage } from '../../../utils/tools';
import { Addr, CurrencyRecord, Wallet } from '../../interface';

export class WalletCreate extends Widget {
    public ok: () => void;
    public state;
    public props = {
        totalSteps: 3//总分享数
    };
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            part: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksg",//分享内容
            step: 1//分享第几个人
        }
    }
    public back() {
        this.ok && this.ok();
    }
    public shareBtnClick() {
        //TODO 分享给好友

        //分享完成后
        this.state.step++;
        this.paint();

        //分享完成
        if (this.state.step > this.props.totalSteps) {
            this.ok && this.ok();
        }

    }

}
