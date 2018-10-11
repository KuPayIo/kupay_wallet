/**
 * 带输入框的模态框
 * {title:"提示",content:"温馨提示",sureText:"sure",cancelText:"cancel",placeholder:"",itype:"text"}
 * title：标题
 * content：内容数组，如果需要分行显示
 * sureText:确认按钮名称
 * cancelText：取消按钮名称
 * itype:输入数据类型，text，number，password
 * placeholder:输入框提示语
 * 外部监听 ev-sure，ev-forgetPsw 事件,event.value获取输入框中数据  
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getLanguage } from '../../utils/tools';

interface Props {
    title:string;
    content:string[];
    sureText?:string;
    cancelText?:string;
    placeholder?:boolean;
    itype?:string;
}
export class ModalBoxInput extends Widget {
    public props: Props;
    public ok: (value:string) => void;
    public cancel: () => void;

    public create() {
        super.create();
        this.state = { 
            currentValue:'',
            cfgData:getLanguage(this)
        };
    }
    /**
     * 点击取消按钮
     */
    public cancelBtnClick(e:any) {
        this.cancel && this.cancel();
    }
    /**
     * 点击确认按钮
     */
    public okBtnClick(e:any) {
        this.ok && this.ok(this.state.currentValue);
    }
    /**
     * 忘记密码
     */
    public foegetPsw(e:any) {
        // this.ok && this.ok();  
        // popNew('app-components-modalBox-modalBox');      
    }
    /**
     * 输入框变化
     */
    public change(e:any) {
        this.state.currentValue = e.value;
        this.paint();
    }
}