/**
 * ExchangeDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog } from '../../../net/pull';

export class ExchangeDetail extends Widget {
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            message:'恭喜发财 万事如意',
            redBagList:[
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' },
                { cuid:111,amount:1,timeShow:'04-30 14:32:00' }                    
            ],
            scroll:false,
            showPin:this.props.rtype === 1  // 0 等额红包  1 拼手气红包
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 页面滑动
     */
    public pageScroll() {
        if (document.getElementById('content').scrollTop > 0) {
            this.state.scroll = true;
            if (this.state.scroll) {
                this.paint();
            }

        } else {
            this.state.scroll = false;
            this.paint();
        }
    }

    public initData() {
        const value = queryDetailLog(this.props.rid);
        if (!value) return;
        this.state.redBagList = value[0];        
        this.state.message = value[1];
        this.paint();
    }
}