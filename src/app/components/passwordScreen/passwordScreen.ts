/**
 * 密码屏
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';


interface Props {
    title: string;
    forgetPsw?:string;
}

export class PasswordScreen extends Widget {
    public props: Props;
    constructor() {
        super();
    }

    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public init(){
        this.state = {
            defaultArr:new Array(6),
            pswBoard:[1,2,3,4,5,6,7,8,9,0],
            pswArr:[]
        }
    }

    public boardItemClick(e:any,index:number){
        if(this.state.pswArr.length > 6) return;
        this.state.pswArr.push(this.state.pswBoard[index]);
        this.paint();
        if(this.state.pswArr.length === 6){
            notify(e.node,"ev-completed-click",{psw:this.state.pswArr.join("")});
            return;
        }
       
    }

    public clearClick(){
        if(this.state.pswArr.length === 0) return;
        this.state.pswArr.pop();
        this.paint();
    }

    public forgetPswClick(e:any){
        notify(e.node,"ev-forgetPassword-click",{});
    }

   
}
