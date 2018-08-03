/**
 * open red-envelope
 */
import { open, request,setUrl } from '../../../pi/net/ui/con_mgr';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.state = {
            rid:parseUrlParams(window.location.search,'rid'),
            openClick:false
        };
    }
    public openRedEnvelopeClick() {
        this.state.openClick = true;
        takeRedEnvlope(this.state.rid,(res) => {
            console.log(res);
            popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ code:'HGD78SDF' });
            this.ok && this.ok();
        });
        this.paint();
    }
}

const parseUrlParams = (search: string, key: string) => {
    const ret = search.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};

const takeRedEnvlope = (rid:string,success?:Function,fail?:Function) => {
    // 币种
    setUrl(`ws://192.168.33.65:2081`);
    open(() => {
        // todo 需要在登录后才能发起正式的通信

        // 发红包
        const takeRedEnvelope = {
            type:'take_red_bag',
            param:{
                rid
            }
        };
        const msg = takeRedEnvelope;
        request(msg, (res) => {
            console.log(`开红包${res}`);
            success && success(res);
        });
    }, (result) => {
        console.log(`open错误信息为${result}`);
    });
};