/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { openAndGetRandom } from '../../../store/conMgr';
import { find, updateStore } from '../../../store/store';
import {
    getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable
} from '../../../utils/account';
import { defalutShowCurrencys } from '../../../utils/constants';
import { encrypt } from '../../../utils/tools';
import { Addr, Wallet } from '../../interface';

export class WalletCreate extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            walletName: '',
            walletPsw: '',
            walletPswConfirm: '',
            pswSame: true,
            walletPswTips: '',
            userProtocolReaded: false,
            curWalletPswStrength: getWalletPswStrength(),
            showPswTips: false

        };
        const wallets = find('walletList');
        const len = wallets ? wallets.length : 0;
        this.state.walletName = `我的钱包${len + 1}`;
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public walletNameChange(e: any) {
        this.state.walletName = e.value;
    }
    public walletPswChange(e: any) {
        this.state.walletPsw = e.value;
        // 判断两次输入密码是否相同
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {
            this.state.pswSame = false;
        } else {
            this.state.pswSame = true;
        }
        this.state.showPswTips = this.state.walletPsw.length > 0;
        this.state.curWalletPswStrength = getWalletPswStrength(this.state.walletPsw);
        this.paint();
    }
    public walletPswBlur() {
        this.state.showPswTips = false;
        this.paint();
    }
    public walletPswConfirmChange(e: any) {
        this.state.walletPswConfirm = e.value;
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {
            this.state.pswSame = false;
        } else {
            this.state.pswSame = true;
        }
        this.paint();
    }
    public walletPswTipsChange(e: any) {
        this.state.walletPswTips = e.value;
    }
    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    public agreementClick() {
        popNew('app-view-wallet-agreementInterpretation-agreementInterpretation');
    }
    public async createWalletClick() {
        if (!this.state.userProtocolReaded) {
            // popNew("app-components-message-message", { itype: "notice", content: "请阅读用户协议" })
            return;
        }
        if (!walletNameAvailable(this.state.walletName)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '钱包名称错误', content: '请输入1-24位钱包名', center: true });

            return;
        }
        if (!walletPswAvailable(this.state.walletPsw)) {
            popNew('app-components-message-message', { itype: 'error', content: '密码格式不正确', center: true });

            return;
        }
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {

            return;
        }
        if (!walletCountAvailable()) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包数量已达上限', center: true });
            this.ok && this.ok();

            return;
        }

        const close = popNew('pi-components-loading-loading', { text: '创建中...' });
        await this.createWallet();
        close.callback(close.widget);
        this.ok && this.ok();
        popNew('app-view-wallet-walletCreate-createComplete');
    }

    public async createWallet() {
        const salt = find('salt');
        const gwlt = await GlobalWallet.generate(this.state.walletPsw, this.state.walletName,salt);

        // 创建钱包基础数据
        const wallet: Wallet = {
            walletId: gwlt.glwtId,
            avatar: getAvatarRandom(),
            gwlt: gwlt.toJSON(),
            showCurrencys: defalutShowCurrencys,
            currencyRecords: []
        };

        wallet.currencyRecords.push(...gwlt.currencyRecords);

        if (this.state.walletPswTips.trim().length > 0) {
            wallet.walletPswTips = encrypt(this.state.walletPswTips.trim());
        }

        const walletList: Wallet[] = find('walletList');
        const addrs: Addr[] = find('addrs');
        addrs.push(...gwlt.addrs);
        updateStore('addrs', addrs);
        walletList.push(wallet);
        updateStore('walletList', walletList);
        updateStore('curWallet', wallet);
        updateStore('salt', salt);

        openAndGetRandom();
    }

    public importWalletClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-walletImport');
    }
}
