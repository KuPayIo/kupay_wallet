/**
 * change password step three
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { walletPswAvailable } from '../../../utils/account';

export class ChangePasswordStep2 extends Widget {
    public ok:() => void;
    constructor() {
        super();
        this.init();
    }
    public init() {
        this.state = {
            style:{
                backgroundColor:'#f8f8f8',
                fontSize: '24px',
                color: '#8E96AB',
                lineHeight:'33px'
            },
            inputValue:''
        };
        
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public btnClick() {
        if (!walletPswAvailable(this.state.inputValue)) {
            popNew('app-components-message-message', { type: 'error', content: '密码格式错误',center:true });

            return;
        }
        popNew('app-view-mine-changePassword-changePassword3',{ psw:this.state.inputValue });
        this.ok && this.ok();
    }

    public inputChange(e:any) {
        this.state.inputValue = e.value;
    }

}