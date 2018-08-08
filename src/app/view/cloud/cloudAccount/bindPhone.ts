/**
 * 云端账号首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { regPhone, sendCode } from '../../../store/conMgr';
import { dataCenter } from '../../../store/dataCenter';
import { formatBalanceValue, getLocalStorage, setLocalStorage } from '../../../utils/tools';

interface Props {
    ktBalance: number;
}
export class CloudAccount extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        this.state = {
            oldCode: 86,
            newCode: 886,
            isShowNewCode: false,
            countdown: 0,
            phone: '',
            code: '',
            limitTime: 60,
            phoneReg: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/
        };
        const t = getLocalStorage('lastGetSmsCodeTime');
        if (t) {
            const now = new Date().getTime();
            this.state.countdown = this.state.limitTime - Math.ceil((now - t) / 1000);
        }
        this.openTimer();
    }
    public backClick() {
        this.ok && this.ok();
    }
    /**
     * 获取验证码
     */
    public async getCode() {
        if (!this.state.phone || !(this.state.phoneReg.test(this.state.phone))) {
            popNew('app-components-message-message', { itype: 'warn', center: true, content: `请输入正确的手机号` });

            return;
        }
        await sendCode(this.state.phone, this.state.oldCode);
        setLocalStorage('lastGetSmsCodeTime', new Date().getTime());
        this.state.countdown = this.state.limitTime;
        this.paint();
    }
    /**
     * 点击确认
     */
    public async doSure() {
        if (!this.state.phone || !(this.state.phoneReg.test(this.state.phone))) {
            popNew('app-components-message-message', { itype: 'warn', center: true, content: `请输入正确的手机号` });

            return;
        }
        if (!this.state.code) {
            popNew('app-components-message-message', { itype: 'warn', center: true, content: `请输入正确的验证码` });

            return;
        }
        try {
            await regPhone(this.state.phone, this.state.code);
            this.ok();
        } catch (error) {
            console.log(error);
            if (error.type === -300) {
                popNew('app-components-message-message', { itype: 'error', center: true, content: `验证码无效，请重新获取` });
            } else if (error.type === -301) {
                popNew('app-components-message-message', { itype: 'error', center: true, content: `验证码无效，请重新获取` });
            } else {
                popNew('app-components-message-message', { itype: 'error', center: true, content: `错误${error.type}` });
            }
        }
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
    public chooseNewCode() {
        this.state.isShowNewCode = false;
        const t = this.state.oldCode;
        this.state.oldCode = this.state.newCode;
        this.state.newCode = t;
        this.paint();
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