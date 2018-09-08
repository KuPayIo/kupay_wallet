/**
 * 云端绑定手机
 */
// =================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { regPhone } from '../../../net/pull';
// =================================================导出
export class BindPhone extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.state={
            phone:'',
            code:'',
            phoneReg: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/
        }
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    

    /**
     * 输入完成后确认
     */
    public async doSure() {
        if (!this.state.phone || !(this.state.phoneReg.test(this.state.phone))) {
            popNew('app-components-message-message', { content: `请输入正确的手机号` });

            return;
        }
        if (!this.state.code) {
            popNew('app-components-message-message', { content: `请输入正确的验证码` });

            return;
        }
        await regPhone(this.state.phone, this.state.code);
        this.ok();
    }

    /**
     * 电话号码改变
     */
    public phoneChange(e: any) {
        this.state.phone = e.value;
    }

    /**
     * 验证码改变
     */
    public codeChange(e: any) {
        this.state.code = e.value;
        if(e.value.length==6){
            this.doSure();
            document.getElementById("code").getElementsByTagName("input")[0].blur();   
        }
    }

}