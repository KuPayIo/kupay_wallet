/**
 * create a wallet
 */
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { generateByHash, sha3 } from '../../../../core/genmnemonic';
import { GlobalWallet } from '../../../../core/globalWallet';
import { openAndGetRandom } from '../../../../net/pull';
import { Addr, Wallet } from '../../../../store/interface';
import { find, updateStore } from '../../../../store/store';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable } from '../../../../utils/account';
import { defalutShowCurrencys } from '../../../../utils/constants';
import { calcHashValuePromise, encrypt, getAddrsAll, getXOR, openBasePage } from '../../../../utils/tools';

interface Props {
    choosedImg: string;
    inputWords: string;
}

export class WalletCreate extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        this.state = {
            walletName: '',
            walletPsw: '',
            walletPswConfirm: '',
            walletPswTips: '',
            userProtocolReaded: false,
            curWalletPswStrength: getWalletPswStrength(),
            showPswTips: false
        };
        const walletList = find('walletList');
        const len = walletList ? walletList.length : 0;
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

        const close = popNew('app-components_level_1-loading-loading', { text: '创建中...' });
        try {
            const hash: any = await imgToHash(this.props.choosedImg, this.props.inputWords);
            await this.createWallet(hash);
            popNew('app-view-wallet-walletCreate-createComplete');
            this.ok && this.ok();
        } catch (error) {
            if (!error) {
                this.ok && this.ok();
            }
        }
        close.callback(close.widget);

    }

    public async createWallet(hash: Uint8Array) {

        const walletList: Wallet[] = find('walletList');
        let addrs: Addr[] = find('addrs');
        const salt = find('salt');
        const gwlt = await GlobalWallet.generate(this.state.walletPsw, this.state.walletName, salt, hash);
        // 判断钱包是否存在
        let len = walletList.length;
        if (walletList.some(v => v.walletId === gwlt.glwtId)) {
            await openBasePage('app-components-message-messagebox', { itype: 'confirm', title: '提示', content: '该钱包已存在，是否使用新密码' });

            for (let i = len - 1; i >= 0; i--) {
                if (gwlt.glwtId === walletList[i].walletId) {
                    const wallet0 = walletList.splice(i, 1)[0];// 删除已存在钱包
                    const retAddrs = getAddrsAll(wallet0);
                    addrs = addrs.filter(addr => {
                        return retAddrs.indexOf(addr.addr) === -1;
                    });
                    break;
                }
            }
            len--;
        }

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

const imgToHash = async (choosedImg, inputWords) => {
    const sha3Hash = sha3(choosedImg + inputWords, false);
    const hash = await calcHashValuePromise(sha3Hash, find('salt'), null);
    const sha3Hash1 = sha3(hash, true);
    const len = sha3Hash1.length;
    // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
    const sha3Hash2 = getXOR(sha3Hash1.slice(0, len / 2), sha3Hash1.slice(len / 2));
    // console.log(choosedImg, inputWords, sha3Hash, hash, sha3Hash1, sha3Hash2);

    return generateByHash(sha3Hash2);

};