/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable } from '../../../utils/account';
import { defalutShowCurrencys } from '../../../utils/constants';
import { encrypt, getLocalStorage, setLocalStorage } from '../../../utils/tools';
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
            walletPswTips: '',
            userProtocolReaded: false,
            curWalletPswStrength: getWalletPswStrength()
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public walletNameChange(e: any) {
        this.state.walletName = e.value;
    }
    public walletPswChange(e: any) {
        this.state.walletPsw = e.value;
        this.state.curWalletPswStrength = getWalletPswStrength(this.state.walletPsw);
        this.paint();
    }
    public walletPswConfirmChange(e: any) {
        this.state.walletPswConfirm = e.value;
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
            popNew('app-components-message-message', { itype: 'error', content: '密码格式不正确,请重新输入', center: true });

            return;
        }
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {
            popNew('app-components-message-message', { itype: 'error', content: '密码不一致，请重新输入', center: true });

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
        // popNew('app-view-wallet-backupWallet-backupWallet');
        const lockScreenPsw = getLocalStorage('lockScreenPsw');
        if (!lockScreenPsw) {
            popNew('app-view-guidePages-setLockScreenScret');
        } else {
            popNew('app-view-app');
        }
    }

    public async createWallet() {
        const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '' };
        const addrs: Addr[] = getLocalStorage('addrs') || [];

        const gwlt = await GlobalWallet.generate(this.state.walletPsw, this.state.walletName);

        // 创建钱包基础数据
        const wallet: Wallet = {
            walletId: gwlt.glwtId,
            avatar: getAvatarRandom(),
            walletPsw: encrypt(this.state.walletPsw),
            gwlt: gwlt.toJSON(),
            showCurrencys: defalutShowCurrencys,
            currencyRecords: []
        };

        wallet.currencyRecords.push(...gwlt.currencyRecords);

        if (this.state.walletPswTips.trim().length > 0) {
            wallet.walletPswTips = encrypt(this.state.walletPswTips.trim());
        }

        addrs.push(...gwlt.addrs);
        setLocalStorage('addrs', addrs, false);
        wallets.curWalletId = gwlt.glwtId;
        wallets.walletList.push(wallet);
        setLocalStorage('wallets', wallets, true);

    }

    public importWalletClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-walletImport');
    }
}
