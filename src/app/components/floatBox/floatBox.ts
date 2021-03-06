/**
 * 悬浮框
 */
import { WebViewManager } from '../../../pi/browser/webview';
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
}