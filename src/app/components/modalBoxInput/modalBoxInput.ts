/**
 * 带输入框的模态框
 * {title:"提示",content:"温馨提示",sureText:"sure",cancelText:"cancel",placeholder:"",itype:"text"}
 * title：标题
 * content：内容数组，如果需要分行显示
 * sureText:确认按钮名称
 * cancelText：取消按钮名称
 * itype:输入数据类型，text，number，password
 * placeholder:输入框提示语
 * 外部监听 ev-sure，ev-forgetPsw 事件,event.value获取输入框中数据  
 */
import { getLocalStorage } from '../../../chat/client/app/data/lcstore';
import { getChatUid } from '../../../chat/client/app/net/rpc';
import { GENERATOR_TYPE } from '../../../chat/server/data/db/user.s';
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { getLoginMod } from '../../utils/commonjsTools';

interface Props {
    title:string;
    content:string[];
    onlyOk:boolean;
    sureText?:string;
    cancelText?:string;
    placeholder?:boolean;
    itype?:string;
    lockScreen?:boolean; // 解锁屏幕失败，验证身份进入该页面
}
export class ModalBoxInput extends Widget {
    public props: any;
    public ok: (value:string) => void;
    public cancel: (fg:boolean) => void;   // fg为false表示退出APP(或点击取消)，true表示忘记密码

    public setProps(props:any,oldProps:any) {
        super.setProps(props,oldProps);
        this.props = { 
            ...this.props,
            currentValue:''
        };
    }
    /**
     * 点击取消按钮
     */
    public cancelBtnClick() {
        this.cancel && this.cancel(false);
    }
    /**
     * 点击确认按钮
     */
    public okBtnClick() {
        this.ok && this.ok(this.props.currentValue);
    }
    /**
     * 忘记密码
     */
    public foegetPsw() {
        this.cancel && this.cancel(true);
        const modalBox = { 
            zh_Hans:{
                title:'忘记密码？',
                content:'退出当前登录账号，您可以选择重新登录或导入。',
                sureText:'退出',
                cancelText:'联系客服',
                onlyOk:!!this.props.onlyOk
            },
            zh_Hant:{
                title:'忘記密碼？',
                content:'退出當前登錄賬號，您可以選擇重新登錄或導入。',
                sureText:'退出',
                cancelText:'联系客服',
                onlyOk:!!this.props.onlyOk
            },
            en:'' 
        };
        popNew('app-components-modalBox-modalBox',modalBox[getLang()],() => {  // 确认删除钱包
            getLoginMod().then(loginMod => {
                loginMod.logoutAccount();
            });
        },() => {   // 取消删除钱包
            console.log('联系客服');
            getChatUid(getLocalStorage('officialService').HAOHAI_SERVANT).then((r) => {
                popNew('chat-client-app-view-chat-chat',{ id: r,chatType: GENERATOR_TYPE.USER });
            });
        });      
    }
    /**
     * 输入框变化
     */
    public change(e:any) {
        this.props.currentValue = e.value;
        this.paint();
    }
}