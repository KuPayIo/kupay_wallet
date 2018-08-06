/**
 * convert red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { requestAsync, requestLogined } from '../../../store/conMgr';

export class ConvertRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            cid:'',
            redEnvelope:{
                type:'等额红包',
                time:'04-12  14:32:00',
                currencyName:'ETH',
                amount:1,
                leaveMessage:'恭喜发财,大吉大利'
            },
            placeHolder:'输入兑换码，领取红包'
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public redemptionCodeChange(e:any) {
        this.state.cid = e.value;
        this.paint();
    }
    // 兑换
    public async convertClick() {
        if (this.state.cid.trim().length <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入兑换码',center:true });

            return;
        }
        const close = popNew('pi-components-loading-loading',{ text:'兑换中...' });
        const res = await this.convertRedEnvelope();
        switch (res.result) {
            case 1:
                const r = await this.queryRedBagDesc();
                if (r.result === 1) {
                    const redEnvelope = {
                        leaveMessage:r.value,
                        ctype:res.value[0],
                        amount:res.value[1]
                    };
                    console.log('redEnvelope',redEnvelope);
                    popNew('app-view-redEnvelope-receive-openRedEnvelope',{ ...redEnvelope });
                }
                break;
            case 711:
                popNew('app-components-message-message',{ itype:'error',center:true,content:'兑换码不存在' });
                break;
            case 712:
                popNew('app-components-message-message',{ itype:'error',center:true,content:'兑换码已兑换' });
                break;
            case 713:
                popNew('app-components-message-message',{ itype:'error',center:true,content:'兑换码已过期' });
                break;
            default:
        }
        
        close.callback(close.widget);
        // tslint:disable-next-line:max-line-length
        
        this.state.cid = '';
        this.paint();
    }

    public redEnvelopeRecordsClick() {
        popNew('app-view-redEnvelope-receive-redEnvelopeRecord');
    }

    public async convertRedEnvelope() {
        const msg = {
            type:'convert_red_bag',
            param:{
                cid:this.state.cid
            }
        };
        const res = await requestLogined(msg);
        console.log('convert_red_bag',res);

        return res;
    }

    public async queryRedBagDesc() {
        const msg = {
            type:'query_red_bag_desc',
            param:{
                cid:this.state.cid
            }
        };
        const res = await requestAsync(msg);
        console.log('query_red_bag_desc',res);

        return res;
    }
}