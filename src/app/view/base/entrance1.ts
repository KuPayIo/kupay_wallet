/**
 * create a wallet
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { uploadFileUrlPrefix } from '../../config';
import { CreateWalletType, Option, touristLogin } from '../../logic/localWallet';
import { getModulConfig } from '../../modulConfig';
import { loginSuccess } from '../../net/login';
import { deleteAccount, getAllAccount } from '../../store/memstore';
import { getLoginMod, getWalletToolsMod } from '../../utils/commonjsTools';
import { defaultPassword } from '../../utils/constants';
import { playerName, popNew3, popNewLoading, popNewMessage } from '../../utils/tools';

// ============================导出
export class Entrance1 extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        this.init();
    }
    public init() {
        const walletList = getAllAccount();
        const accountList = [];
        walletList.forEach(item => {
            const nickName = item.user.info.nickName;
            const avatar = item.user.info.avatar ? `${uploadFileUrlPrefix}${item.user.info.avatar}` : 'app/res/image1/default_avatar.png';
            const id = item.user.id;
            accountList.push({ nickName,avatar,id });
        });
        this.props = {
            loginImg:getModulConfig('LOGIN_IMG'),
            login:false,
            accountList,
            selectedAccountIndex:0,
            psw:'',
            showMoreUser:false,
            popHeight:this.calPopBoxHeight(accountList.length),
            forceCloseMoreUser:false
        };
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
    public delUserAccount(e:any,index:number) {
        const delAccount = this.props.accountList.splice(index,1)[0];
        deleteAccount(delAccount.id);
        if (getAllAccount().length > 0) {
            this.props.popHeight = this.calPopBoxHeight(this.props.accountList.length);
            if (index === this.props.selectedAccountIndex) {
                this.props.selectedAccountIndex = 0;
            }
        } else {
            this.ok && this.ok();
            popNew('app-view-base-entrance');
        }
        this.paint();
    }
    
    public chooseCurUser(e:any,index:number) {
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
        const walletList = getAllAccount();
        const close = popNewLoading({ zh_Hans:'登录中',zh_Hant:'登錄中',en:'' });
        const account = walletList[this.props.selectedAccountIndex];
        const walletToolsMod = await getWalletToolsMod();
        const secretHash = await walletToolsMod.VerifyIdentidy1(this.props.psw,account.wallet.vault,account.user.salt);

        close.callback(close.widget);
        if (!secretHash) {
            popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });

            return;
        }
        loginSuccess(account,secretHash);
        this.ok && this.ok();
    }

    public popMoreUser() {
        this.props.showMoreUser = !this.props.showMoreUser;
        this.paint();
    }

    // 注册登录 
    public registerLoginClick() {
        console.log('注册登录');
        popNew3('app-view-wallet-create-createWallet',{ itype:CreateWalletType.Random },() => {
            this.ok && this.ok();
        });
    }
    // 已有账户登录
    public haveAccountClick() {
        console.log('已有账户登录');
        popNew3('app-view-wallet-import-standardImport',{},() => {
            this.ok && this.ok();
        });
    }

    // 手机登录
    public phoneLoginClick() {
        popNew3('app-view-wallet-import-phoneImport',{},() => {
            this.ok && this.ok();
        });
    }

    // 游客登录
    public async touristLoginClick() {
        const option:Option = {
            psw: defaultPassword,
            nickName: await playerName()
        };
        touristLogin(option).then((secrectHash:string) => {
            if (!secrectHash) {
                popNewMessage('登录失败');

                return;
            }
            getLoginMod().then(mod => {
                mod.openConnect(secrectHash);
            });
            
            this.ok && this.ok();
            popNewMessage('登录成功');
        });
        console.log('游客登录');
    }
}
