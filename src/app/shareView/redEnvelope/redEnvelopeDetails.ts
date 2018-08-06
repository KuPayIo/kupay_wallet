/**
 * red-envelope details
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { requestAsync } from '../../store/conMgr';
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
        this.querydetail(props.uid,props.rid);
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
                        amount:l[i][4],
                        time:l[i][5],
                        timeShow:timestampFormat(l[i][5])
                    };
                    redBagList.push(redBag);
                }
                
            }
            this.state.totalNumber = l.length;
            this.state.convertedNumber = redBagList.length;
            this.state.totalAmount = totalAmount;
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
        copyToClipboard(this.props.code);
        popNew('app-shareView-components-message',{ itype:'success',center:true,content:'复制成功' });
    }
}

// 复制到剪切板
const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

// 时间戳格式化
const timestampFormat = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};