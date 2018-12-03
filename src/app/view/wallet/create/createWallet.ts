/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { resize } from '../../../../pi/widget/resize/resize';
import { Widget } from '../../../../pi/widget/widget';
import { createWallet, CreateWalletType } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { openConnect, uploadFile } from '../../../net/pull';
import { getStore, register, setStore } from '../../../store/memstore';
import { pswEqualed, walletNameAvailable } from '../../../utils/account';
import { checkCreateAccount, getStaticLanguage, popNewMessage } from '../../../utils/tools';
import { fetchMnemonicFragment, getMnemonicByHash, playerName } from '../../../utils/walletTools';
import { forelet, WIDGET_NAME } from './home';
interface Props {
    itype: CreateWalletType;
    imageBase64?: string;// 图片base64
    imagePsw?: string;// 图片密码
    mnemonic?: string;// 助记词
    fragment1?: string;// 片段1
    fragment2?: string;// 片段2
}
export class CreateWallet extends Widget {
    public props: Props;
    public ok: () => void;
    public cancel: () => void;
    public language: any;

    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            itype: CreateWalletType.Random,
            walletName: playerName(),
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed: false,
            userProtocolReaded: false,
            walletPswAvailable: false,
            chooseImage: false,
            avatar: '',
            avatarHtml: ''
        };
    }

    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.state.itype = props.itype;
    }
    public backPrePage() {
        this.cancel && this.cancel();
    }
    public walletNameChange(e: any) {
        this.state.walletName = e.value;
        this.paint();
    }
    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    public pswConfirmChange(r: any) {
        this.state.walletPswConfirm = r.value;
        this.state.pswEqualed = pswEqualed(this.state.walletPsw, this.state.walletPswConfirm);
        this.paint();
    }
    // 密码格式正确通知
    public pswChange(res: any) {
        this.state.walletPswAvailable = res.success;
        this.state.walletPsw = res.password;
        this.state.pswEqualed = pswEqualed(this.state.walletPsw, this.state.walletPswConfirm);
        this.paint();
    }

    // 清除密码
    public pwsClear() {
        this.state.walletPsw = '';
        this.paint();
    }
    public selectImageClick() {
        selectImage((width, height, base64) => {
            resize({ url: base64, width: 140, ratio: 0.3, type: 'jpeg' }, (res) => {
                console.log('resize---------', res);
                this.state.chooseImage = true;
                // tslint:disable-next-line:max-line-length
                this.state.avatarHtml = `<div style="background-image: url(${res.base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
                this.state.avatar = res.base64;
                this.paint();
            });
        });

    }
    public randomPlayName() {
        this.state.walletName = playerName();
        document.getElementById('random').classList.add('random');
        setTimeout(() => {
            document.getElementById('random').classList.remove('random');
        }, 1000);
        this.paint();
    }
    public async createClick() {
        if (!this.state.userProtocolReaded) {
            return;
        }
        if (!walletNameAvailable(this.state.walletName)) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        if (!this.state.walletPsw || !this.state.walletPswConfirm) {
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }
        if (!this.state.walletPswAvailable) {
            popNew('app-components1-message-message', { content: this.language.tips[2] });

            return;
        }
        if (!this.state.pswEqualed) {
            popNew('app-components1-message-message', { content: this.language.tips[3] });

            return;
        }
        const option: any = {
            psw: this.state.walletPsw,
            nickName: this.state.walletName
        };
        if (this.state.itype === CreateWalletType.StrandarImport) {
            option.mnemonic = this.props.mnemonic;
        } else if (this.state.itype === CreateWalletType.FragmentImport) {
            option.fragment1 = this.props.fragment1;
            option.fragment2 = this.props.fragment2;
        }
        console.time('pi_create createWallet all need');
        const hash = await createWallet(this.state.itype, option);
        console.timeEnd('pi_create createWallet all need');
        if (!hash) {
            popNewMessage(this.language.tips[3]);
        }

        const mnemonic = getMnemonicByHash(hash);
        const fragments = fetchMnemonicFragment(hash);
        setStore('flags', { created: true, mnemonic, fragments });
        if (getStore('user/offline')) {
            checkCreateAccount();
        } else {
            openConnect();
        }

        if (this.state.avatar) {
            uploadFile(this.state.avatar);
        }

        const w: any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
        this.ok && this.ok();
    }

    /**
     * 查看隐私条约
     */
    public agreementClick() {
        popNew('app-view-mine-other-privacypolicy');
    }
}

// 登录状态成功
register('flags', (flags: any) => {
    if (flags.promptBackup) {
        popNew('app-components1-modalBox-modalBox', getStaticLanguage().createSuccess, () => {
            popNew('app-view-wallet-backup-index', { mnemonic: flags.mnemonic, fragments: flags.fragments });
        });
        flags.promptBackup = false;
        setStore('flags', flags, false);
    }
});