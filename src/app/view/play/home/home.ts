/**
 * play home 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { register } from '../../../store/memstore';
import { getUserInfo, popNewMessage } from '../../../utils/tools';

import { WebViewManager } from '../../../../pi/browser/webview';
import { transfer3 } from '../../../net/pullWallet';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    public language:any;

    public setProps(props:Json) {
        super.setProps(props);
        this.language = this.config.value[getLang()];
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
            this.props.refresh = false;
        }
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public enterGames1Click() {
        openNewActivity('http://39.104.203.151/game/boot/index.html');
    }

    public enterGames2Click() {
        // http://47.244.59.13/web-rinkeby/index.html
        WebViewManager.open('Crypto Fishing', 'http://47.244.59.13/web-rinkeby/index.html?' + Math.random(), 'Crypto Fishing');
        // transfer3('123456789',{ abc:'123' },(err,hash) => {
        //     console.log(`err is ${err}, hash is ${hash}`);
        // });
    }

    public getCode(event:any) {
        console.log(event.phone);
    }

    public modalBoxSure(e:any) {
        console.log(e.value);
    }

    public showMine() {
        popNew('app-view-mine-home-home');
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.refresh = true;
        this.paint();
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);

    }

    public gameClick() {
        popNewMessage(this.language.tips);
    }
}
register('user/info',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const userInfo = getUserInfo();
        if (userInfo) {
            w.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
        }
        w.paint();
    }
});