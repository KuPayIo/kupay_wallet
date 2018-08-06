/**
 * convert red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { convertRedBag, inputInviteCdKey, RedEnvelopeType, requestAsync, requestLogined } from '../../../store/conMgr';

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
        try {
            const res: any = await this.convertRedEnvelope(code);
            switch (res.result) {
                case 1:
                    console.log('queryRedBagDesc');
                    const r = await this.queryRedBagDesc(code);
                    if (r.result === 1) {
                        const redEnvelope = {
                            leaveMessage: r.value,
                            ctype: res.value[0],
                            amount: res.value[1]
                        };
                        console.log('redEnvelope', redEnvelope);
                        popNew('app-view-redEnvelope-receive-openRedEnvelope', { ...redEnvelope });
                    }
                    break;
                case 711:
                    popNew('app-components-message-message', { itype: 'error', center: true, content: '兑换码不存在' });
                    break;
                case 712:
                    popNew('app-components-message-message', { itype: 'error', center: true, content: '兑换码已兑换' });
                    break;
                case 713:
                    popNew('app-components-message-message', { itype: 'error', center: true, content: '兑换码已过期' });
                    break;
                case -1:
                    popNew('app-components-message-message', { itype: 'error', center: true, content: '无效的兑换码' });
                    break;
                default:
            }
        } catch (error) {
            console.log(error);
        }

        close.callback(close.widget);
        // tslint:disable-next-line:max-line-length

        this.state.cid = '';
        this.paint();
    }

    public redEnvelopeRecordsClick() {
        popNew('app-view-redEnvelope-receive-redEnvelopeRecord');
    }

    public async convertRedEnvelope(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let res = { result: -1 };
        if (perCode === RedEnvelopeType.Normal) {
            res = await convertRedBag(validCode);
        } else if (perCode === RedEnvelopeType.Invite) {
            res = await inputInviteCdKey(validCode);
        }

        console.log('convert_red_bag', res);

        return res;
    }

    public async queryRedBagDesc(code: string) {
        const msg = {
            type: 'query_red_bag_desc',
            param: {
                cid: code
            }
        };
        const res = await requestAsync(msg);
        console.log('query_red_bag_desc', res);

        return res;
    }
}