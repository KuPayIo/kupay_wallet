/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { deleteAccount, getAllAccount } from '../../../store/memstore';
import { getLanguage, loginSuccess, popNewLoading, popNewMessage } from '../../../utils/tools';
import { VerifyIdentidy, VerifyIdentidy1 } from '../../../utils/walletTools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class CreateEnter extends Widget {
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
        this.state = {
            cfgData:getLanguage(this),
            login:false,
            accountList,
            selectedAccountIndex:0,
            psw:'',
            showMoreUser:false,
            popHeight:this.calPopBoxHeight(accountList.length)
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
        this.state.showMoreUser = false;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public createByImgClick() {
        popNew('app-view-wallet-create-createWalletByImage');
    }
    public walletImportClicke() {
        popNew('app-view-wallet-import-home');
    }
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
            popNewMessage('密码不能为空');

            return;
        }
        const walletList = getAllAccount();
        const close = popNewLoading('登录中');
        const account = walletList[this.state.selectedAccountIndex];
        console.log(this.state.psw);
        const verify = await VerifyIdentidy1(this.state.psw,account.wallet.vault,account.user.salt);

        close.callback(close.widget);
        if (!verify) {
            popNewMessage('密码错误');

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
