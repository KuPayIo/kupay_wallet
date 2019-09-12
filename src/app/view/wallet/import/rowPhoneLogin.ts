import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { Option, phoneImport } from '../../../logic/localWallet';
import { getRandom, logoutAccountDel } from '../../../net/login';
import { regPhone, verifyPhone } from '../../../net/pull';
import { deleteAccount, getAllAccount, getStore, setStore } from '../../../store/memstore';
import { getDataCenter, getPullMod } from '../../../utils/commonjsTools';
import { defaultPassword } from '../../../utils/constants';
import { delPopPhoneTips, playerName, popNewLoading, popNewMessage } from '../../../utils/tools';

interface Props {
    phone:string;
    code:string;
    oldCode:string;
    countdown:number;
    limitTime:number;
}

/**
 * 横屏登录
 */
export class RowPhoneLogin extends Widget {
    public ok:() => void;
    public timer:number;
    public props:Props = {
        phone:'',
        code:'',
        oldCode:'86',
        countdown:0,
        limitTime:60
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public phoneChange(e:any) {
        this.props.phone = e.value;
    }

    public codeChange(e:any) {
        this.props.code = e.value;
    }

    public async getCode() {
        if (!this.props.phone || !this.phoneJudge()) {
            const tips = { zh_Hans:'无效的手机号',zh_Hant:'無效的手機號',en:'' };
            popNewMessage(tips[getLang()]);

            return;
        }
        const pullMod = await getPullMod();
        await pullMod.sendCode(this.props.phone, this.props.oldCode,false);
        this.props.countdown = this.props.limitTime;
        clearTimeout(this.timer);
        this.openTimer();
        this.paint();
    }

    /**
     * 判断手机号是否符合规则
     */
    public phoneJudge() {
        const reg1 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
        const reg2 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;        
        if (this.props.oldCode === '86') {
            return reg1.test(this.props.phone);
        } else {
            return reg2.test(this.props.phone);
        }
    }
    public async login() {
        const phoneNum = this.props.phone;
        if (!this.props.phone) {
            popNewMessage('请输入手机号码');

            return;
        }

        if (!this.props.code) {
            popNewMessage('请输入验证码');

            return;
        }
        const areaCode = '86';
        const option:Option = {
            psw:defaultPassword,
            nickName:await playerName()
        };
        const close = popNewLoading('导入中');
        const verify = await verifyPhone(this.props.phone,this.props.code);
        const secretHash = await phoneImport(option);
        if (!secretHash) {
            close.callback(close.widget);
            popNewMessage('导入失败');

            return;
        }
        if (verify) {  // 已经注册过
            const itype = await getRandom(secretHash,undefined,JSON.parse(phoneNum),JSON.parse(this.props.code),areaCode);
            console.log('getRandom itype = ',itype);
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
            const itype = await getRandom(secretHash);
            console.log('getRandom itype = ',itype);
            if (itype === 1) {
                const data = await regPhone(this.props.phone, areaCode,this.props.code);
                close.callback(close.widget);
                if (data && data.result === 1) {
                    const userinfo = getStore('user/info');
                    userinfo.phoneNumber = this.props.phone;
                    userinfo.areaCode = areaCode;
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
    public phoneImportError(tips:string) {
        popNewMessage(tips);
        logoutAccountDel(true);
        this.props.code = '';
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
        getDataCenter().then(dataCenter => {
            dataCenter.refreshAllTx();
            dataCenter.initErc20GasLimit();
        });
    }

    // 返回
    public backPrePage() {
        this.ok && this.ok();
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