/**
 * create a wallet
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../modulConfig';
import { loginSuccess } from '../../net/login';
import { deleteAccount, getAllAccount } from '../../store/memstore';
import { getWalletToolsMod } from '../../utils/commonjsTools';
import { popNewLoading, popNewMessage } from '../../utils/tools';

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
            const id = item.user.id;
            accountList.push({ nickName,id });
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
        }
        this.paint();
    }
    
    public chooseCurUser(e:any,index:number) {
        this.props.selectedAccountIndex = index;
        this.closePopBox();
    }
    // 注册新账户
    public registerNewClick() {
        this.ok && this.ok();
        popNew('app-view-base-entrance');
        
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
        const verify = await walletToolsMod.VerifyIdentidy1(this.props.psw,account.wallet.vault,account.user.salt);

        close.callback(close.widget);
        if (!verify) {
            popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });

            return;
        }
        loginSuccess(account);
        this.ok && this.ok();
    }

    public popMoreUser() {
        this.props.showMoreUser = !this.props.showMoreUser;
        this.paint();
    }
}
