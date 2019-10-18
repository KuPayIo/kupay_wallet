/**
 * 绑定手机号组件
 * 外部监听 ev-getCode 事件发起获取验证码的请求
 * event.phone获取数据
 */

// =================================================导入
import { getLang } from '../../../pi/util/lang';
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { sendCode } from '../../net/pull';
import { popNewMessage } from '../../utils/pureUtils';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class BindPhone extends Widget {
    public ok: () => void;
    public timer:number;
    constructor() {
        super();
    }
    public setProps(props:any,oldProps:any): void {
        const phone = props.phone ? props.phone : '';
        this.props = {
            ...props,
            oldCode: '86',
            codeList: ['86','886'],
            isShowNewCode: false,
            countdown: 0,
            phone,
            limitTime: 60
        };
        super.setProps(this.props,oldProps);
    }
    public backClick() {
        this.ok && this.ok();
    }
    /**
     * 获取验证码
     */
    public async getCode(event:any) {
        this.inputBlur();
        if (!this.props.phone || !this.phoneJudge()) {
            const tips = { zh_Hans:'无效的手机号',zh_Hant:'無效的手機號',en:'' };
            popNewMessage(tips[getLang()]);

            return;
        }
        const res = await sendCode(this.props.phone, this.props.oldCode,this.props.verify);
        notify(event.node,'ev-getCode',{ value:this.props.phone,areaCode:this.props.oldCode,hasSendCode:true });
        this.props.countdown = this.props.limitTime;
        clearTimeout(this.timer);
        this.openTimer();
        this.paint();
    }
    /**
     * 显示新的区号
     */
    public showNewCode() {
        this.props.isShowNewCode = true;
        this.paint();
    }
    /**
     * 选择新的区号
     */
    public chooseNewCode(ind:number) {
        this.props.isShowNewCode = false;
        this.props.oldCode = this.props.codeList[ind];
        this.paint();
    }

    /**
     * 电话号码改变
     */
    public phoneChange(e: any) {
        this.props.phone = e.value.toString();
    }

    /**
     * 判断手机号是否符合规则
     */
    public phoneJudge() {
        const reg1 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
        const reg2 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;        
        if (this.props.oldCode === 86) {
            return reg1.test(this.props.phone);
        } else {
            return reg2.test(this.props.phone);
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
        this.timer = setTimeout(() => {
            if (this.props.countdown <= 0) return;
            this.openTimer();
            this.props.countdown--;
            this.paint();
        }, 1000);
    }

}
