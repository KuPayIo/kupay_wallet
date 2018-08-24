/**
 * import wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { base64ToArrayBuffer } from '../../../../pi/util/base64';
import { Widget } from '../../../../pi/widget/widget';
import { toMnemonic } from '../../../core/genmnemonic';
// tslint:disable-next-line:max-line-length
import { getWalletPswStrength, pswEqualed, walletCountAvailable, walletPswAvailable } from '../../../utils/account';
import { importWalletByMnemonic } from '../../../utils/basicOperation';
import { lang } from '../../../utils/constants';
import { restoreSecret } from '../../../utils/secretsBase';
import { hexstrToU8Array, u8ArrayToHexstr } from '../../../utils/tools';

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
            walletPart1: '',
            walletPart2: '',
            walletPsw: '',
            walletPswConfirm: '',
            pswSame:true,
            walletPswTips: '',
            userProtocolReaded: false,
            curWalletPswStrength: getWalletPswStrength(),
            showPswTips:false
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
    public walletPswChange(e: any) {
        this.state.walletPsw = e.value;
        this.state.showPswTips = this.state.walletPsw.length > 0;
        this.state.curWalletPswStrength = getWalletPswStrength(this.state.walletPsw);
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {
            this.state.pswSame = false;
        } else {
            this.state.pswSame = true;
        }
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
    public async importWalletClick() {
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
           
            return;
        }
        if (!walletCountAvailable()) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包数量已达上限', center: true });
            this.ok && this.ok();

            return;
        }
        const close = popNew('app-components-loading-loading', { text: '导入钱包中...' });
        try {
            await this.importWallet();

        } catch (e) {
            close.callback(close.widget);
            console.log(e);
            popNew('app-components-message-message', { itype: 'error', content: '导入失败', center: true });

            return;
        }
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-importComplete');
        close.callback(close.widget);
    }

    public async importWallet() {
        // todo 
        const shares = [this.state.walletPart1, this.state.walletPart2].map(v => u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v))));
        const comb = restoreSecret(shares);
        await importWalletByMnemonic(toMnemonic(lang, hexstrToU8Array(comb)), this.state.walletPsw, this.state.walletPswTips);
        
    }
}