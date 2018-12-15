/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { clientRpcFunc } from '../../../../chat/client/app/net/init';
import { demoGetUserInfo, demoSetUserInfo } from '../server/rpc/demo.p';
import { DemoUserInfo } from '../server/data/demo.s';
import { Result } from '../server/rpc/demo.s';

// ================================================ 导出

export class Demo extends Widget {
    public props:Props;    
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            id1:-1,
            name1:'',
            id2:-1,
            name2:''
        };
    }

    public returnFunc() {
        this.ok();
    }

    public setId(e:any) {
        this.props.id1 = parseInt(e.text,10);
    }
    public setName(e:any){
        this.props.name1 = e.text
    }
    public getId(e:any){
        this.props.id2 = parseInt(e.text,10);
    }
    public rpcGet(){
        clientRpcFunc(demoGetUserInfo, this.props.id2, (r:DemoUserInfo)=>{
            this.props.name2 = r.name;
            this.paint();
        })
    }
    public rpcSet(){
        let userInfo = new DemoUserInfo();
        userInfo.id = this.props.id1;
        userInfo.name = this.props.name1;
        clientRpcFunc(demoSetUserInfo, userInfo, (r:Result)=>{
            if(r.r === 1){
                alert(`设置用户信息成功`)
            }                        
        })
    }
}

// ================================================ 本地
interface Props {
    id1:number,
    name1:string,
    id2:number,
    name2:string,
}