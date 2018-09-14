/**
 * RedEnvDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog } from '../../../net/pull';

interface Props {
    rtype:number;  // 0 等额红包  1 拼手气红包
    rid:string;  // 红包ID
    curNum:number;  // 已领取个数
    totalNum:number;  // 总红包个数
    amount:number;  // 红包总金额
    ctypeShow:string;  // 货币类型名称
}
export class RedEnvDetail extends Widget {
    public props:Props;
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            message:'恭喜发财 万事如意',
            redBagList:[
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                // { cuid:111,amount:1,timeShow:'04-30 14:32:00' } 
            ],
            scroll:false,
            showPin:this.props.rtype === 1  // 0 等额红包  1 拼手气红包
        };
        this.initData();
    }

    public async initData() {
        const value = await queryDetailLog(this.props.rid);
        if (!value) return;
        this.state.redBagList = value[0];        
        this.state.message = value[1];
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 页面滑动
     */
    public pageScroll() {
        if (document.getElementById('redEnvDetail').scrollTop > 0) {
            this.state.scroll = true;
            if (this.state.scroll) {
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }
}