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

import { getLang } from '../../../pi/util/lang';
import { logoutAccountDel } from '../../utils/tools';

interface Props {
    title:string;
    content:string[];
    sureText?:string;
    cancelText?:string;
    placeholder?:boolean;
    itype?:string;
    lockScreen?:boolean; // 解锁屏幕失败，验证身份进入该页面
}
export class ModalBoxInput extends Widget {
    public props: any;
    public language:any;
    public ok: (value:string) => void;
    public cancel: (fg:boolean) => void;   // fg为true表示退出APP(或点击取消)，false表示忘记密码删除钱包

    public setProps(props:any,oldProps:any) {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        this.props = { 
            ...this.props,
            currentValue:''
        };
    }
    /**
     * 点击取消按钮
     */
    public cancelBtnClick() {
        this.cancel && this.cancel(true);
    }
    /**
     * 点击确认按钮
     */
    public okBtnClick() {
        this.ok && this.ok(this.props.currentValue);
    }
    /**
     * 忘记密码
     */
    public foegetPsw() {
        this.cancel && this.cancel(false);
        popNew('app-components1-modalBox-modalBox',this.language.modalBox,() => {  // 确认删除钱包
            logoutAccountDel();
        },() => {   // 取消删除钱包
            if (this.props.lockScreen) {
                popNew('app-components1-modalBoxInput-modalBoxInput',this.props);
            }
        });      
    }
    /**
     * 输入框变化
     */
    public change(e:any) {
        this.props.currentValue = e.value;
        this.paint();
    }
}