/**
 * open red-envelope
 */
import { getConvertRedBag, getRedCode } from '../../../earn/client/app/net/rpc';
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { convertRedBag, getServerCloudBalance } from '../../net/pull';
import { CloudCurrencyType, CloudType, LuckyMoneyType } from '../../public/interface';
import { setStore } from '../../store/memstore';
import { currencyType, popNewMessage } from '../../utils/pureUtils';
import { smallUnit2LargeUnit } from '../../utils/unitTools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare let module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    rtype:string;
    message: string;
    ctypeShow: string;
    amount: number;
    inFlag?:string; // 从哪里进入 chat
}
export class OpenRedEnvelope extends Widget {
    public ok:(fg:string) => void;
    public language:any;
    public props:any;

    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            tag:'',
            openClick:false
        };

        if (props.rtype === LuckyMoneyType.Normal) {
            this.props.tag = this.language.tips[0];
        } else if (props.rtype === LuckyMoneyType.Random) {
            this.props.tag = this.language.tips[1];
        } else if (props.rtype === LuckyMoneyType.Invite) {
            this.props.tag = this.language.tips[2];
        }
        
    }

    /**
     * 开红包
     */
    public openRedEnv() {
        this.props.openClick = true;
        this.paint();
        
        setTimeout(async () => {
            let convertFg = true; // 兑换成功标记
            if (this.props.inFlag === 'chat') {
                convertFg = await this.convertClick();
            } 
            if (convertFg) {  
                popNew('app-view-redEnvelope-exchangeDetail',this.props);
                popNewMessage(this.language.successMess);
                this.backPrePage(JSON.stringify(this.props)); // 兑换成功
            }
        },800);
       
    }

    /**
     * 实际兑换红包
     */
    public async convertClick() {
        const rid = this.props.rid;
        const res: any = await getRedCode(rid.slice(2));
        console.log('========================convert',res);
        if (res.reslutCode === 702) {  // 红包已被领完 查看其他人领取记录
            this.props = {
                ...this.props,
                rtype: rid.slice(0,2),
                amount: 0,
                rid: rid.slice(2)
            };
            popNew('app-view-redEnvelope-exchangeDetail',this.props);
            this.backPrePage(JSON.stringify(this.props)); // 查看兑换记录

            return false;

        } else if (res.reslutCode !== 1) {  // 其他错误 直接退出
            this.props.openClick = false;
            this.paint();

            return false;
        }
        console.log('!!!!!!!!!!!!!!!!!!!takeredbag',res);
        const cid = JSON.parse(res.msg).cid;  // 兑换码
        
        const ans:any = await getConvertRedBag(cid);
        if (ans.reslutCode !== 1) {
            this.props.openClick = false;
            this.paint();

            return false;
        }
        console.log('!!!!!!!!!!!!!!!!!!!convertredbag',ans);
        const v = JSON.parse(ans.msg);
        this.props = {
            ...this.props,
            rtype: rid.slice(0,2),
            ctypeShow: currencyType(CloudCurrencyType[v[0]]),
            amount: smallUnit2LargeUnit(CloudType[v[0]],v[1]),
            rid: rid.slice(2),
            suid: v.send_uid
        };
        setStore('activity/luckyMoney/exchange',undefined);
        getServerCloudBalance();

        return true;
    }

    public backPrePage(fg:string) {
        this.ok && this.ok(fg);
    }

}
