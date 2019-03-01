/**
 * topbar头部标题栏
 * {"title":"领红包","background":"orange","centerTitle":true,nextImg:""}
 * title: 标题
 * centerTitle：标题是否居中，默认否
 * background：背景色，传递色值，或者渐变色，默认白色
 * nextImg:右侧图标路径
 */
// ================================ 导入
import { rippleShow } from '../../../chat/client/app/logic/logic';
import { Json } from '../../../pi/lang/type';
import { notify } from '../../../pi/widget/event';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { register } from '../../store/memstore';

interface Props {
    title:string;
    nextImg?:string;
    nextImg1?:string;
    centerTitle?:boolean;
    background?:string;
    refreshImg?:string;
    text?:string;
    textStyle?:string;
    refresh?:boolean;
}

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class TopBar extends Widget {
    public props:Props;
    
    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.props.refresh = false;
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

    /**
     * 第二个右上角按钮
     */
    public goNext1(event:any) {
        notify(event.node,'ev-next1-click',{});
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

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}
register('user/offline',(r) => {
    forelet.paint(r);
});