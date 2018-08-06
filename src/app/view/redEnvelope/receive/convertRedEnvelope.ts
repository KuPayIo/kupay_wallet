/**
 * convert red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { kpt2kt, smallUnit2LargeUnit } from '../../../shareView/utils/tools';
import { convertRedBag, 
    CurrencyType, CurrencyTypeReverse, inputInviteCdKey, queryRedBagDesc, RedEnvelopeType } from '../../../store/conMgr';
import { showError } from '../../../utils/toolMessages';

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
            const r: any = await this.queryDesc(code);
            if (r.result !== 1) {
                showError(res.result);

                return;
            }
            const redEnvelope = {
                leaveMessage: r.value,
                ctype: res.value[0],
                amount: smallUnit2LargeUnit(CurrencyTypeReverse[res.value[0]],res.value[1])
            };
            console.log('redEnvelope', redEnvelope);
            popNew('app-view-redEnvelope-receive-openRedEnvelope', { ...redEnvelope });
        } catch (error) {
            console.log(error);
        }

        close.callback(close.widget);

        this.state.cid = '';
        this.paint();
    }

    public redEnvelopeRecordsClick() {
        popNew('app-view-redEnvelope-receive-redEnvelopeRecord');
    }

    public async convertRedEnvelope(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let res = { result: -1, value: [] };
        if (perCode === RedEnvelopeType.Normal) {
            res = await convertRedBag(validCode);
        } else if (perCode === RedEnvelopeType.Invite) {
            res = await inputInviteCdKey(validCode);
            res.value = [CurrencyType.ETH, 0.015];
        }

        console.log('convert_red_bag', res);

        return res;
    }

    public async queryDesc(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let res = { result: -1, value: '' };
        if (perCode === RedEnvelopeType.Normal) {
            res = await queryRedBagDesc(validCode);
        } else if (perCode === RedEnvelopeType.Invite) {
            res.result = 1;
            res.value = '我是邀请码';
        }

        console.log('query_red_bag_desc', res);

        return res;
    }
}