/**
 * 可滑动页面头部导航栏
 */
// ================================ 导入
import { Json } from '../../../pi/lang/type';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../../utils/tools';

interface Props {
    scroll?:boolean;
    scrollHeight?:number;
    refreshImg?:string;
    refresh?:boolean;
    text?:string;
    nextImg?:string;
    isOne?:boolean;
}

// ================================ 导出
export class TopBar2 extends Widget {
    public props:Props;
    
    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.props.refresh = false;
        // console.log(this.props);
    }

    /**
     * 刷新当前页
     */
    public refreshPage(event:any) {
        this.props.refresh = true;
        this.paint();
        notify(event.node,'ev-refresh-click',{});
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);
    }

    /**
     * 返回上一页
     */
    public backPrePage(event:any) {
        notify(event.node,'ev-back-click',{});
    }

    /**
     * 跳转到下一页
     */
    public goNext(event:any) {
        notify(event.node,'ev-next-click',{});
    }
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }   
}
