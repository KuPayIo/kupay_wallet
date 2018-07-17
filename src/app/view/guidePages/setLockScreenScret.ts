import { Widget } from '../../../pi/widget/widget';
import { popNew } from '../../../pi/ui/root';

export class PrivacyAgreement extends Widget {
    public ok: () => void;
    constructor() {
        super();
       
    }

    public create(){
        super.create();
        this.init();
    }

    public init(){
        this.state = {
            passwordScreenTitle:"为了保护您的资产安全请设置锁屏密码",
            lockScreenPsw:""
        };
        
    }

    public completedInput(r){
        const psw = r.psw;
        if(this.state.lockScreenPsw.length > 0){
            if(this.state.lockScreenPsw === psw){
                popNew('app-components-message-message', { itype: 'success', content: '设置成功',  center: true });
                this.ok && this.ok();
                popNew('app-view-wallet-backupWallet-backupWallet');
            }else{
                popNew('app-components-message-message', { itype: 'error', content: '两次密码输入不一致，请重新输入',  center: true });
                this.state.lockScreenPsw = "";
                this.state.passwordScreenTitle = "为了保护您的资产安全请设置锁屏密码";
                this.paint();
            }
        }else{
            this.state.lockScreenPsw = psw;
            this.state.passwordScreenTitle = "请重复";
            this.paint();
        }
        
    }
}