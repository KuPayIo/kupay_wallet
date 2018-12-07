/**
 * Exchange
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
// tslint:disable-next-line:max-line-length
import { convertRedBag, getData, getServerCloudBalance, inputInviteCdKey, queryRedBagDesc, setData } from '../../../net/pull';
import { CloudCurrencyType, LuckyMoneyType } from '../../../store/interface';
import { register, setStore } from '../../../store/memstore';
import { showError } from '../../../utils/toolMessages';
import { eth2Wei,smallUnit2LargeUnit } from '../../../utils/unitTools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Exchange extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            cid: '',
            walletName:getModulConfig('WALLET_NAME')
        };
    }
    
    public backPrePage() {
        this.ok && this.ok(); 
    }

    // 输入兑换码
    public inputChange(e: any) {
        this.state.cid = e.value;
        this.paint();
    }
    // 点击兑换按钮
    public async convertClick() {
        this.inputBlur();
        const code = this.state.cid.trim();
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
        const r: any = await this.queryDesc(code);

        const redEnvelope = {
            message: r.value,
            ctypeShow: CloudCurrencyType[res.value[0]],
            amount: smallUnit2LargeUnit(CloudCurrencyType[res.value[0]], res.value[1]),
            rtype: code.slice(0, 2),
            rid:res.rid,
            suid:res.src_id,
            code
        };
        
        popNew('app-view-earn-exchange-openRedEnv', redEnvelope);
        setTimeout(() => {
            this.state.cid = '';
            this.paint(true);
        }, 100);
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('app-view-earn-exchange-exchangeHistory');
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

    /**
     * 查看详情
     */
    public async queryDesc(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let res = { result: -1, value: '' };
        if (perCode === LuckyMoneyType.Invite) {
            res.result = 1;
            res.value = `${this.state.walletName}${this.language.defaultMess}`;
        } else {
            res = await queryRedBagDesc(validCode);
        }

        return res;
    }
    /**
     * 输入框取消聚焦
     */
    public inputBlur() {
        const inputs: any = document.getElementsByTagName('input');
        for (let i = 0;i < inputs.length;i++) {
            inputs[i].blur();
        }
    }
}
