/**
 * 首页头部导航栏
 */
// ================================ 导入
import { Json } from '../../../pi/lang/type';
import { popNew } from '../../../pi/ui/root';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    avatar:string;
    scrollHeight?:number;
    refreshImg?:string;
    refresh?:boolean;
    text?:string;
}

// ================================ 导出
export class TopBar1 extends Widget {
    public props:Props;
    
    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.props.refresh = false;
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
     * 打开我的设置
     */
    public showMine() {
        popNew('app-view-mine-home-home');
    }

}