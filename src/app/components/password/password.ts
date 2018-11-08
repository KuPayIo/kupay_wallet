/**
 * 密码输入组件
 * {length:8,hideTips:true,tips:"",limit:1,placeHolder:"密码"}
 * hideTips:满足条件后是否隐藏tips，默认false
 * length：密码设置的最短长度，默认8
 * tips:下方提示语句
 * imit:强度限制，只限制长度传1，长度加两种数据类型传2，默认是1
 * placeHolder：输入框中提示文字
 * 监听 ev-pswSuccess 事件，event.password 获取密码值,event.success 获取当前密码是否符合规则
 */
// ================================ 导入
import { Json } from '../../../pi/lang/type';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

// ================================ 导出
interface Props {
    length?:number;
    limit?:number;
    hideTips?:boolean;
    tips?:string;
    placeHolder?:string;
}
export class ImgRankItem extends Widget {
    public ok: () => void;
    public props:Props;
    public state:{
        password:string;
        secret:number;
        showTips:boolean;
        isSuccess:boolean;
        showIcon:boolean;
    };
    constructor() {
        super();
    }

    public setProps(props: Json, oldProps: Json) {
        super.setProps(props,oldProps);
        this.state = {
            password:'',
            secret:0,
            showTips:true,
            isSuccess:false,
            showIcon:false,
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 密码输入状态变化
     */
    public pswChange(event:any) {
        const psw = event.value;
        this.state.password = psw;
        this.state.showIcon = true;       
        let secret = 0; 
        const limit = this.props.limit ? this.props.limit :1;
        const length = this.props.length ? this.props.length :8;
        
        if (psw.length < length && psw.length > 0) {
            secret = 1; 
            this.state.showTips = true;
            this.state.isSuccess = false;
        } else {
            secret = this.strongJudge(psw);
        }

        if (limit === 1 && psw.length >= length) { // 符合最小长度限制
            this.state.showTips = this.props.hideTips ? false :true;
            this.state.isSuccess = true;
            notify(event.node,'ev-psw-change',{ password:psw,success:true });
        } else if (limit === 2 && secret > 1) {  // 符合最小长度和包含两种数据类型以上限制
            this.state.showTips = this.props.hideTips ? false :true;
            this.state.isSuccess = true;
            notify(event.node,'ev-psw-change',{ password:psw,success:true });
        } else {  // 不符合规则限制
            notify(event.node,'ev-psw-change',{ password:psw,success:false });
        }
        this.state.secret = secret > 3 ? 3 :secret; // 只有三种强度水平显示
        this.paint();
    }

    /**
     * 选中输入框后图标切换
     */
    public iconChange() {
        if (this.state.password !== '') {
            this.state.showIcon = true;
        } else {
            this.state.showIcon = false;
        }
        this.paint();
    }

    /**
     * 情况输入框
     */
    public clear() {
        this.state.password = '';
        this.state.secret = 0;
        this.paint(true);
    }

    /**
     * 判断密码强度
     * @param psw 密码
     */
    public strongJudge(psw:string) {
        const reg1 = /[0-9]+/; 
        const reg2 = /[a-z]+/; 
        const reg3 = /[A-Z]+/;
        const reg4 = /[!"#$%&'()*+,\-./:;<=>?@\[\]^_`{\|}~]+/; // 特殊字符集
        let num = 0;
        if (reg1.test(psw)) {
            num++;
        }
        if (reg2.test(psw)) {
            num++;
        }
        if (reg3.test(psw)) {
            num++;
        }
        if (reg4.test(psw)) {
            num++;
        }
        
        return num;
    }
}
