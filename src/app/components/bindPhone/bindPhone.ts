/**
 * 绑定手机号组件
 * 外部监听 ev-getCode 事件发起获取验证码的请求
 * event.phone获取数据
 */

// =================================================导入
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { sendCode } from '../../net/pull';
import { register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class BindPhone extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }
    public create(): void {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            oldCode: 86,
            codeList: ['86','886'],
            isShowNewCode: false,
            countdown: 0,
            phone: '',
            limitTime: 60
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
        this.inputBlur;
        if (!this.state.phone || !this.phoneJudge()) {
            popNew('app-components1-message-message', { content: this.language.tips });

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
        this.state.oldCode = Number(this.state.codeList[ind]);
        this.paint();
    }

    /**
     * 电话号码改变
     */
    public phoneChange(e: any) {
        this.state.phone = e.value.toString();
    }

    /**
     * 判断手机号是否符合规则
     */
    public phoneJudge() {
        const reg1 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
        const reg2 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;        
        if (this.state.oldCode === 86) {
            return reg1.test(this.state.phone);
        } else {
            return reg2.test(this.state.phone);
        }
    }

    /**
     * 输入框取消聚焦
     */
    public inputBlur() {
        const inputs: any = document.getElementsByTagName('input');
        for (let i = 0;i < inputs.length;i++) {
            inputs[i].blur();
        }
    }

    /**
     * 开启倒计时
     */
    private openTimer() {
        setTimeout(() => {
            this.openTimer();
            if (this.state.countdown <= 0) return;
            this.state.countdown--;
            this.paint();
        }, 1000);
    }

}
