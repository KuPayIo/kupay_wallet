/**
 * 云端绑定手机
 */
// =================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { regPhone, sendCode } from '../../../net/pull';
// =================================================导出
export class BindPhone extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.state = {
            phone:'',
            code:[],
            phoneReg: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/,
            isSuccess:true,
            inputDefault:{ itype:'number',style:'font-size:64px;color:#368FE5;text-align:center;' }
        };
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
        if (!this.state.code.join('')) {
            popNew('app-components-message-message', { content: `请输入正确的验证码` });

            return;
        }
        await regPhone(this.state.phone, this.state.code.join(''));
        this.state.isSuccess = false;
        this.ok();
    }

    /**
     * 手机号改变
     */
    public async phoneChange(e: any) {
        this.state.phone = e.value;    
    }

    /**
     * 验证码改变
     */
    public codeChange(e: any) {
        if (e.value) {
            this.state.code.push(e.value);
            const ind = this.state.code.length;
            // tslint:disable-next-line:prefer-template
            document.getElementById('codeInput' + (ind - 1)).getElementsByTagName('input')[0].blur();
            if (ind < 4) {
                // tslint:disable-next-line:prefer-template
                document.getElementById('codeInput' + ind).getElementsByTagName('input')[0].focus();
            }
        } else {
            // this.state.code.pop();
            // const ind = this.state.code.length;
            // // tslint:disable-next-line:prefer-template
            // document.getElementById('codeInput' + ind).getElementsByTagName('input')[0].blur();
            // if (ind > 0) {
            //     // tslint:disable-next-line:prefer-template
            //     document.getElementById('codeInput' + (ind - 1)).getElementsByTagName('input')[0].focus();
            // }
        }
        
        if (this.state.code.length === 4) {
            this.doSure();
        }
        this.paint();
    }

    /**
     * 验证码输入框聚焦
     */
    public codeFocus() {
        const ind = this.state.code.length < 4 ? this.state.code.length :3;
        // tslint:disable-next-line:prefer-template
        document.getElementById('codeInput' + ind).getElementsByTagName('input')[0].focus();
        this.paint();
    }

}