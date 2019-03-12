/**
 * 云端绑定手机
 */
// =================================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Option, phoneImport } from '../../../logic/localWallet';
import { getRandom, logoutAccountDel, openConnect } from '../../../net/login';
import { getDataCenter } from '../../../utils/commonjsTools';
import { defaultPassword } from '../../../utils/constants';
import { playerName, popNewLoading, popNewMessage } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class PhoneImport extends Widget {
    public cancel: () => void;
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }
    public setProps(props:any,oldProps:any) {
        this.language = this.config.value[getLang()];
        this.props = {
            ...props,
            phone:'',
            code:[],
            isSuccess:true
        };
        super.setProps(this.props,oldProps);
    }

    public backPrePage() {
        this.cancel && this.cancel();
    }
    
    public customerServiceClick() {
        popNew('app-view-wallet-import-customerService');
    }
    /**
     * 输入完成后确认
     */
    public async doSure() {
        if (!this.props.phone) {
            popNew('app-components1-message-message', { content: this.language.tips });
            this.props.code = [];
            this.setCode();

            return;
        }
        const option:Option = {
            psw:defaultPassword,
            nickName:await playerName()
        };
        openConnect();
        const close = popNewLoading('导入中');
        const secretHash = await phoneImport(option);
        if (!secretHash) {
            close.callback(close.widget);
            popNewMessage('导入失败');

            return;
        }
        const itype = await getRandom(secretHash,undefined,this.props.phone,this.props.code.join(''));
        close.callback(close.widget);
        if (itype === -301) {
            popNewMessage('验证码错误');
            logoutAccountDel();
            this.props.code = [];
            this.setCode();
        } else if (itype === 1017) {
            popNewMessage('手机号未绑定');
            logoutAccountDel();
            this.props.code = [];
            this.setCode();
        } else {
            popNewMessage('登录成功');
            this.ok && this.ok();
            // 刷新本地钱包
            getDataCenter().then(dataCenter => {
                dataCenter.refreshAllTx();
                dataCenter.initErc20GasLimit();
            });
            
        }
    }

    /**
     * 手机号改变
     */
    public phoneChange(e: any) {
        this.props.phone = e.value;  
    }

    /**
     * 手动为验证码输入框赋值
     */
    public setCode() {
        for (const i in [1,2,3,4]) {
            // tslint:disable-next-line:prefer-template
            (<any>document.getElementById('codeInput' + i)).value = this.props.code[i];
        }
    }

    /**
     * 验证码改变
     */
    public codeChange(e: any) {
        const v = Number(e.key) ? e.key :e.currentTarget.value.slice(-1);
        // const v = e.currentTarget.value.slice(-1);
        if (e.key === 'Backspace') {
            this.props.code.pop();
            const ind = this.props.code.length;
            if (ind >= 0) {
            // tslint:disable-next-line:prefer-template
                document.getElementById('codeInput' + ind).focus();
            }
            this.setCode();
            
        } else if (this.integerJudge(v)) {
            this.props.code.push(v);
            const ind = this.props.code.length;
            // tslint:disable-next-line:prefer-template
            document.getElementById('codeInput' + (ind - 1)).blur();
            if (ind < 4) {
            // tslint:disable-next-line:prefer-template
                document.getElementById('codeInput' + ind).focus();
            }
        }
        console.log(v,this.props.code.length);
        this.paint();
        
        setTimeout(() => {
            if (this.props.code.length === 4) {
                this.doSure();
            }
        }, 100);
    }

    /**
     * 验证码输入框聚焦
     */
    public codeFocus() {
        const ind = this.props.code.length; 
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
