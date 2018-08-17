/**
 * open red-envelope
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { CurrencyType, CurrencyTypeReverse, RedEnvelopeType, takeRedEnvelope } from '../shareStore/conMgr';
import { parseUrlParams, setLocalStorage, smallUnit2LargeUnitString, unicodeArray2Str } from '../shareUtils/tools';

interface RedEnvelope {
    rid:string;// 红包id
    uid:number;// 用户id
    rtype:number;// 红包类型
    ctype:number;// 币种
    cid:string;// 兑换码
    cidShow:string;// 加前缀的兑换码
    amount:number;// 兑换金额
    leaveMsg:string;// 留言
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public async create() {
        super.create();
        const search = window.location.search;
        const itype = parseUrlParams(search,'type');
        switch (itype) {
            case RedEnvelopeType.Normal:
                this.state = {
                    type:itype,
                    rid:parseUrlParams(search,'rid'),
                    lm:(<any>window).decodeURIComponent(parseUrlParams(search,'lm')),
                    desc:'您收到一个红包',
                    openClick:false
                };
                break;
            case RedEnvelopeType.Random:
                this.state = {
                    type:itype,
                    rid:parseUrlParams(search,'rid'),
                    lm:(<any>window).decodeURIComponent(parseUrlParams(search,'lm')),
                    desc:'金额随机，试试手气',
                    openClick:false
                };
                break;
            case RedEnvelopeType.Invite:
                this.state = {
                    type:itype,
                    cid:parseUrlParams(search,'cid'),
                    lm:'KuPay大礼包',
                    desc:'您收到一个邀请红包',
                    openClick:false
                };
                break;
            default:
        }
       
    }
    public async openRedEnvelopeClick() {
        this.state.openClick = true;
        this.paint();
        switch (this.state.type) {
            case RedEnvelopeType.Normal:
            case RedEnvelopeType.Random:
                this.openNormalRedEnvelope();
                break; 
            case RedEnvelopeType.Invite:
                this.openInviteRedEnvelope();
                break;
            default:
        }
    }
    // 开邀请红包
    public openInviteRedEnvelope() {
        setTimeout(() => {
            const redEnvelope:RedEnvelope = {
                rid:'0',
                uid:0,
                rtype:99,
                ctype:CurrencyType.ETH,
                cid:this.state.cid,
                cidShow:`${RedEnvelopeType.Invite}${this.state.cid}`,
                amount:0.015,
                leaveMsg:'KuPay大礼包'
            };
            setLocalStorage('inviteRedBag',redEnvelope);
            popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ ...redEnvelope });
            this.ok && this.ok();
        },500);
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
                        cid:v[3],
                        cidShow:`${RedEnvelopeType.Normal}${v[3]}`,
                        amount:smallUnit2LargeUnitString(CurrencyTypeReverse[v[2]],v[4]),
                        leaveMsg:unicodeArray2Str(v[5])
                    };
                    setLocalStorage('takeRedBag',redEnvelope);
                    popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ ...redEnvelope });
                    this.ok && this.ok();
                    break;
                case 701:
                    popNew('app-shareView-shareComponents-message',{ itype:'error',center:true,content:'红包不存在' });
                    break;
                case 702:
                    popNew('app-shareView-shareComponents-message',{ itype:'error',center:true,content:'红包已领完' });
                    break;
                case 703:
                    popNew('app-shareView-shareComponents-message',{ itype:'error',center:true,content:'红包已过期' });
                    break;
                case 704:
                    popNew('app-shareView-shareComponents-message',{ itype:'error',center:true,content:'红包已领取过' });
                    break;
                default:
                    popNew('app-shareView-shareComponents-message',{ itype:'error',center:true,content:'出错啦' });    
            }
            this.state.openClick = false;
            this.paint();
        },500);
    }
}
