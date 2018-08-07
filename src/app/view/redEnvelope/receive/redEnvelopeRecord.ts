/**
 * red-envelope record
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyType, CurrencyTypeReverse, getData, getInviteCodeDetail, queryConvertLog, requestAsync } from '../../../store/conMgr';
import { showError } from '../../../utils/toolMessages';
import { smallUnit2LargeUnit, timestampFormat } from '../../../utils/tools';

interface Record {
    uid: number;// 用户id
    rid: number;// 红包id
    rtype: number;// 红包类型 0-普通红包，1-拼手气红包，99-邀请红包
    ctype: number;// 币种
    amount: number;// 金额
    time: number;// 时间
}

export class RedEnvelopeRecord extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.state = {
            convertNumber: 0,
            recordList: []
        };
        this.init();
    }
    public async init() {

        const res = await queryConvertLog(10);
        const recordListShow = [];
        if (res.result !== 1) {
            showError(res.result);

            return;
        }
        let convertNumber = res.value[0];
        const start = res.value[1];
        const recordList = [];
        const r = res.value[2];
        for (let i = 0; i < r.length; i++) {
            const currencyName = CurrencyTypeReverse[r[i][3]];
            const record: Record = {
                uid: r[i][0],
                rid: r[i][1],
                rtype: r[i][2],
                ctype: r[i][3],
                amount: smallUnit2LargeUnit(currencyName, r[i][4]),
                time: r[i][5]
            };
            recordList.push(record);
            // tslint:disable-next-line:max-line-length
            recordListShow.push({ ...record, ctypeShow: currencyName, timeShow: timestampFormat(record.time), rtypeShow: parseRtype(record.rtype) });
        }

        // 获取邀请红包是否兑换
        const data = await getData('convertRedEnvelope');
        if (data.value) {
            convertNumber++;
            recordListShow.push({
                uid: 0,
                rid: 0,
                rtype: 99,
                rtypeShow: parseRtype(99),
                ctype: CurrencyType.ETH,
                ctypeShow: 'ETH',
                amount: 0.15,
                time: data.value,
                timeShow: timestampFormat(data.value)
            });
        }

        this.state.convertNumber = convertNumber;
        this.state.recordList = recordListShow;
        this.paint();

    }
    public backPrePage() {
        this.ok && this.ok();
    }
}

/**
 * 转化rtype
 */
const parseRtype = (rType) => {
    if (rType === 0) return '等额红包';
    if (rType === 1) return '随机红包';
    if (rType === 99) return '邀请红包';

    return '';
};