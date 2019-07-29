/**
 * 悬浮框
 */
import { WebViewManager } from '../../../pi/browser/webview';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { getGameItem } from '../../view/play/home/gameConfig';

export class FloatBox extends Widget {
    public ok:() => void;
    public setProps(props:any,oldProps:any) {
        this.props = {
            ...props,
            imgUrl:getGameItem(props.webviewName).img[1]
        };
        super.setProps(this.props,oldProps);
    }
    public floatBoxClick() {
        console.log('点击悬浮框');
        const webviewName = this.props.webviewName;
        WebViewManager.open(webviewName, `${getGameItem(webviewName)}?${Math.random()}`, webviewName,'');
        this.ok && this.ok();
    }

    public attach() {
        super.attach();
        const $this = getRealNode(this.tree);
        this.dragDom($this);
    }

    public dragDom(element:any, callback?:Function) {
        // tslint:disable-next-line:one-variable-per-declaration
        const parentNodeWidth = element.parentNode.clientWidth,parentNodeHeigth = element.parentNode.clientHeight;
        // tslint:disable-next-line:one-variable-per-declaration
        const elementWidth = element.clientWidth,elementHeight = element.clientHeight;
        const params = {
            left: 0,
            top: 0,
            currentX: 0,
            currentY: 0,
            leftLimit:parentNodeWidth - elementWidth,
            topLimit:parentNodeHeigth - elementHeight,
            flag: false
        };
        // 获取相关CSS属性
        const getCss = (o,key) => {
            return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,<any>false)[key];     
        };
        
        // 拖拽的实现
        if (getCss(element, 'left') !== 'auto') {
            params.left = getCss(element, 'left');
        }
        if (getCss(element, 'top') !== 'auto') {
            params.top = getCss(element, 'top');
        }
        // o是移动对象
        element.ontouchstart = (event) => {
            console.log('onmousedown');
            params.flag = true;
            event = event || window.event;
            params.currentX = event.changedTouches[0].clientX;
            params.currentY = event.changedTouches[0].clientY;
        };
        element.ontouchend = () => {
            console.log('onmouseup');
            params.flag = false;    
            if (getCss(element, 'left') !== 'auto') {
                params.left = getCss(element, 'left');
            }
            if (getCss(element, 'top') !== 'auto') {
                params.top = getCss(element, 'top');
            }
            console.log(params);
            callback && callback();
        };
        document.ontouchmove = (event:any) => {
            console.log('onmousemove');
            event = event || window.event;
            if (params.flag) {
                // tslint:disable-next-line:one-variable-per-declaration
                const nowX = event.changedTouches[0].clientX, nowY = event.changedTouches[0].clientY;
                // tslint:disable-next-line:one-variable-per-declaration
                const disX = nowX - params.currentX, disY = nowY - params.currentY;
                // tslint:disable-next-line:one-variable-per-declaration
                let nowLeft = parseInt(<any>params.left,10) + disX,nowTop = parseInt(<any>params.top,10) + disY;
                nowLeft = nowLeft < 0 ? 0 : (nowLeft > params.leftLimit ? params.leftLimit : nowLeft);
                nowTop = nowTop < 0 ? 0 : (nowTop > params.topLimit ? params.topLimit : nowTop);
                element.style.left = `${nowLeft}px`;
                element.style.top =  `${nowTop}px`;
            }
        };    
    }
}