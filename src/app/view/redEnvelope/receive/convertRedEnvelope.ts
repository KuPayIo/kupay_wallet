/**
 * convert red-envelope
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { convertRedBag, getCloudBalance, getData, inputInviteCdKey, queryRedBagDesc, setData } from '../../../net/pull';
import { CurrencyType, CurrencyTypeReverse, RedEnvelopeType } from '../../../store/conMgr';
import { find, updateStore } from '../../../store/store';
import { showError } from '../../../utils/toolMessages';
import { eth2Wei, getFirstEthAddr, removeLocalStorage, smallUnit2LargeUnitString } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

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
        const value: any = await this.convertRedEnvelope(code);
        close.callback(close.widget);
        if (!value) return;
        const firstAddr = getFirstEthAddr();
        const cHisRec = find('cHisRec');
        cHisRec[firstAddr] = {};
        updateStore('cHisRec',cHisRec);
        getCloudBalance();
        const r: any = await this.queryDesc(code);

        const redEnvelope = {
            leaveMessage: r.value,
            ctype: value[0],
            amount: smallUnit2LargeUnitString(CurrencyTypeReverse[value[0]], value[1])
        };
        popNew('app-view-redEnvelope-receive-openRedEnvelope', { ...redEnvelope, rtype: code.slice(0, 2) });
        this.state.cid = '';
        this.paint();
    }

    public redEnvelopeRecordsClick() {
        popNew('app-view-redEnvelope-receive-redEnvelopeRecord');
    }

    public async convertRedEnvelope(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let value = [];
        if (perCode === RedEnvelopeType.Normal) {
            value = await convertRedBag(validCode);
        } else if (perCode === RedEnvelopeType.Invite) {
            const data = await getData('convertRedEnvelope');
            if (data.value) {
                showError(-2);

                return;
            }
            value = await inputInviteCdKey(validCode);
            if (!value) return;
            value = [CurrencyType.ETH, eth2Wei(0.015).toString()];
            setData({ key: 'convertRedEnvelope', value: new Date().getTime() });
        } else {
            popNew('app-components-message-message', { itype: 'error', content: '兑换码错误', center: true });

            return null;
        }

        return value;
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