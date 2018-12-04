/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { loginSuccess } from '../../../net/pull';
import { deleteAccount, getAllAccount } from '../../../store/memstore';
import { popNewLoading, popNewMessage } from '../../../utils/tools';
import { VerifyIdentidy1 } from '../../../utils/walletTools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class CreateEnter extends Widget {
    public ok: () => void;
    public language:any;

    public create() {
        super.create();
        this.init();
        
    }
    public init() {
        this.language = this.config.value[getLang()];
        const walletList = getAllAccount();
        const accountList = [];
        walletList.forEach(item => {
            const nickName = item.user.info.nickName;
            const id = item.user.id;
            accountList.push({ nickName,id });
        });
        this.state = {
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
        this.state.showMoreUser = false;
        this.paint();
    }
    public delUserAccount(e:any,index:number) {
        const delAccount = this.state.accountList.splice(index,1)[0];
        deleteAccount(delAccount.id);
        if (getAllAccount().length <= 0) {
            this.state.login = false;
        } else {
            this.state.popHeight = this.calPopBoxHeight(this.state.accountList.length);
            if (index === this.state.selectedAccountIndex) {
                this.state.selectedAccountIndex = 0;
            }
        }
        this.paint();
    }
    
    public chooseCurUser(e:any,index:number) {
        this.state.selectedAccountIndex = index;
        this.closePopBox();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    // 图片创建
    public createByImgClick() {
        popNew('app-view-wallet-create-createWalletByImage');
    }
    // 已有账户
    public walletImportClicke() {
        this.state.forceCloseMoreUser = true;
        this.paint();
        popNew('app-view-wallet-import-home');
        
    }
    // 普通创建
    public createStandardClick() {
        popNew('app-view-wallet-create-createWallet');
    }
    public switch2LoginClick() {
        this.state.login = true;
        this.paint();
    }
    public switch2CreateClick() {
        this.state.login = false;
        this.paint();
    }

    public pswChange(e:any) {
        this.state.psw = e.value;
    }
    public async loginClick() {
        if (this.state.psw.length <= 0) {
            popNewMessage({ zh_Hans:'密码不能为空',zh_Hant:'密碼不能為空',en:'' });

            return;
        }
        const walletList = getAllAccount();
        const close = popNewLoading({ zh_Hans:'登录中',zh_Hant:'登錄中',en:'' });
        const account = walletList[this.state.selectedAccountIndex];
        console.log(this.state.psw);
        const verify = await VerifyIdentidy1(this.state.psw,account.wallet.vault,account.user.salt);

        close.callback(close.widget);
        if (!verify) {
            popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });

            return;
        }
        loginSuccess(account);
        this.ok && this.ok();
    }

    public popMoreUser() {
        this.state.showMoreUser = !this.state.showMoreUser;
        this.paint();
    }
}
