/**
 * sendRedEnv
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { fetchRealUser, getCloudBalance, sendRedEnvlope, sharePerUrl } from '../../../net/pull';
import { CurrencyType, RedEnvelopeType } from '../../../store/interface';
import { find, getBorn, register, updateStore } from '../../../store/store';
import { VerifyIdentidy } from '../../../utils/walletTools';
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
    totalNum:number;
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
            selected:0,
            showPin:false,
            totalAmount:0,   
            totalNum:0,
            oneAmount:0,
            message:'',
            realUser
        };
        const list = [
            { img:'../../res/image/currency/KT.png',name:'KT',num:500 },
            { img:'../../res/image/currency/BTC.png',name:'BTC',num:0.01 },
            { img:'../../res/image/currency/ETH.png',name:'ETH',num:0.5 }
        ];
        const data = getBorn('cloudBalance');
        for (const i in list) {
            list[i].num = data.get(CurrencyType[list[i].name]) || 0;
        }
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
            this.state.totalAmount = this.state.oneAmount * this.state.totalNum;
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
            this.state.totalAmount = this.state.oneAmount * this.state.totalNum;
        }
        this.paint();
    }

    /**
     * 修改数量
     */
    public changeNumber(e:any) {
        this.state.totalNum = Number(e.value);
        if (!this.state.showPin) {
            this.state.totalAmount = this.state.oneAmount * this.state.totalNum;
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
     * 点击发红包按钮
     */
    public async send() {
        if (this.state.totalAmount === 0) {
            popNew('app-components-message-message', { content: '请输入要发送红包金额' });

            return;
        }       
        if (this.state.totalNum === 0) {
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
        if (!this.state.realUser) {
            popNew('app-components-message-message', { content: '您不是真实用户' });

            return;
        }

        this.inputBlur();
        // tslint:disable-next-line:prefer-template
        const mess1 = '发出：' + this.state.totalAmount + curCoin.name + '个';
        // tslint:disable-next-line:prefer-template
        const mess2 = '类型：' + (this.state.showPin ? '普通红包' :'拼手气红包');
        popNew('app-components-modalBoxInput-modalBoxInput',{ 
            // tslint:disable-next-line:prefer-template
            title: curCoin.name + '红包',
            content:[mess1,mess2],
            placeholder:'输入密码',
            itype:'password' }, 
            async (r) => {
                const close = popNew('app-components1-loading-loading', { text: '红包准备中...' });
                const wallet = find('curWallet');
                const fg = await VerifyIdentidy(wallet,r);
                if (fg) {
                    this.sendRedEnv();
                    close.callback(close.widget);

                } else {
                    popNew('app-components-message-message',{ content:'密码错误，请重新输入' });
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
        const rtype = this.state.showPin ? 1 :0; // 0 等额红包  1 拼手气红包
        const ctype = Number(CurrencyType[curCoin.name]);  // 货币类型
        const totalAmount = Number(this.state.totalAmount);   // 红包总金额
        const totalNum = this.state.totalNum;    // 红包总个数
        const rid = await sendRedEnvlope(rtype, ctype, totalAmount, totalNum, lm);
        
        if (!rid) return;
    
        popNew('app-view-earn-redEnvelope-sendRedEnv', { 
            message:this.state.message,
            rid,
            rtype:rtype,
            cname:curCoin.name 
        });
        this.state.oneAmount = 0;
        this.state.totalNum = 0;
        this.state.totalAmount = 0;
        this.state.message = '';
        this.paint();
        updateStore('sHisRec', undefined);// 更新红包记录
        getCloudBalance();// 更新余额
        if (!this.state.showPin) {
            // tslint:disable-next-line:max-line-length
            console.log('url', `${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        } else {
            // tslint:disable-next-line:max-line-length
            console.log('url', `${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        }
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