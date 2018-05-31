/**
 * import wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletNameAvailable, walletPswAvailable } from '../../../utils/account';
import { encrypt, getDefaultAddr, getLocalStorage, setLocalStorage } from '../../../utils/tools';
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
    public walletMnemonicChange(e:any) {
        this.state.walletMnemonic = e.value;
    }
    public walletNameChange(e:any) {
        this.state.walletName = e.value;
    }
    public walletPswChange(e:any) {
        this.state.walletPsw = e.value;
        this.state.curWalletPswStrength = getWalletPswStrength(this.state.walletPsw);
        this.paint();
    }
    public walletPswConfirmChange(e:any) {
        this.state.walletPswConfirm = e.value;
    }
    public walletPswTipsChange(e:any) {
        this.state.walletPswTips = e.value;
    }
    public checkBoxClick(e:any) {
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
        if (!walletNameAvailable(this.state.walletName)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '钱包名称错误', content: '请输入1-12位钱包名', center: true });

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
        let gwlt = null;
        try {
            gwlt = GaiaWallet.fromMnemonic(this.state.walletMnemonic, 'english', this.state.walletPsw);
            gwlt.nickName = this.state.walletName;
        } catch (e) {
            popNew('app-components-message-message', { itype: 'error', content: '无效的助记词', center: true });

            return;
        }
        if (!this.importWallet(gwlt)) {
            popNew('app-components-message-message', { itype: 'error', content: '钱包数量已达上限', center: true });
            this.ok && this.ok();

            return;
        }

        const close = popNew('pi-components-loading-loading', { text: '导入中' });
        setTimeout(() => {
            close.callback(close.widget);
            this.ok && this.ok();
            popNew('app-view-wallet-backupWallet-backupWallet');
        }, 500);
    }

    public importWallet(gwlt: GaiaWallet) {
        const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '' };
        const addrs: Addr[] = getLocalStorage('addrs') || [];
        const curWalletId = gwlt.address;
        const len0 = wallets.walletList.length;
        if (len0 === 10) {
            return false;
        }
        const wallet: Wallet = {
            walletId: curWalletId,
            avatar: getAvatarRandom(),
            walletPsw: encrypt(this.state.walletPsw),
            gwlt: gwlt.toJSON(),
            showCurrencys: ['ETH'],
            currencyRecords: [{
                currencyName: 'ETH',
                currentAddr: gwlt.address,
                addrs: [gwlt.address]
            }]
        };
        addrs.push({
            addr: gwlt.address,
            addrName: getDefaultAddr(gwlt.address),
            gwlt: gwlt.toJSON(),
            record: [],
            balance: 0,
            currencyName: 'ETH'
        });
        if (this.state.walletPswTips.trim().length > 0) {
            wallet.walletPswTips = encrypt(this.state.walletPswTips.trim());
        }

        // 判断钱包是否存在
        const len = wallets.walletList.length;
        for (let i = 0; i < len; i++) {
            if (gwlt.address === wallets.walletList[i].walletId) {
                wallets.walletList.splice(i, 1);// 删除已存在钱包
                break;
            }
        }
        wallets.curWalletId = curWalletId;
        wallets.walletList.push(wallet);
        setLocalStorage('addrs', addrs, false);
        setLocalStorage('wallets', wallets, true);

        return true;
    }

    /**
     * 判断导入的钱包是否存在
     * @param gwlt imported wallet
     */
    public importedWalletIsExisted(gwlt: GaiaWallet) {

        const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '' };
        const len = wallets.walletList.length;
        for (let i = 0; i < len; i++) {
            if (gwlt.address === wallets.walletList[i].walletId) {
                return true;
            }
        }
        
        return false;
    }

}