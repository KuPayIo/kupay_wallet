/**
 * 钱包自应用支付的模态框
 * 外部监听 ev-sure，ev-forgetPsw 事件,event.value获取输入框中数据  
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    fee_total : number,
    desc : string,
    fee_name : string,
    balance : number
}
export class ModalBoxInput extends Widget {
    public props: any;
    public ok: (value:string) => void;
    public cancel: (fg:boolean) => void;   // fg为true表示退出APP(或点击取消)，false表示忘记密码删除钱包

    public setProps(props:Props) {
        
        super.setProps(props);
        this.props = { 
            ...this.props,
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
        const value = document.getElementById('pi_password').value;
        if(value!==''){
            this.ok && this.ok(value);
        }
    }
}