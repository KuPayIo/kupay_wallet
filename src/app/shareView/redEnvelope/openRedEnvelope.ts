/**
 * open red-envelope
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { setLocalStorage } from '../../utils/tools';
import { RedEnvelopeType, takeRedEnvelope } from '../store/conMgr';
import { parseUrlParams, unicodeArray2Str } from '../utils/tools';

interface RedEnvelope {
    rid:number;// 红包id
    uid:number;// 用户id
    rtype:number;// 红包类型
    ctype:number;// 币种
    code:string;// 兑换码
    codeShow:string;// 加前缀的兑换码
    amount:number;// 兑换金额
    leaveMsg:string;// 留言
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public async create() {
        super.create();
        const search = window.location.search;
        const itype = parseUrlParams(search,'type');
        console.log('type',itype);
        switch (itype) {
            case RedEnvelopeType.Normal:
                this.state = {
                    type:itype,
                    rid:parseUrlParams(search,'rid'),
                    lm:(<any>window).decodeURIComponent(parseUrlParams(search,'lm')),
                    openClick:false
                };
                break;
            case RedEnvelopeType.Invite:

                break;
            default:
        }
       
    }
    public async openRedEnvelopeClick() {
        this.state.openClick = true;
        this.paint();
        switch (this.state.type) {
            case RedEnvelopeType.Normal:
                this.openNormalRedEnvelope();
                break; 
            case RedEnvelopeType.Invite:

                break;
            default:
        }
    }

    // 开普通红包
    public async openNormalRedEnvelope() {
        const res = await takeRedEnvelope(this.state.rid);
        setTimeout(async () => {
            switch (res.result) {
                case 1:
                    const v = res.value;
                    const redEnvelope:RedEnvelope = {
                        rid:this.state.rid,
                        uid:v[0],
                        rtype:v[1],
                        ctype:v[2],
                        code:v[3],
                        codeShow:`${RedEnvelopeType.Normal}${v[3]}`,
                        amount:v[4],
                        leaveMsg:unicodeArray2Str(v[5])
                    };
                    setLocalStorage('takeRedBag',redEnvelope);
                    popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ ...redEnvelope });
                    this.ok && this.ok();
                    break;
                case 701:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包不存在' });
                    break;
                case 702:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包已领完' });
                    break;
                case 703:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包已过期' });
                    break;
                case 704:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'红包已领取过' });
                    break;
                default:
                    popNew('app-shareView-components-message',{ itype:'error',center:true,content:'出错啦' });    
            }
            this.state.openClick = false;
            this.paint();
        },500);
    }
}
