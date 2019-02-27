/**
 * account home
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { selectImage } from '../../../logic/native';
import { uploadFile } from '../../../net/pull';
import { getStore, register, setStore } from '../../../store/memstore';
import { changeWalletName, walletNameAvailable } from '../../../utils/account';
import { getUserInfo, imgResize, popNewMessage, popPswBox } from '../../../utils/tools';
import { backupMnemonic, getMnemonic } from '../../../utils/walletTools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AccountHome extends Widget {
    public ok: () => void;
    public language: any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.init();
    }
    public init() {
        const userInfo = getUserInfo();
        const wallet = getStore('wallet');
        const backup = wallet.isBackup;

        this.props = {
            avatar: '',
            nickName: '',
            phone: '',
            backup,
            canEditName: false,
            editName:'',
            chooseImage: false,
            avatarHtml: ''
        };
        if (userInfo.phoneNumber) {
            const str = String(userInfo.phoneNumber).substr(3, 6);
            this.props.phone = userInfo.phoneNumber.replace(str, '******');
        }
        this.props.nickName = userInfo.nickName ? userInfo.nickName : this.language.defaultName;
        this.props.editName = this.props.nickName;
        this.props.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
        this.paint();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 修改名字输入框取消聚焦
     */
    public walletNameInputBlur(e: any) {
        const v = e.value;
        this.props.canEditName = false;
        if (!walletNameAvailable(v)) {
            popNewMessage(this.language.tips[0]);

            return;
        }
        if (v !== this.props.nickName) {
            this.props.nickName = v;
            changeWalletName(v);
        }
        this.paint();
    }
    /**
     * 修改名字输入框值变化
     */
    public userNameChange(e:any) {
        this.props.editName = e.value;
    }

    // 备份助记词
    public async backupWalletClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index', { ...ret,pi_norouter:true });
        }

    }

    // 导出私钥
    public async exportPrivateKeyClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNew('app-components1-loading-loading', { text: this.language.loading });
        try {
            const mnemonic = await getMnemonic(psw);
            if (mnemonic) {
                popNew('app-view-mine-account-exportPrivateKey', { mnemonic });
            } else {
                popNewMessage(this.language.tips[1]);
            }
        } catch (error) {
            console.log(error);
            popNewMessage(this.language.tips[1]);
        }
        close.callback(close.widget);
    }

    public uploadAvatar() {
        const imagePicker = selectImage((width, height, url) => {
            console.log('selectImage url = ',url);
            // tslint:disable-next-line:max-line-length
            this.props.avatarHtml = `<div style="background-image: url(${url});width: 120px;height: 120px;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
            this.props.chooseImage = true;
            this.props.avatar = url;
            this.paint();
            imagePicker.getContent({
                quality:70,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        uploadFile(res.base64);
                    });
                }
            });
        });
    }

    /**
     * 绑定手机号
     */
    public changePhone() {
        popNew('app-view-mine-setting-phone');
    }

    /**
     * 修改密码
     */
    public changePsw() {
        popNew('app-view-mine-setting-changePsw');
    }

    /**
     * 点击可输入用户名
     */
    public changeInput() {
        if (this.props.canEditName) {
            const v = this.props.editName;
            if (!walletNameAvailable(v)) {
                popNewMessage(this.language.tips[0]);
    
                return;
            } else {
                if (v !== this.props.nickName) {
                    this.props.nickName = v;
                    changeWalletName(v);
                    popNewMessage(this.language.tips[2]);
                    this.props.canEditName = false;
                } else {
                    this.props.canEditName = false;
                }
            }
            
        } else {
            this.props.canEditName = true;
            
            setTimeout(() => {
                const input =  document.getElementById('nameInput').getElementsByTagName('input')[0];
                input.setSelectionRange(-1, -1);
                input.focus();
            }, 0);
            
        }
        this.paint(true);
    }
}

register('user/info', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

register('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});