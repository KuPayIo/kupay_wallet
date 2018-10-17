/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage, popNewLoading, popNewMessage, loginSuccess } from '../../../utils/tools';
import { find } from '../../../store/store';
import { VerifyIdentidy } from '../../../utils/walletTools';
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
    public init(){
        const walletList = find('walletList');
        const accountList = [];
        walletList.forEach(item=>{
            const nickName = JSON.parse(item.gwlt).nickName;
            accountList.push({nickName});
        });
        console.log(accountList);
        this.state = {
            walletList,
            cfgData:getLanguage(this),
            login:false,
            accountList,
            selectedAccountIndex:0,
            psw:""
        };
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
    public switch2LoginClick(){
        this.state.login = true;
        this.paint();
    }
    public switch2CreateClick(){
        this.state.login = false;
        this.paint();
    }

    public pswChange(e){
        this.state.psw = e.value;
    }
    public async loginClick(){
        if(this.state.psw.length <= 0){
            popNewMessage('密码不能为空');
            return;
        }
        const close = popNewLoading('登录中');
        const wallet = this.state.walletList[this.state.selectedAccountIndex];
        console.log(this.state.psw);
        const verify = await VerifyIdentidy(wallet,this.state.psw);

        close.callback(close.widget);
        if(!verify){
            popNewMessage('密码错误');
            return;
        }
        loginSuccess(wallet);
        this.ok && this.ok();
    }
}
