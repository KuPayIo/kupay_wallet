/**
 * 密码输入组件
 * {length:8,hideTips:true,tips:"",limit:1}
 * hideTips:满足条件后是否隐藏tips，默认false
 * length：密码设置的最短长度，默认8
 * tips:下方提示语句
 * imit:强度限制，只限制长度传1，长度加两种数据类型传2，默认是1
 * 监听 ev-pswSuccess 事件，event.password 获取密码值
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
}
export class ImgRankItem extends Widget {
    public ok: () => void;
    public props:Props;
    public state:{
        password:string;
        secret:number;
        showTips:boolean;
        isSuccess:boolean;
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
            isSuccess:false
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
        let secret = 0; 
        let limit = this.props.limit?this.props.limit:1;
        let length = this.props.length?this.props.length:8;
        
        if (psw.length < length && psw.length > 0) {
            secret = 1; 
            this.state.showTips = true;
            this.state.isSuccess = false;
        } else {
            secret = this.strongJudge(psw);
        }

        
        if (limit === 1 && psw.length >= length) { // 只限制最小长度，满足条件抛出事件
            this.state.showTips = this.props.hideTips ? false :true;
            this.state.isSuccess = true;
            notify(event.node,'ev-pswSuccess',{password:psw});
        } else if (limit === 2 && secret > 1) {  // 限制最小长度和两种数据类型，满足条件抛出事件
            this.state.showTips = this.props.hideTips ? false :true;
            this.state.isSuccess = true;
            notify(event.node,'ev-pswSuccess',{password:psw});
        }
        this.state.secret = secret > 3 ? 3 :secret; // 只有三种强度水平显示
        this.paint();
    }

    /**
     * 判断密码强度
     * @param psw 密码
     */
    public strongJudge(psw:string) {
        const reg1 = /[0-9]+/; 
        const reg2 = /[a-z]+/; 
        const reg3 = /[A-Z]+/;
        const reg4 = /[^0-9a-zA-Z]+/;
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
