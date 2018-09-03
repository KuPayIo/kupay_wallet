/**
 * topbar头部标题栏
 * {"title":"领红包","background":"orange","centerTitle":true}
 * title: 标题
 * centerTitle：标题是否居中，默认否
 * background：背景色，传递色值，或者渐变色，默认白色
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title:string;
    nextClick?:boolean;
    centerTitle?:boolean;
    background?:string;
}

// ================================ 导出
export class TopBar extends Widget {
    public props:Props;
    constructor() {
        super();
    }

    public backPrePage(event:any) {
        notify(event.node,'ev-back-click',{});
    }

    public goNext(event:any) {
        notify(event.node,'ev-next-click',{});
    }
}