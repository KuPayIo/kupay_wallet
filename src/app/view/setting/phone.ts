/**
 * 云端绑定手机
 */
// =================================================导入
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStoreData, setStoreData } from '../../api/walletApi';
import { regPhone, unbindPhone } from '../../net/pull';
import { getStore, setStore } from '../../store/memstore';
import { delPopPhoneTips, getUserInfo, popNewMessage } from '../../utils/pureUtils';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class BindPhone extends Widget {
    public ok: () => void;
    public create() {
        this.props = {
            areaCode:'',
            phone:'',
            code:[],
            isSuccess:true,
            hasSendCode:false
        };
        super.create();
    }

    public setProps(props:any,oldProps:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props,oldProps);
        getUserInfo().then(userInfo => {
            this.props.phone = userInfo.phoneNumber;
            this.paint();
        });
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public jumpClick() {
        this.ok && this.ok();
    }
    
    /**
     * 输入完成后确认
     */
    public async doSure() {
        if (!this.props.hasSendCode) {
            const tips = { zh_Hans:'请先获取验证码',zh_Hant:'請先獲取驗證碼',en:'' };
            popNewMessage(tips[getLang()]);
            this.props.code = [];
            this.setCode();

            return;
        }
        
        if (!this.props.unbind) {
            const data = await regPhone(this.props.phone, 0,this.props.code.join(''));
            if (data && data.result === 1) {
                const userinfo = await getStoreData('user/info');
                userinfo.phoneNumber = this.props.phone;
                userinfo.areaCode = this.props.areaCode;
                setStoreData('user/info',userinfo);
                delPopPhoneTips();
                this.ok && this.ok();
                popNewMessage('绑定成功');
            } else {
                this.props.code = [];
                this.setCode();
            }
        } else {
            // 解绑
            const data = await unbindPhone(this.props.phone, this.props.code.join(''),this.props.areaCode);
            if (data && data.result === 1) {
                this.ok && this.ok();
                const userinfo = await getStoreData('user/info');
                userinfo.phoneNumber = '';
                userinfo.areaCode = '';
                setStoreData('user/info',userinfo);
                popNewMessage('解绑成功');
            } else {
                this.props.code = [];
                this.setCode();
            }
        }
        this.paint();
    }

    /**
     * 手机号改变
     */
    public phoneChange(e: any) {
        this.props.phone = e.value;  
        this.props.areaCode = e.areaCode;
        this.props.hasSendCode = e.hasSendCode;
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
