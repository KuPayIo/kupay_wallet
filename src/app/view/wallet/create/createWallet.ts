/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { createWallet, CreateWalletType } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { openConnect } from '../../../net/login';
import { uploadFile } from '../../../net/pull';
import { setStore } from '../../../store/memstore';
import { pswEqualed, walletNameAvailable } from '../../../utils/account';
import { getStaticLanguage, imgResize, popNewMessage } from '../../../utils/tools';
import { fetchMnemonicFragment, getMnemonicByHash, playerName } from '../../../utils/walletTools';
import { forelet, WIDGET_NAME } from './home';
interface Props {
    itype: CreateWalletType;
    mnemonic?: string;// 助记词
    fragment1?: string;// 片段1
    fragment2?: string;// 片段2
}
export class CreateWallet extends Widget {
    public props: any;
    public ok: () => void;
    public cancel: () => void;
    public language: any;

    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            itype: this.props.itype,
            walletName: playerName(),
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed: false,
            userProtocolReaded: false,
            walletPswAvailable: false,
            chooseImage: false,
            avatarHtml: '',
            imagePicker:null
        };
        console.log(this.props);
    }

    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.init();
    }
    public backPrePage() {
        this.cancel && this.cancel();
    }
    public walletNameChange(e: any) {
        this.props.walletName = e.value;
        this.paint();
    }
    public checkBoxClick(e: any) {
        this.props.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    public pswConfirmChange(r: any) {
        this.props.walletPswConfirm = r.value;
        this.props.pswEqualed = pswEqualed(this.props.walletPsw, this.props.walletPswConfirm);
        this.paint();
    }
    // 密码格式正确通知
    public pswChange(res: any) {
        this.props.walletPswAvailable = res.success;
        this.props.walletPsw = res.password;
        this.props.pswEqualed = pswEqualed(this.props.walletPsw, this.props.walletPswConfirm);
        this.paint();
    }

    // 清除密码
    public pwsClear() {
        this.props.walletPsw = '';
        this.paint();
    }
    public selectImageClick() {
        this.props.imagePicker = selectImage((width, height, url) => {
            console.log('selectImage url = ',url);
            // tslint:disable-next-line:max-line-length
            this.props.avatarHtml = `<div style="background-image: url(${url});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
            this.props.chooseImage = true;
            this.paint();
        });
    }

    public randomPlayName() {
        this.props.walletName = playerName();
        document.getElementById('random').classList.add('random');
        setTimeout(() => {
            document.getElementById('random').classList.remove('random');
        }, 1000);
        this.paint();
    }
    public async createClick() {
        if (!this.props.userProtocolReaded) {
            return;
        }
        if (!walletNameAvailable(this.props.walletName)) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        if (!this.props.walletPsw || !this.props.walletPswConfirm) {
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }
        if (!this.props.walletPswAvailable) {
            popNew('app-components1-message-message', { content: this.language.tips[2] });

            return;
        }
        if (!this.props.pswEqualed) {
            popNew('app-components1-message-message', { content: this.language.tips[3] });

            return;
        }
        const option: any = {
            psw: this.props.walletPsw,
            nickName: this.props.walletName
        };
        if (this.props.itype === CreateWalletType.StrandarImport) {
            option.mnemonic = this.props.mnemonic;
        } else if (this.props.itype === CreateWalletType.FragmentImport) {
            option.fragment1 = this.props.fragment1;
            option.fragment2 = this.props.fragment2;
        }
        console.time('pi_create createWallet all need');
        const secrectHash = await createWallet(this.props.itype, option);
        console.timeEnd('pi_create createWallet all need');
        if (!secrectHash) {
            popNewMessage(this.language.tips[3]);
        }

        const mnemonic = getMnemonicByHash(secrectHash);
        const fragments = fetchMnemonicFragment(secrectHash);
        requestAnimationFrame(() => {
            popNew('app-components1-modalBox-modalBox', getStaticLanguage().createSuccess, () => {
                popNew('app-view-wallet-backup-index', { mnemonic: mnemonic, fragments: fragments,pi_norouter:true });
            });
        });
        setStore('flags/createWallet',true);
        openConnect(secrectHash);

        if (this.props.chooseImage) {
            this.props.imagePicker.getContent({
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        uploadFile(res.base64);
                    });
                }
            });
            
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
