/**
 * red-envelope record
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyTypeReverse, requestAsync } from '../../../store/conMgr';
import { timestampFormat } from '../../../utils/tools';

interface Record {
    rtype:number;// 红包类型
    ctype:number;// 币种
    amount:number;// 金额
    time:number;// 时间
    codes:string[];// 兑换码
}
export class RedEnvelopeRecord extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.state = {
            sendNumber:0,
            recordList:[]
        };
        this.init();
    }
    public async init() {
        const res = await this.queryRedEnvelopeRecord();
        const recordListShow = [];
        if (res.result === 1) {
            const sendNumber = res.value[0];
            const start = res.value[1];
            const recordList = [];
           
            const r = res.value[2];
            for (let i = 0; i < r.length;i++) {
                const record:Record = {
                    rtype:r[i][0],
                    ctype:r[i][1],
                    amount:r[i][2],
                    time:r[i][3],
                    codes:r[i][4]
                };
                recordList.push(record);
                recordListShow.push({ ...record,ctypeShow:CurrencyTypeReverse[record.ctype],timeShow:timestampFormat(record.time / 1000) });
            }
            this.state.sendNumber = sendNumber;
            this.state.recordList = recordListShow;
            this.paint();
        } else {
            popNew('app-components-message-message',{ itype:'error',content:'出错啦',center:true });
        }
        
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public redEnvelopeItemClick(e:any,index:number) {
        popNew('app-view-redEnvelope-send-redEnvelopeDetails',{ ...this.state.redEnvelopeList[index] });
    }

    public async queryRedEnvelopeRecord() {
        const msg = {
            type:'query_emit_log',
            param:{
                count:10
            }
        };
        // tslint:disable-next-line:no-unnecessary-local-variable
        const res = await requestAsync(msg);

        return res;
    }
}