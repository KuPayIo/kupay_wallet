/**
 * 输入框的逻辑处理
 * {input:"",placehold:"",disabled:false,clearable:false,itype:"text",style:"",autofacus:false,maxLength:1}
 * input?: 初始内容
 * placeHolder?: 提示文字
 * disabled?: 是否禁用
 * clearable?: 是否可清空
 * itype?: 输入框类型 text number password integer moneyNum1 moneyNum2
 * style?: 样式
 * autofocus?: 是否自动获取焦点
 * maxLength?: 输入最大长度，仅对text和password类型输入有效
 * 外部可监听 ev-input-change，ev-input-blur，ev-input-focus，ev-input-clear事件
 */
import { getLang } from '../../../pi/util/lang';
import { notify } from '../../../pi/widget/event';
import { getRealNode, paintCmd3, paintWidget } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { filterEomoji, popNewMessage } from '../../utils/tools';

interface Props {
    input?: string;
    placeHolder?: string;
    disabled?: boolean;
    clearable?: boolean;
    itype?: string;
    style?: string;
    autofocus?: boolean;
    maxLength?: number;
    notUnderLine?: boolean;
}

export class Input extends Widget {
    public props: any;

    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        if (this.props.placeHolder) {
            this.props.placeHolder = this.props.placeHolder[getLang()];
        }

        let currentValue = '';
        if (props.input) {
            currentValue = props.input;
        }
        this.props = {
            ...this.props,
            itype: props.itype || 'text',
            originalType: this.switchItype(props.itype),  // input原始type
            currentValue,
            focused: false,
            showClear: false,
            inputLock: false,
            showClearType:true
        };
        console.log('input props',this.props);
    }
    /**
     * 绘制方法
     * @param reset 表示新旧数据差异很大，不做差异计算，直接生成dom
     */
    public paint(reset?: boolean): void {
        if (!this.tree) {
            super.paint(reset);
        }
        if (!this.props) {
            this.props = {};
        }
        paintCmd3(this.getInput(), 'readOnly', this.props.disabled || false);
        (<any>this.getInput()).value = this.props.currentValue;
        paintWidget(this, reset);
    }
    /**
     * 添加到dom树后调用，在渲染循环内调用
     */
    public attach(): void {
        this.props.autofocus && this.getInput().focus();
    }
    /**
     * 获取真实输入框dom
     */
    public getInput() {
        return getRealNode((<any>this.tree).children[0]);
    }

    /**
     * 用户开始进行非直接输入(中文输入)的时候触发，而在非直接输入结束。
     */
    public compositionstart() {
        if (this.props.itype === 'text') {
            this.props.inputLock = true;
        }
    }

    /**
     * 用户输入完成,点击候选词或确认按钮时触发
     */
    public compositionend(e: any) {
        this.props.inputLock = false;
        this.change(e);
    }

    /**
     * 输入事件
     */
    // tslint:disable-next-line:cyclomatic-complexity
    public change(event: any) {
        if (this.props.inputLock) {
            return;
        }
        let currentValue:any = filterEomoji(event.currentTarget.value);
        // 最大长度限制
        if (this.props.maxLength) {
            currentValue = String(currentValue).slice(0, this.props.maxLength);
        }
        // 密码输入 时检验非法字符
        if (this.props.itype === 'password' && !this.availableJudge(currentValue) && currentValue.length > 0) {
            const disAvailable = { zh_Hans:'不支持的字符',zh_Hant:'不支持的字符',en:'' };
            popNewMessage(disAvailable[getLang()]);
            currentValue = currentValue.slice(0, currentValue.length - 1);
        }
        // 数字输入 时检验输入格式
        if (this.props.itype === 'number' && currentValue.length > 0) {
            currentValue = currentValue.replace(/[^\d\.]/g, '');
            if (!this.numberJudge(currentValue)) {
                currentValue = currentValue.slice(0, currentValue.length - 1);
            }
        }
        // 整数输入 时检验输入格式
        if (this.props.itype === 'integer' && currentValue.length > 0) {
            currentValue = Number(currentValue.replace(/[\D]/g, ''));
        }
        // 一位小数 时检验输入格式
        if (this.props.itype === 'moneyNum1' && currentValue.length > 0) {
            currentValue = currentValue.replace(/[^\d\.]/g, '');
            if (!this.numberJudge(currentValue)) {
                currentValue = currentValue.slice(0, currentValue.length - 1);
            }
            const numAry = currentValue.split('.');
            if (numAry[1]) {
                numAry[1] = numAry[1].slice(0, 1);
                currentValue = numAry.join('.');
            }
        }
        // 两位小数 时检验输入格式
        if (this.props.itype === 'moneyNum2' && currentValue.length > 0) {
            currentValue = currentValue.replace(/[^\d\.]/g, '');
            if (!this.numberJudge(currentValue)) {
                currentValue = currentValue.slice(0, currentValue.length - 1);
            }
            const numAry = currentValue.split('.');
            if (numAry[1]) {
                numAry[1] = numAry[1].slice(0, 2);
                currentValue = numAry.join('.');
            }
        }
        this.props.currentValue = currentValue;
        this.props.showClear = this.props.clearable && !this.props.disabled && this.props.currentValue !== '' && this.props.focused;
        (<any>this.getInput()).value = currentValue;
        notify(event.node, 'ev-input-change', { value: this.props.currentValue });
        this.props.focused = true;
        this.paint();  
    }

    /**
     * 失焦事件
     */
    public onBlur(event: any) {
        this.props.focused = false;
        this.props.showClear = false;
        notify(event.node, 'ev-input-blur', { value: this.props.currentValue });
        this.paint();
    }

    /**
     * 聚焦事件
     */
    public onFocus(event: any) {
        this.props.focused = true;
        this.props.showClear = this.props.clearable && !this.props.disabled && this.props.currentValue !== '' && this.props.focused;
        notify(event.node, 'ev-input-focus', {});
        this.paint();
    }

    // 清空文本框
    public clearClickListener(event: any) {
        this.props.currentValue = '';
        this.props.showClear = false;
        (<any>this.getInput()).value = '';
        notify(event.node, 'ev-input-clear', {});
        this.paint();
    }

    public switchItype(key:string) {
        switch (key) {
            case 'text':
                return 'text';
                break;
            case 'password':
                return 'password';
                break;
            case 'number':
                return 'number';
                break;
            case 'integer':
                return 'number';
                break;
            case 'moneyNum1':
                return 'number';
                break;
            case 'moneyNum2':
                return 'number';
                break;
            default:
                return 'text';
        }
    }

    /**
     * 判断输入的密码是否符合规则
     */
    public availableJudge(psw: string) {
        const reg = /^[0-9a-zA-Z!"#$%&'()*+,\-./:;<=>?@\[\]^_`{\|}~]+$/;

        return reg.test(psw);
    }

    /**
     * 判断输入是否是正确的数字格式
     */
    public numberJudge(num: string) {
        const reg = /(^[1-9][0-9]*\.|^0\.)[0-9]*$/;
        const reg1 = /^([1-9][0-9]*|0)$/;

        return reg.test(num) || reg1.test(num);
    }

}
