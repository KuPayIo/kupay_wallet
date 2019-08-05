/**
 * create a wallet
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { defaultPassword } from '../../config';
import { callDeleteAccount, callLoginSuccess,callVerifyIdentidy1, openWSConnect } from '../../middleLayer/wrap';
import { uploadFileUrlPrefix } from '../../publicLib/config';
import { CreateWalletOption } from '../../publicLib/interface';
import { getModulConfig } from '../../publicLib/modulConfig';
import { playerName, popNew3, popNewLoading, popNewMessage } from '../../utils/tools';
import { CreateWalletType, touristLogin } from '../../viewLogic/localWallet';

// ============================导出
export class Entrance1 extends Widget {
    // 
    public ok: () => void;
    public setProps(props:any) {
        const accounts = props.accounts;
        const accountList = [];
        accounts.forEach(item => {
            const nickName = item.user.info.nickName;
                // tslint:disable-next-line:max-line-length
            const avatar = item.user.info.avatar ? `${uploadFileUrlPrefix}${item.user.info.avatar}` : 'app/res/image1/default_avatar.png';
            const id = item.user.id;
            accountList.push({ nickName,avatar,id });
        });

        const popHeight = this.calPopBoxHeight(accountList.length);

        this.props = {
            ...props,
            loginImg:getModulConfig('LOGIN_IMG'),
            login:false,
            accountList,
            selectedAccountIndex:0,
            psw:'',
            showMoreUser:false,
            popHeight,
            forceCloseMoreUser:false,
            noAnimate:false
        };
        super.setProps(this.props);
        
    }
    public calPopBoxHeight(len:number) {
        const itemNum = 4;
        const oneHeight = 101;
        let totalHeight = itemNum * oneHeight;
        
        if (len <= itemNum) {
            totalHeight = len * oneHeight;
        }

        return totalHeight;
    }
    public closePopBox() {
        this.props.showMoreUser = false;
        this.paint();
    }
    public closePopBoxNoAnimate() {
        this.props.showMoreUser = false;
        this.props.noAnimate = true;
        this.paint();
    }
    public delUserAccount(e:any,index:number) {
        const delAccount = this.props.accountList.splice(index,1)[0];
        this.props.accounts = this.props.accounts.filter(account => {
            return account.user.id !== delAccount.id;
        });
        if (this.props.accounts.length > 0) {
            this.props.popHeight = this.calPopBoxHeight(this.props.accountList.length);
            if (index === this.props.selectedAccountIndex) {
                this.props.selectedAccountIndex = 0;
            }
        } else {
            this.ok && this.ok();
            popNew('app-view-base-entrance');
        }
        this.paint();
        callDeleteAccount(delAccount.id);
        
    }
    
    public chooseCurUser(e:any,index:number) {
        if (this.props.selectedAccountIndex !== index) this.props.psw = '';
        this.props.selectedAccountIndex = index;
        this.closePopBox();
    }

    public pswChange(e:any) {
        this.props.psw = e.value;
    }
    public async loginClick() {
        if (this.props.psw.length <= 0) {
            popNewMessage({ zh_Hans:'密码不能为空',zh_Hant:'密碼不能為空',en:'' });

            return;
        }
        const walletList = this.props.accounts;
        const close = popNewLoading({ zh_Hans:'登录中',zh_Hant:'登錄中',en:'' });
        const account = walletList[this.props.selectedAccountIndex];
        const secretHash = await callVerifyIdentidy1(this.props.psw,account.wallet.vault,account.user.salt);

        close.callback(close.widget);
        if (!secretHash) {
            popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });

            return;
        }
        await callLoginSuccess(account,secretHash);
        this.ok && this.ok();
    }

    public popMoreUser() {
        this.props.showMoreUser = !this.props.showMoreUser;
        this.paint();
    }

    // 注册登录 
    public registerLoginClick() {
        this.closePopBoxNoAnimate();
        console.log('注册登录');
        popNew3('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Random },() => {
            this.ok && this.ok();
        },() => {
            this.props.noAnimate = false;
            this.paint();
        });
    }
    // 已有账户登录
    public haveAccountClick() {
        this.closePopBoxNoAnimate();
        console.log('已有账户登录');
        popNew3('app-view-wallet-import-standardImport',{},() => {
            this.ok && this.ok();
        },() => {
            this.props.noAnimate = false;
            this.paint();
        });
    }

    // 手机登录
    public phoneLoginClick() {
        this.closePopBoxNoAnimate();
        popNew3('app-view-wallet-import-phoneImport',{},() => {
            this.ok && this.ok();
        },() => {
            this.props.noAnimate = false;
            this.paint();
        });
    }

    // 游客登录
    public async touristLoginClick() {
        this.closePopBoxNoAnimate();
        const option:CreateWalletOption = {
            psw: defaultPassword,
            nickName: await playerName()
        };
        touristLogin(option).then((secrectHash:string) => {
            if (!secrectHash) {
                popNewMessage('登录失败');

                return;
            }
            openWSConnect(secrectHash);
            
            this.ok && this.ok();
            popNewMessage('登录成功');
        });
        console.log('游客登录');
    }
}
