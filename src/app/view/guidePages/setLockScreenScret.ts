/**
 * set lock-screen psw
 */
import { Widget } from '../../../pi/widget/widget';
import { popNew } from '../../../pi/ui/root';
import { sha256,setLocalStorage } from '../../utils/tools';
import { lockScreenSalt } from '../../utils/constants';


export class SetLockScreenScret extends Widget {
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
            passwordScreenTitle:`为了保护您的资产安全
请设置锁屏密码`,
            lockScreenPsw:""
        };
        
    }

    public completedInput(r){
        const psw = r.psw;
        if(this.state.lockScreenPsw.length > 0){
            if(this.state.lockScreenPsw === psw){
                const close = popNew('pi-components-loading-loading', { text: '验证中...' });
                setTimeout(()=>{
                    close.callback(close.widget);
                    const hash256 = sha256(psw + lockScreenSalt);
                    setLocalStorage("lockScreenPsw",hash256);
                    popNew('app-components-message-message', { itype: 'success', content: '设置成功',  center: true });
                    popNew('app-view-app');
                    this.ok && this.ok();
                },1000);
                
            }else{
                setTimeout(()=>{
                    popNew('app-components-message-message', { itype: 'error', content: '两次密码输入不一致，请重新输入',  center: true });
                    this.init();
                    this.paint();
                },200);
            }
        }else{
            setTimeout(()=>{
                this.state.lockScreenPsw = psw;
                this.state.passwordScreenTitle = "请重复";
                this.paint();
            },200);
        }
        
    }
}


