/**
 * import wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { drawImg } from '../../../../pi/util/canvas';
import { Widget } from '../../../../pi/widget/widget';
import { Cipher } from '../../../core/crypto/cipher';
import { generateByHash, toMnemonic } from '../../../core/genmnemonic';
import { GlobalWallet } from '../../../core/globalWallet';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable } from '../../../utils/account';
import { ahash } from '../../../utils/ahash';
import { defalutShowCurrencys, walletNumLimit } from '../../../utils/constants';
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

        const close = popNew('pi-components-loading-loading', { text: '导入中...' });
        let gwlt = null;
        try {
            console.time('import');
            gwlt = await GlobalWallet.fromMnemonic(this.state.walletMnemonic, this.state.walletPsw);
            console.timeEnd('import');
            gwlt.nickName = this.state.walletName;
            this.importWallet(gwlt);

        } catch (e) {
            close.callback(close.widget);
            popNew('app-components-message-message', { itype: 'error', content: '导入失败', center: true });

            return;
        }
        close.callback(close.widget);
        this.ok && this.ok();
        popNew('app-view-wallet-backupWallet-backupWallet');

    }

    public importWallet(gwlt: GlobalWallet) {
        const wallets = getLocalStorage('wallets') || { walletList: [], curWalletId: '' };
        let addrs: Addr[] = getLocalStorage('addrs') || [];
        const curWalletId = gwlt.glwtId;
        const wallet: Wallet = {
            walletId: curWalletId,
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

const testAhash = () => {
    ['../../app/res/image/banner1.png', '../../app/res/image/banner2.png', '../../app/res/image/banner3.png'].map(testAhash1);
};

const testAhash1 = (src) => {
    const img = new Image();
    const cipher = new Cipher();
    img.onload = () => {
        const ab = drawImg(img);
        const r = ahash(new Uint8Array(ab), img.width, img.height, 4);
        const psw = '11111111';
        // 这里需要使用memory_hash进行处理，不适用sha256加密
        let s = cipher.sha256(r + psw);
        const len = s.length;
        // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
        s = getXOR(s.slice(0, len / 2), s.slice(len / 2));

        const t = generateByHash(s);
        const m = toMnemonic('english', t);
        console.log(img.src, r, s, t, m);
    };
    img.src = src;
};