/**
 * ExchangeDetail
 */
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';

export class ExchangeDetail extends Widget {
    public ok: () => void;

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            list:[
            //     { name:'昵称未设置',data:'1 ETH',time:'04-30 14:32:00',describe:'手气最好',img:'../../res/image/cloud_icon_cloud.png' },
            //     { name:'昵称未设置',data:'1 ETH',time:'04-30 14:32:00',img:'../../res/image/cloud_icon_cloud.png' },
            //     { name:'昵称未设置',data:'1 ETH',time:'04-30 14:32:00',img:'../../res/image/cloud_icon_cloud.png' },
            //     { name:'昵称未设置',data:'1 ETH',time:'04-30 14:32:00',img:'../../res/image/cloud_icon_cloud.png' },
            //     { name:'昵称未设置',data:'1 ETH',time:'04-30 14:32:00',img:'../../res/image/cloud_icon_cloud.png' }                     
            ],
            scroll:false,
            more:false,
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
}