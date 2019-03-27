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
            imgUrl:getGameItem(props.webViewName).img[1]
        };
        super.setProps(this.props,oldProps);
    }
    public floatBoxClick() {
        console.log('点击悬浮框');
        const webViewName = this.props.webViewName;
        WebViewManager.open(webViewName, `${getGameItem(webViewName)}?${Math.random()}`, webViewName,'');
        this.ok && this.ok();
        
    }
}