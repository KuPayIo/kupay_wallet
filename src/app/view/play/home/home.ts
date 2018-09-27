/**
 * play home 
 */
// ================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap() {
        window.open('http://192.168.33.105:8088/dst/client/boot/index.html?user=111');
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
}
