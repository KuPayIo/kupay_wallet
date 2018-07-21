/**
 * set lock-screen psw
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { lockScreenHash,setLocalStorage } from '../../utils/tools';

interface Props {
    title1?:string;
    title2?:string;
}
export class SetLockScreenScret extends Widget {
    public ok: () => void;
    public props:Props;
    constructor() {
        super();
       
    }
    public create() {
        super.create();
        this.init();
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        if (props.title1) {
            this.state.passwordScreenTitle = props.title1;
        }
    }
    
    public init() {
        this.state = {
            passwordScreenTitle:`为了保护您的资产安全 请设置锁屏密码`,
            lockScreenPsw:''
        };
        
    }

    public completedInput(r:any) {
        const psw = r.psw;
        if (this.state.lockScreenPsw.length > 0) {
            if (this.state.lockScreenPsw === psw) {
                const close = popNew('pi-components-loading-loading', { text: '验证中...' });
                setTimeout(() => {
                    close.callback(close.widget);
                    const hash256 = lockScreenHash(psw);
                    setLocalStorage('lockScreenPsw',hash256);
                    popNew('app-components-message-message', { itype: 'success', content: '设置成功',  center: true });
                    this.ok && this.ok();
                },1000);
                
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '两次密码输入不一致，请重新输入',  center: true });
                this.init();
                this.paint();
            }
        } else {
            this.state.lockScreenPsw = psw;
            this.state.passwordScreenTitle = (this.props && this.props.title2) || '请重复';
            this.paint();
        }
        
    }
}
