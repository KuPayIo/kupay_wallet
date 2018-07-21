/**
 * import wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
import {  getWalletPswStrength, pswEqualed, walletCountAvailable, walletPswAvailable } from '../../../utils/account';
export class WalletImport extends Widget {
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
            walletMnemonic: '',
            walletPart1: '',
            walletPart2: '',
            walletName: '',
            walletPsw: '',
            walletPswConfirm: '',
            walletPswTips: '',
            userProtocolReaded: false,
            curWalletPswStrength: getWalletPswStrength(),
            textAreaStyle1: {
                border: '3px dotted #A0ACC0',
                'border-bottom': 'none',
                'padding-top': '26px'
            },
            textAreaStyle2: {
                border: '3px dotted #A0ACC0',
                'padding-top': '26px'
            }
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public walletPart1Change(e: any) {
        this.state.walletPart1 = e.value;
    }
    public walletPart2Change(e: any) {
        this.state.walletPart2 = e.value;
    }
    public walletMnemonicChange(e: any) {
        this.state.walletMnemonic = e.value;
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
    public importWalletClick() {
        if (!this.state.userProtocolReaded) {
            // popNew("app-components-message-message", { itype: "notice", content: "请阅读用户协议" })
            return;
        }
        // if (!walletNameAvailable(this.state.walletName)) {
        //     popNew('app-components-message-messagebox', { itype: 'alert', title: '钱包名称错误', content: '请输入1-24位钱包名', center: true });

        //     return;
        // }
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
        const close = popNew('pi-components-loading-loading', { text: '导入钱包中...' });
        // this.importWallet();
        setTimeout(() => {
            close.callback(close.widget);
        }, 500);
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-importComplete');
    }

}