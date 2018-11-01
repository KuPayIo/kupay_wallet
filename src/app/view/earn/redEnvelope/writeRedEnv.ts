/**
 * sendRedEnv
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getRealUser, getServerCloudBalance, sendRedEnvlope } from '../../../net/pull';
import { CloudCurrencyType, LuckyMoneyType } from '../../../store/interface';
import { getCloudBalances, getStore, register, setStore } from '../../../store/memstore';
import { getLanguage } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface State {
    list: any[];
    selected: number;
    showPin: boolean;
    totalAmount: number;
    // tslint:disable-next-line:no-reserved-keywords
    totalNum: number;
    oneAmount: number;
    message: string;
    realUser: boolean;
    cfgData: any;
}

export class WriteRedEnv extends Widget {
    public ok: () => void;
    public state: State;
    constructor() {
        super();

    }

    public create() {
        this.state = {
            list: [],
            selected: 0,
            showPin: false,
            totalAmount: 0,
            totalNum: 0,
            oneAmount: 0,
            message: '',
            realUser: getStore('user/info/isRealUser'),
            cfgData: getLanguage(this)
        };
        this.updateBalance();
        if (!this.state.realUser) {
            getRealUser();
        }
    }

    /**
     * 更新真实用户
     */
    public updateRealUser() {
        this.state.realUser = getStore('user/info/isRealUser');
    }

    /**
     * 更新余额
     */
    public updateBalance() {
        const list = [
            { img: '../../res/image/currency/KT.png', name: 'KT', num: 500 },
            { img: '../../res/image/currency/BTC.png', name: 'BTC', num: 0.01 },
            { img: '../../res/image/currency/ETH.png', name: 'ETH', num: 0.5 }
        ];
        const data = getCloudBalances();
        for (const i in list) {
            list[i].num = data.get(CloudCurrencyType[list[i].name]) || 0;
        }
        this.state.list = list;
        this.paint(true);
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public goHistory() {
        popNew('app-view-earn-redEnvelope-redEnvHistory');
    }

    /**
     * 切换拼手气和普通红包
     */
    public changePin() {
        this.state.showPin = !this.state.showPin;
        if (this.state.showPin) {
            this.state.totalAmount = this.state.oneAmount;
        } else {
            this.state.totalAmount = this.state.oneAmount * this.state.totalNum;
        }
        this.paint();
    }

    /**
     * 修改金额
     */
    public changeAmount(e: any) {
        if (this.state.showPin) {
            this.state.totalAmount = e.value;
        } else {
            this.state.oneAmount = e.value;
            this.state.totalAmount = this.state.oneAmount * this.state.totalNum;
        }
        this.paint();
    }

    /**
     * 修改数量
     */
    public changeNumber(e: any) {
        this.state.totalNum = Number(e.value);
        if (!this.state.showPin) {
            this.state.totalAmount = this.state.oneAmount * this.state.totalNum;
        }
        this.paint();
    }

    /**
     * 修改留言
     */
    public changeMessage(e: any) {
        this.state.message = e.value;
        this.paint();
    }

    /**
     * 切换货币
     */
    public changeCoin(e: any) {
        this.state.selected = e.selected;
        this.paint();
    }

    /**
     * 点击发红包按钮
     */
    public async send() {
        if (this.state.totalNum === 0) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[2] });

            return;
        }
        if (this.state.oneAmount === 0 || this.state.totalAmount === 0) {
            popNew('app-components-message-message', { content: this.state.cfgData.tips[1] });

            return;
        }
        const curCoin = this.state.list[this.state.selected];
        if (this.state.totalAmount > curCoin.num) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[3] });

            return;
        }
        if (this.state.message.length > 20) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[4] });

            return;
        }
        if (this.state.message === '') {
            this.state.message = this.state.cfgData.messTitle[1];
        }
        if (!this.state.realUser) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[5] });

            return;
        }

        this.inputBlur();
        const mess1 = this.state.cfgData.phrase[0] + this.state.totalAmount + curCoin.name + this.state.cfgData.phrase[1];
        // tslint:disable-next-line:max-line-length
        const mess2 = this.state.cfgData.phrase[2] + (this.state.showPin ? this.state.cfgData.redEnvType[1] : this.state.cfgData.redEnvType[0]);
        popNew('app-components-modalBoxInput-modalBoxInput', {
            title: curCoin.name + this.state.cfgData.phrase[3],
            content: [mess1, mess2],
            placeholder: this.state.cfgData.phrase[4],
            itype: 'password'
        },
            async (r) => {
                const close = popNew('app-components1-loading-loading', { text: this.state.cfgData.loading });
                const fg = await VerifyIdentidy(r);
                close.callback(close.widget);
                if (fg) {
                    this.sendRedEnv();
                } else {
                    popNew('app-components1-message-message', { content: this.state.cfgData.tips[6] });
                }
            }
        );

    }

    /**
     * 实际发红包
     */
    public async sendRedEnv() {

        const curCoin = this.state.list[this.state.selected];
        const lm = this.state.message;  // 留言
        const rtype = this.state.showPin ? LuckyMoneyType.Random : LuckyMoneyType.Normal; // 0 等额红包  1 拼手气红包
        const ctype = Number(CloudCurrencyType[curCoin.name]);  // 货币类型
        const totalAmount = Number(this.state.totalAmount);   // 红包总金额
        const totalNum = this.state.totalNum;    // 红包总个数
        const rid = await sendRedEnvlope(rtype, ctype, totalAmount, totalNum, lm);

        if (!rid) return;
        setTimeout(() => {
            this.state.oneAmount = 0;
            this.state.totalNum = 0;
            this.state.totalAmount = 0;
            this.state.message = '';
            getServerCloudBalance();// 更新余额
            setStore('activity/luckyMoney/sends', undefined);// 更新红包记录
            this.paint(true);
        },100);
        popNew('app-view-earn-redEnvelope-sendRedEnv', {
            message: lm,
            rid,
            rtype: rtype,
            cname: curCoin.name
        });


        // if (!this.state.showPin) {
        //     // tslint:disable-next-line:max-line-length
        //     console.log('url', `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        // } else {
        //     // tslint:disable-next-line:max-line-length
        //     console.log('url', `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        // }
    }

    /**
     * 输入框取消聚焦
     */
    public inputBlur() {
        const inputs: any = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].blur();
        }
    }

}
// =====================================本地
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

register('user/info/isRealUser', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRealUser();
    }
});