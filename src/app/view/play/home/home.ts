/**
 * play home 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    public props:Json = {
        refresh:false
    };

    public backPrePage() {
        this.ok && this.ok();
    }

    public enterGames1Click() {
        openNewActivity('http://39.104.203.151/game/boot/index.html');
    }

    public getCode(event:any) {
        console.log(event.phone);
    }

    public modalBox() {
        // tslint:disable-next-line:max-line-length
        // popNew('app-components-modalBoxInput-modalBoxInput',{ title:'确认兑换',content:['输出：0.01ETH','输入：0.5KT'],sureText:'确定',cancelText:'取消',placeholder:'输入密码',itype:'password' });
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
}
