import { Widget } from '../../../pi/widget/widget';
import { popNewMessage } from '../../utils/tools';
interface Props {
    countdown:number;
    phoneNum:string;
    codeNum:string;
}
/**
 * 注册登录
 */
export class SignIn extends Widget {
    public props:Props;
    public create() {
        super.create();
        this.props = {
            countdown:0,
            phoneNum:'',
            codeNum:''
        };
    }

    public phoneChange(e:any) {
        this.props.phoneNum = e.value;
    }

    public codeChange(e:any) {
        this.props.codeNum = e.value;
    }

    public getCode() {
        const reg = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
        if (!this.props.phoneNum || !reg.test(this.props.phoneNum)) {
            popNewMessage('无效的手机号');
            
            return; 
        }
        this.props.countdown = 60;
        const timer = setInterval(() => {
            this.props.countdown--;
            this.paint();
            if (this.props.countdown === 0) {
                clearInterval(timer);
            }
        },1000);
       
    }
}