/**
 * sendRedEnv
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { fetchRealUser, getCloudBalance, sendRedEnvlope, sharePerUrl } from '../../../net/pull';
import { find, getBorn, register, updateStore } from '../../../store/store';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface State {
    list:any[];
    selected:number;
    showPin:boolean;
    totalAmount:number;
    // tslint:disable-next-line:no-reserved-keywords
    number:number;
    oneAmount:number;
    message:string;
    realUser:object;
}

export class WriteRedEnv extends Widget {
    public ok: () => void;
    public state:State;
    constructor() {
        super();
        
    }

    public create() {
        const realUser = getBorn('realUserMap').get(find('conUser'));
        this.state = {
            list:[],
            selected:1,
            showPin:false,
            totalAmount:0,   
            number:0,
            oneAmount:0,
            message:'恭喜发财 万事如意',
            realUser
        };
        const list = [
            { img:'../../res/image/currency/KT.png',name:'KT',num:500 },
            { img:'../../res/image/currency/BTC.png',name:'BTC',num:0.01 },
            { img:'../../res/image/currency/ETH.png',name:'ETH',num:0.5 }
        ];
        // for (const i in list) {
        //     list[i].num = find('cloudBalance', CurrencyType[list[i].name]) || 0;
            
        //     console.log(list[i].num);
        // }
        this.state.list = list;
        if (!realUser) {
            fetchRealUser();
        }
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
            this.state.totalAmount = this.state.oneAmount * this.state.number;
        }
        this.paint();
    }

    /**
     * 修改金额
     */
    public changeAmount(e:any) {
        if (this.state.showPin) {
            this.state.totalAmount = e.value;            
        } else {
            this.state.oneAmount = e.value;
            this.state.totalAmount = this.state.oneAmount * this.state.number;
        }
        this.paint();
    }

    /**
     * 修改数量
     */
    public changeNumber(e:any) {
        this.state.number = e.value;
        if (!this.state.showPin) {
            this.state.totalAmount = this.state.oneAmount * this.state.number;
        }
        this.paint();
    }

    /**
     * 切换货币
     */
    public changeCoin(e:any) {
        this.state.selected = e.selected;
        this.paint();
    }

    /**
     * 发红包
     */
    public async send() {
        if (this.state.totalAmount === 0) {
            popNew('app-components-message-message', { content: '请输入要发送红包金额' });

            return;
        }       
        if (this.state.number === 0) {
            popNew('app-components-message-message', { content: '请输入要发送红包数量' });

            return;
        }
        const curCoin = this.state.list[this.state.selected];
        if (this.state.totalAmount > curCoin.num) {
            popNew('app-components-message-message', { content: '余额不足' });

            return;
        }
        if (this.state.message.length > 20) {
            popNew('app-components-message-message', { content: '留言最多20个字' });

            return;
        }
        if (this.state.message === '') {
            this.state.message = '恭喜发财 万事如意';
        }
        // if (!this.state.realUser) {
        //     popNew('app-components-message-message', { content: '您不是真实用户' });

        //     return;
        // }
        // const close = popNew('app-components1-loading-loading', { text: '加载中...' });
        // const lm = this.state.message;
        // const rtype = this.state.showPin ? 1 :0; // 0 等额红包  1 拼手气红包
        // const ctype = Number(CurrencyType[curCoin.name]);
        // const totalAmount = Number(this.state.totalAmount);
        // // tslint:disable-next-line:no-reserved-keywords
        // const number = this.state.number;
        // const rid = await sendRedEnvlope(rtype, ctype, totalAmount, number, lm);
        // close.callback(close.widget);
        // if (!rid) return;

        this.inputBlur();
        popNew('app-view-earn-redEnvelope-sendRedEnv', { message:this.state.message });
        this.state.oneAmount = 0;
        this.state.number = 0;
        this.state.totalAmount = 0;
        this.state.message = '';
        this.paint();
        // updateStore('sHisRec', undefined);// 更新红包记录
        // getCloudBalance();// 更新余额
        // if (!this.state.showPin) {
        //     // tslint:disable-next-line:max-line-length
        //     console.log('url', `${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        // } else {
        //     // tslint:disable-next-line:max-line-length
        //     console.log('url', `${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        // }
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
// =====================================本地
register('cloudBalance', cloudBalance => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

register('realUserMap',realUserMap => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRealUser(realUserMap);
    }
});