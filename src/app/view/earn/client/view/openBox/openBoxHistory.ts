/**
 * 开宝箱 --中奖记录
 */


import { Widget } from "../../../../../../pi/widget/widget";

interface Props{
    type:number;
    history:any;
}



export class TicketCenter extends Widget {
    public ok: () => void;

    public props:Props ={
        type :0,
        history:[
            {
                img:'../../res/image/dividend_history_none.png',
                name:'haha',
                time:'2018.12.28'
            },
            {
                img:'../../res/image/dividend_history_none.png',
                name:'haha',
                time:'2018.12.28'
            },
            {
                img:'../../res/image/dividend_history_none.png',
                name:'haha',
                time:'2018.12.28'
            }
        ]
    }

    public setProps(props:any){
        super.setProps(this.props);
        this.props = {
            ...this.props,
            type:props.type
        }
    }


    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}