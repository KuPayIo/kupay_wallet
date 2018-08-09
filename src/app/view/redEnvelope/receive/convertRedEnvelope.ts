/**
 * convert red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { cloudAccount } from '../../../store/cloudAccount';
import {
    convertRedBag, CurrencyType, CurrencyTypeReverse, getData, inputInviteCdKey, queryRedBagDesc, RedEnvelopeType, setData
} from '../../../store/conMgr';
import { showError } from '../../../utils/toolMessages';
import { eth2Wei, removeLocalStorage, smallUnit2LargeUnitString } from '../../../utils/tools';

export class ConvertRedEnvelope extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            cid: '',
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
        this.inputBlur();
        const code = this.state.cid.trim();
        if (code.length <= 0) {
            popNew('app-components-message-message', { itype: 'error', content: '请输入兑换码', center: true });

            return;
        }
        const close = popNew('pi-components-loading-loading', { text: '兑换中...' });
        try {
            const res: any = await this.convertRedEnvelope(code);
            if (res.result !== 1) {
                showError(res.result);
                close.callback(close.widget);

                return;
            }
            removeLocalStorage('convertRedEnvelopeHistoryRecord');
            cloudAccount.updateBalance();
            const r: any = await this.queryDesc(code);

            const redEnvelope = {
                leaveMessage: r.value,
                ctype: res.value[0],
                amount:smallUnit2LargeUnitString(CurrencyTypeReverse[res.value[0]], res.value[1]) 
            };
            popNew('app-view-redEnvelope-receive-openRedEnvelope', { ...redEnvelope,rtype:code.slice(0,2) });
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
            const data = await getData('convertRedEnvelope');
            if (data.value) {
                res.result = -2;

                return res;
            }
            res = await inputInviteCdKey(validCode);
            res.value = [CurrencyType.ETH, eth2Wei(0.015)];
            await setData({ key: 'convertRedEnvelope', value: new Date().getTime() });
            console.log('兑换成功', data);
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
            res.value = 'KuPay大礼包';
        }

        return res;
    }
    public inputBlur() {
        const input: any = document.querySelector('.pi-input-simple__inner');
        input.blur();
    }
}