/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { LuckyMoneyType, CloudCurrencyType } from '../../../store/interface';
import { setStore } from '../../../store/memstore';
import { getServerCloudBalance, convertRedBag, getData, inputInviteCdKey, setData } from '../../../net/pull';
import { smallUnit2LargeUnit, eth2Wei } from '../../../utils/unitTools';
import { showError } from '../../../utils/toolMessages';
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
    public ok:() => void;
    public language:any;
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
            if(this.props.inFlag === 'chat'){
                await this.convertClick();
            }
            popNew('app-view-earn-exchange-exchangeDetail',this.props);
            
            popNew('app-components1-message-message',{ content:this.language.successMess });
            this.backPrePage();
        },800);
       
    }

    /**
     * 点击兑换按钮
     */
    public async convertClick() {
        const code = this.props.cid.trim();
        if (code.length <= 0) {
            popNew('app-components1-message-message', { itype: 'error', content: this.language.errorList[0], center: true });

            return;
        }
        const close = popNew('app-components1-loading-loading', { text: this.language.loading });        
        const res: any = await this.convertRedEnvelope(code);
        close.callback(close.widget);
        if (!res.value) return;
        setStore('activity/luckyMoney/exchange',undefined);
        getServerCloudBalance();

        this.props.ctypeShow = CloudCurrencyType[res.value[0]];
        this.props.amount = smallUnit2LargeUnit(CloudCurrencyType[res.value[0]], res.value[1]);
        this.props.rtype = code.slice(0, 2);
        this.props.suid = res.src_id;
        
    }

    /**
     * 实际兑换
     */
    public async convertRedEnvelope(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let value = [];
        if (perCode === LuckyMoneyType.Normal || perCode === LuckyMoneyType.Random) {
            value = await convertRedBag(validCode);  // 兑换普通红包，拼手气红包
        } else if (perCode === LuckyMoneyType.Invite) {
            const data = await getData('convertRedEnvelope');
            if (data.value) {
                showError(-99);

                return;
            }
            value = await inputInviteCdKey(validCode);  // 兑换邀请红包
            if (!value) {
                
                return;
            }
            value = [CloudCurrencyType.ETH, eth2Wei(0.015).toString()];
            setData({ key: 'convertRedEnvelope', value: new Date().getTime() });
        } else {
            popNew('app-components1-message-message', { content: this.language.errorList[1] });

            return null;
        }

        return value;
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}
