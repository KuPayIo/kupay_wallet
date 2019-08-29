/**
 * account home
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../middleLayer/wrap';
import { uploadFile } from '../../../net/pull';
import { changeWalletName, getUserInfo, imgResize, popNewMessage, popPswBox, rippleShow, walletNameAvailable, changeWalletNote, deepCopy, changeWalletSex } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
import { exportMnemonic } from '../../../viewLogic/localWallet';
import { selectImage } from '../../../viewLogic/native';
import { logoutAccount } from '../../../viewLogic/login';
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

        this.props = {
            isTourist:false,
            avatar: '',
            nickName: '',
            phone: '',
            backup:false,
            canEditName: false,
            editName:'',
            chooseImage: false,
            avatarHtml: '',
            sex:2,
            note:''
        };
        Promise.all([getUserInfo(),getStoreData('wallet')]).then(([userInfo,wallet]) => {
            if (userInfo.phoneNumber) {
                const str = String(userInfo.phoneNumber).substr(3, 6);
                this.props.phone = userInfo.phoneNumber.replace(str, '******');
            }
            this.props.nickName = userInfo.nickName ? userInfo.nickName : this.language.defaultName;
            this.props.editName = this.props.nickName;
            this.props.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
            this.props.backup = wallet.isBackup;
            this.props.isTourist = !wallet.setPsw;
            this.props.sex = userInfo.sex;
            this.props.note = userInfo.note?userInfo.note:'';
            this.paint();
        });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
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
        const ret = await exportMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index', { ...ret });
        }

    }

    // 导出私钥
    public async exportPrivateKeyClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await exportMnemonic(psw,false);
        if (ret && ret.mnemonic) {
            popNew('app-view-mine-account-exportPrivateKey', { mnemonic:ret.mnemonic });
        }
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
        if (!this.props.phone) {  // 绑定
            popNew('app-view-mine-setting-phone');
        } else { // 重新绑定
            popNew('app-view-mine-setting-unbindPhone');
        }
        
    }

    /**
     * 修改密码
     */
    public changePsw() {
        if (this.props.isTourist) {
            popNew('app-view-mine-setting-settingPsw',{});
        } else {
            popNew('app-view-mine-setting-changePsw');
        }
        
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

    /**
     * 修改名称
    */
    public changeName(){
        popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改昵称', contentInput:this.props.nickName,maxLength:10 },(res:any) => {
            changeWalletName(res.content);
            this.props.nickName=res.content;
            popNewMessage('修改昵称成功');
            this.paint();
        });
    }

    /**修改个性签名 */
    public changeSignature(){
        popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改个性签名', contentInput:this.props.note,maxLength:100 },(res:any) => {
            changeWalletNote(res.content);
            this.props.note=res.content;
            popNewMessage('修改个性签名成功');
            this.paint();
        });
    }

    /**
     * 退出账户不删除信息
     */
    public async logOut() {
        const wallet = await getStoreData('wallet');
        const setPsw = wallet.setPsw;
        const modalBox2 = deepCopy(this.language.modalBox2);
        if (!setPsw) {
            modalBox2.sureText = this.language.modalBox2.sureText1;
        }
        popNew('app-components-modalBox-modalBox', modalBox2 , () => {  
            if (!setPsw) {
                this.ok && this.ok();
            } else {
                this.backUp();
            }
            
            console.log('取消1');
        }, () => {
            console.log(1);
            logoutAccount().then(() => {
                this.backPrePage();
            });
            
        }
        );
    }

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await exportMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index', { ...ret });
            this.ok && this.ok();
        }
    }

    /**
     * 注销账户
     */
    public async logOutDel() {
        const setPsw = await getStoreData('wallet/setPsw');
        const modalBox3 = deepCopy(this.language.modalBox3);
        if (!setPsw) {
            modalBox3.sureText = this.language.modalBox3.sureText1;
        }
        popNew('app-components-modalBox-modalBox', modalBox3 , () => {
            if (!setPsw) {
                this.ok && this.ok();
            } else {
                this.backUp();
            }
            console.log('取消2');
        }, () => {
            popNew('app-components-modalBox-modalBox', { title: '', content: this.language.tips[2], style: 'color:#F7931A;' }, () => {
                logoutAccount(true).then(() => {
                    this.backPrePage();
                });
                
            });
        });
    }

    /** 选择性别 */
    public changeSex(){
        popNew('app-components1-checkSex-checkSex', { title:"选择性别",active:this.props.sex}, (r: any) => {
            changeWalletSex(r);
            this.props.sex=r;
            popNewMessage('修改性别成功');
            this.paint();
        });
    }
}

registerStoreData('user/info', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

registerStoreData('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

registerStoreData('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});