/**
 * 云端绑定手机
 */
// =================================================导入
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetRandom, callLogoutAccountDel } from '../../../middleLayer/netBridge';
import { callGetDataCenter } from '../../../middleLayer/walletBridge';
import { regPhone, verifyPhone } from '../../../net/pull';
import { CreateWalletOption } from '../../../publicLib/interface';
import { deleteAccount, getAllAccount, getStore, setStore } from '../../../store/memstore';
import {  } from '../../../utils/commonjsTools';
import { defaultPassword } from '../../../utils/constants';
import { delPopPhoneTips, playerName, popNewLoading, popNewMessage } from '../../../utils/tools';
import { phoneImport } from '../../../viewLogic/localWallet';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class PhoneImport extends Widget {
    public cancel: () => void;
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props:any,oldProps:any) {
        this.props = {
            ...props,
            areaCode:'',
            phone:'',
            code:[],
            isSuccess:true
        };
        super.setProps(this.props,oldProps);
    }

    public backPrePage() {
        this.cancel && this.cancel();
    }
    
    /**
     * 输入完成后确认
     */
    public async doSure() {
        const phoneNum = this.props.phone; 
        if (!phoneNum) {
            const tips = { zh_Hans:'请先获取验证码',zh_Hant:'請先獲取驗證碼',en:'' };
            popNewMessage(tips[getLang()]);
            this.props.code = [];
            this.setCode();

            return;
        }
        const option:CreateWalletOption = {
            psw:defaultPassword,
            nickName:await playerName()
        };
        const close = popNewLoading('导入中');
        const verify = await verifyPhone(phoneNum,this.props.areaCode);
        const secretHash = await phoneImport(option);
        if (!secretHash) {
            close.callback(close.widget);
            popNewMessage('导入失败');

            return;
        }
        if (verify) {  // 已经注册过
            const itype = await callGetRandom(secretHash,undefined,phoneNum,this.props.code.join(''),this.props.areaCode);
            close.callback(close.widget);
            if (itype === -301) {
                this.phoneImportError('验证码错误');
            } else if (itype === 1014) {
                this.phoneImportSuccess(phoneNum);
            } else if (itype === 1) {
                this.phoneImportSuccess(phoneNum);
            } else {
                this.phoneImportError('出错啦');
            }
        } else {
            const itype = await callGetRandom(secretHash);
            if (itype === 1) {
                const data = await regPhone(this.props.phone, this.props.areaCode,this.props.code.join(''));
                close.callback(close.widget);
                if (data && data.result === 1) {
                    const userinfo = getStore('user/info');
                    userinfo.phoneNumber = this.props.phone;
                    userinfo.areaCode = this.props.areaCode;
                    setStore('user/info',userinfo,false);
                    delPopPhoneTips();
                    this.ok && this.ok();
                } else {
                    this.phoneImportError('出错啦');
                }
            } else {
                close.callback(close.widget);
                this.phoneImportError('出错啦');
            }
        }
        
    }
    // 手机导入失败
    public async phoneImportError(tips:string) {
        popNewMessage(tips);
        await callLogoutAccountDel(true);
        this.props.code = [];
        this.setCode();
    }
    
    // 手机导入成功
    public phoneImportSuccess(phoneNum:string) {
        deletePrePhoneAccount(phoneNum);
        const userInfo = getStore('user/info');
        userInfo.phoneNumber = phoneNum;
        setStore('user/info',userInfo,false);
        popNewMessage('登录成功');
        this.ok && this.ok();
        // 刷新本地钱包
        callGetDataCenter().then(dataCenter => {
            dataCenter.refreshAllTx();
            dataCenter.initErc20GasLimit();
        });
    }

    /**
     * 手机号改变
     */
    public phoneChange(e: any) {
        this.props.phone = e.value; 
        this.props.areaCode = e.areaCode; 
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

/**
 * 删除相同手机号绑定的账户
 */
const deletePrePhoneAccount = (phoneNumber:string) => {
    const accounts = getAllAccount();
    for (const index in accounts) {
        const account = accounts[index];
        if (account.user.info.phoneNumber === phoneNumber) {
            deleteAccount(account.user.id);
        }
    }
};