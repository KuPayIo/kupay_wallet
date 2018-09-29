/**
 * 绑定手机号组件
 * 外部监听 ev-getCode 事件发起获取验证码的请求
 * event.phone获取数据
 */

// =================================================导入
import { popNew } from '../../../pi/ui/root';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { sendCode } from '../../net/pull';
import { getLanguage } from '../../utils/tools';
// =================================================导出
export class BindPhone extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create(): void {
        super.create();
        this.state = {
            oldCode: 86,
            codeList: ['86','886'],
            isShowNewCode: false,
            countdown: 0,
            phone: '',
            limitTime: 60,
            phoneReg: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/,
            cfgData:getLanguage(this)
        };
        // const t = find('lastGetSmsCodeTime'); // 不保留获取验证码倒计时
        // if (t) {
        //     const now = new Date().getTime();
        //     this.state.countdown = this.state.limitTime - Math.ceil((now - t) / 1000);
        // }
        this.openTimer();
    }
    public backClick() {
        this.ok && this.ok();
    }
    /**
     * 获取验证码
     */
    public async getCode(event:any) {
        if (!this.state.phone || !(this.state.phoneReg.test(this.state.phone))) {
            popNew('app-components-message-message', { content: this.state.cfgData.tips });

            return;
        }
        await sendCode(this.state.phone, this.state.oldCode);
        // updateStore('lastGetSmsCodeTime', new Date().getTime());
        notify(event.node,'ev-getCode',{ value:this.state.phone });
        this.state.countdown = this.state.limitTime;
        this.paint();
    }
    /**
     * 显示新的区号
     */
    public showNewCode() {
        this.state.isShowNewCode = true;
        this.paint();
    }
    /**
     * 选择新的区号
     */
    public chooseNewCode(ind:number) {
        this.state.isShowNewCode = false;
        this.state.oldCode = this.state.codeList[ind];
        this.paint();
    }

    /**
     * 电话号码改变
     */
    public phoneChange(e: any) {
        this.state.phone = e.value;
    }

    private openTimer() {
        setTimeout(() => {
            this.openTimer();
            if (this.state.countdown <= 0) return;
            this.state.countdown--;
            this.paint();
        }, 1000);
    }

}