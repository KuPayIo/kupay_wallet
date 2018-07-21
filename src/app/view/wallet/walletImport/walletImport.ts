/**
 * import wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { drawImg } from '../../../../pi/util/canvas';
import { Widget } from '../../../../pi/widget/widget';
import { Cipher } from '../../../core/crypto/cipher';
import { getRandomValuesByMnemonic } from '../../../core/genmnemonic';
import { GlobalWallet } from '../../../core/globalWallet';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable } from '../../../utils/account';
import { ahash } from '../../../utils/ahash';
import { defalutShowCurrencys, lang, walletNumLimit } from '../../../utils/constants';
import { encrypt, getAddrsAll, getLocalStorage, getXOR, setLocalStorage } from '../../../utils/tools';
import { Addr, Wallet } from '../../interface';

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
            popNew('app-components-message-message', { itype: 'error', content: '密码不一致，请重新输入', center: true });

            return;
        }
        if (!walletCountAvailable()) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包数量已达上限', center: true });
            this.ok && this.ok();

            return;
        }

        const close = popNew('pi-components-loading-loading', { text: '导入中...' });
        try {
            await this.importWallet();
        } catch (e) {
            close.callback(close.widget);
            console.log(e);
            popNew('app-components-message-message', { itype: 'error', content: '导入失败', center: true });

            return;
        }
        close.callback(close.widget);
        this.ok && this.ok();
        const lockScreenPsw = getLocalStorage('lockScreenPsw');
        if (!lockScreenPsw) {
            popNew('app-view-guidePages-setLockScreenScret');
        } else {
            popNew('app-view-app');
        }
        // popNew('app-view-wallet-backupWallet-backupWallet');

    }

    public async importWallet() {
        const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '' };
        let addrs: Addr[] = getLocalStorage('addrs') || [];

        let gwlt = null;
        console.time('import');
        gwlt = await GlobalWallet.fromMnemonic(this.state.walletMnemonic, this.state.walletPsw);
        // todo 这里需要验证钱包是否已经存在，且需要进行修改密码处理

        console.timeEnd('import');
        gwlt.nickName = `我的钱包${wallets.walletList.length + 1}`;

        const curWalletId = gwlt.glwtId;
        const wallet: Wallet = {
            walletId: curWalletId,
            avatar: getAvatarRandom(),
            gwlt: gwlt.toJSON(),
            showCurrencys: defalutShowCurrencys,
            currencyRecords: []
        };
        wallet.currencyRecords.push(...gwlt.currencyRecords);

        if (this.state.walletPswTips.trim().length > 0) {
            wallet.walletPswTips = encrypt(this.state.walletPswTips.trim());
        }

        // 判断钱包是否存在
        const len = wallets.walletList.length;
        for (let i = 0; i < len; i++) {
            if (gwlt.glwtId === wallets.walletList[i].walletId) {
                const wallet0 = wallets.walletList.splice(i, 1)[0];// 删除已存在钱包
                const retAddrs = getAddrsAll(wallet0);
                addrs = addrs.filter(addr => {
                    return retAddrs.indexOf(addr.addr) === -1;
                });
                break;
            }
        }
        addrs.push(...gwlt.addrs);
        setLocalStorage('addrs', addrs, false);
        wallets.curWalletId = curWalletId;
        wallets.walletList.push(wallet);
        setLocalStorage('wallets', wallets, true);

        return true;
    }

}