/**
 * 云端绑定手机
 */
// =================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { regPhone } from '../../../net/pull';
import { setStore } from '../../../store/memstore';
import { getLanguage, getUserInfo } from '../../../utils/tools';
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
            isSuccess:true,
            cfgData:getLanguage(this)
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    
    /**
     * 输入完成后确认
     */
    public async doSure() {
        if (!this.state.phone) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips });
            this.state.code = [];
            this.setCode();

            return;
        }
        const data = await regPhone(this.state.phone, this.state.code.join(''));
        if (data && data.result === 1) {
            const userinfo = getUserInfo();
            userinfo.phoneNumber = this.state.phone;
            setStore('user/info',userinfo);
            this.ok();
        } else {
            this.state.isSuccess = false;
            this.state.code = [];
            this.setCode();
        }
    }

    /**
     * 手机号改变
     */
    public phoneChange(e: any) {
        this.state.phone = e.value;  
    }

    /**
     * 手动为验证码输入框赋值
     */
    public setCode() {
        for (const i in [1,2,3,4]) {
            // tslint:disable-next-line:prefer-template
            (<any>document.getElementById('codeInput' + i)).value = this.state.code[i];
        }
    }

    /**
     * 验证码改变
     */
    public codeChange(e: any) {
        const v = Number(e.key) ? e.key :e.currentTarget.value.slice(-1);
        // const v = e.currentTarget.value.slice(-1);
        if (e.key === 'Backspace') {
            this.state.code.pop();
            const ind = this.state.code.length;
            if (ind >= 0) {
            // tslint:disable-next-line:prefer-template
                document.getElementById('codeInput' + ind).focus();
            }
            this.setCode();
            
        } else if (this.integerJudge(v)) {
            this.state.code.push(v);
            const ind = this.state.code.length;
            // tslint:disable-next-line:prefer-template
            document.getElementById('codeInput' + (ind - 1)).blur();
            if (ind < 4) {
            // tslint:disable-next-line:prefer-template
                document.getElementById('codeInput' + ind).focus();
            }
        }
        console.log(v,this.state.code.length);
        this.paint();
        
        setTimeout(() => {
            if (this.state.code.length === 4) {
                this.doSure();
            }
        }, 100);
    }

    /**
     * 验证码输入框聚焦
     */
    public codeFocus() {
        const ind = this.state.code.length; 
        // tslint:disable-next-line:prefer-template
        document.getElementById('codeInput' + ind).focus();
        this.paint();
    }

    /**
     * 判断是否是整数
     */
    public integerJudge(num:string) {
        const reg = /^[0-9]$/;
        
        return reg.test(num);
    }

}