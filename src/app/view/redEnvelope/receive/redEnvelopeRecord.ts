/**
 * red-envelope record
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyTypeReverse, getInviteCodeDetail, queryConvertLog, requestAsync } from '../../../store/conMgr';
import { timestampFormat } from '../../../utils/tools';

interface Record {
    uid: number;// 用户id
    rid: number;// 红包id
    rtype: number;// 红包类型
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
        if (res.result === 1) {
            const convertNumber = res.value[0];
            const start = res.value[1];
            const recordList = [];

            const r = res.value[2];
            for (let i = 0; i < r.length; i++) {
                const record: Record = {
                    uid: r[i][0],
                    rid: r[i][1],
                    rtype: r[i][2],
                    ctype: r[i][3],
                    amount: r[i][4],
                    time: r[i][5]
                };
                recordList.push(record);
                // tslint:disable-next-line:max-line-length
                recordListShow.push({ ...record, ctypeShow: CurrencyTypeReverse[record.ctype], timeShow: timestampFormat(record.time) });
            }
            this.state.convertNumber = convertNumber;
            this.state.recordList = recordListShow;
            this.paint();
        } else {
            popNew('app-components-message-message', { itype: 'error', content: '出错啦', center: true });
        }

    }
    public backPrePage() {
        this.ok && this.ok();
    }
}