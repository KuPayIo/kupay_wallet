/**
 * red-envelope details
 */
// ============================== 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog } from '../../../net/pull';
import { CurrencyTypeReverse, RedBag } from '../../../store/interface';
import { smallUnit2LargeUnitString, timestampFormat, unicodeArray2Str } from '../../../utils/tools';

interface Props {
    rid:string;// 红包id
    rtype:number;// 红包类型
    ctype:number;// 币种
    ctypeShow:string;
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
    codes:string[];// 兑换码
}

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            currencyName:CurrencyTypeReverse[props.ctype],
            lm:'',
            totalNumber:0,
            convertedNumber:0,
            totalAmount:0,
            redBagList:[]
        };
        this.init();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public async init() {
        const value = await queryDetailLog(this.props.rid);
        if (!value) return;
        const l = value[1];
        const redBagList:RedBag[] = [];
        let totalAmount = 0;
        for (let i = 0;i < l.length;i++) {
            const amount = smallUnit2LargeUnitString(this.state.currencyName,l[i][4]);
            totalAmount += amount;
            if (l[i][1] !== 0 && l[i][5] !== 0) {
                const redBag:RedBag = {
                    suid:l[i][0],
                    cuid:l[i][1],
                    rtype:l[i][2],
                    ctype:l[i][3],
                    amount,
                    time:l[i][5],
                    timeShow:timestampFormat(l[i][5])
                };
                redBagList.push(redBag);
            }
                
        }
        this.state.lm = unicodeArray2Str(value[0]);
        this.state.totalNumber = l.length;
        this.state.convertedNumber = redBagList.length;
        this.state.totalAmount = totalAmount;
        this.state.redBagList = redBagList;
        this.paint();
    }
}