/**
 * convert red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { inputInviteCdKey, requestAsync, requestLogined } from '../../../store/conMgr';

export class ConvertRedEnvelope extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            cid: '',
            redEnvelope: {
                type: '等额红包',
                time: '04-12  14:32:00',
                currencyName: 'ETH',
                amount: 1,
                leaveMessage: '恭喜发财,大吉大利'
            },
            placeHolder: '输入兑换码，领取红包'
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public redemptionCodeChange(e: any) {
        this.state.cid = e.value;
        this.paint();
    }
    // 兑换
    public async convertClick() {
        const code = this.state.cid.trim();
        if (code.length <= 0) {
            popNew('app-components-message-message', { itype: 'error', content: '请输入兑换码', center: true });

            return;
        }
        const close = popNew('pi-components-loading-loading', { text: '兑换中...' });
        await this.convertRedEnvelope(code);
        // await this.queryDetailByCid();
        close.callback(close.widget);
        // tslint:disable-next-line:max-line-length
        popNew('app-view-redEnvelope-receive-openRedEnvelope', { cid: this.state.cid, redEnvelope: this.state.redEnvelope });
        this.state.cid = '';
        this.paint();
    }

    public redEnvelopeRecordsClick() {
        popNew('app-view-redEnvelope-receive-redEnvelopeRecord');
    }

    public async convertRedEnvelope(code: string) {
        // todo 判断红包类型
        const r = await inputInviteCdKey(code);
        console.log(r);

        return;
        const msg = {
            type: 'convert_red_bag',
            param: {
                cid: code
            }
        };
        const res = await requestLogined(msg);
        console.log('convert_red_bag', res);
    }

    public async queryDetailByCid() {
        const msg = {
            type: 'query_detail_log',
            param: {
                cids: this.state.cid
            }
        };
        const res = await requestAsync(msg);
        console.log('query_detail_log', res);
    }
}