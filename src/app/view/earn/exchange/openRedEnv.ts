/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { convertRedBag, getServerCloudBalance, takeRedBag } from '../../../net/pull';
import { CloudCurrencyType, LuckyMoneyType } from '../../../store/interface';
import { setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/tools';
import { smallUnit2LargeUnit } from '../../../utils/unitTools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
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
                popNew('app-view-earn-exchange-exchangeDetail',this.props);
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
        
        const res: any = await takeRedBag(rid.slice(2));
        if (!res) {
            this.props.openClick = false;
            this.paint();

            return false;
        }
        console.log('!!!!!!!!!!!!!!!!!!!takeredbag',res);
        const cid = res.value[3];  // 兑换码
        
        const ans = await convertRedBag(cid);
        if (!ans) {
            this.props.openClick = false;
            this.paint();

            return false;
        }
        console.log('!!!!!!!!!!!!!!!!!!!convertredbag',ans);
        const v = ans.value;
        this.props = {
            ...this.props,
            rtype: rid.slice(0,2),
            ctypeShow: CloudCurrencyType[v[0]],
            amount: smallUnit2LargeUnit(CloudCurrencyType[v[0]],v[1]),
            rid: rid.slice(2),
            suid: ans.src_id
        };
        setStore('activity/luckyMoney/exchange',undefined);
        getServerCloudBalance();

        return true;
    }

    public backPrePage(fg:string) {
        this.ok && this.ok(fg);
    }

}
