/**
 * red-envelope details
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { requestAsync } from '../../store/conMgr';
import { copyToClipboard, smallUnit2LargeUnit,timestampFormat } from '../utils/tools';
interface Props {
    rid:number;// 红包id
    uid:number;// 用户id
    rtype:number;// 红包类型
    ctype:number;// 币种
    code:string;// 兑换码
    amount:number;// 兑换金额
    leaveMsg:string;// 留言
}
// 枚举货币类型
const CurrencyType  = {
    100:'KT',
    101:'ETH'
};

interface RedBag {
    uid:number;
    rid:number;
    rtype:number;
    ctype:number;
    amount:number;
    time:number;
    timeShow:string;
}
export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            currencyName:CurrencyType[props.ctype],
            totalNumber:0,
            convertedNumber:0,
            totalAmount:0,
            redBagList:[],
            rules:['1.安装Fairblock，创建钱包',
                '2.在钱包里点击发现-发红包',
                '3.输入收到的红包码，红包金额将自动到账',
                '4.同一个红包，每人只能领取一次']
        };
        this.querydetail(props.uid,props.rid);
    }

    public querydetail(uid:number,rid:number) {
        const msg = {
            type:'query_detail_log',
            param:{
                uid,
                rid
            }
        };
        // tslint:disable-next-line:no-unnecessary-local-variable
        requestAsync(msg).then(res => {
            console.log('query_detail_log',res);
            const l = res.value[1];
            const redBagList:RedBag[] = [];
            let totalAmount = 0;
            for (let i = 0;i < l.length;i++) {
                totalAmount += l[i][4];
                if (l[i][1] !== 0 && l[i][5] !== 0) {
                    const redBag:RedBag = {
                        uid:l[i][0],
                        rid:l[i][1],
                        rtype:l[i][2],
                        ctype:l[i][3],
                        amount:smallUnit2LargeUnit(this.state.currencyName,l[i][4]),
                        time:l[i][5],
                        timeShow:timestampFormat(l[i][5])
                    };
                    redBagList.push(redBag);
                }
                
            }
            this.state.totalNumber = l.length;
            this.state.convertedNumber = redBagList.length;
            this.state.totalAmount = smallUnit2LargeUnit(this.state.currencyName,totalAmount);
            this.state.redBagList = redBagList;
            this.paint();
        }).catch(r => {
            console.error(r);
        });
    }
    
    public receiveClick() {
        popNew('app-shareView-redEnvelope-downloadApp');
        this.ok && this.ok();
    }

    public copyBtnClick() {
        copyToClipboard(this.props.codeShow);
        popNew('app-shareView-components-message',{ itype:'success',center:true,content:'复制成功' });
    }
}
