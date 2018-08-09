/**
 * send red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { cloudAccount } from '../../../store/cloudAccount';
import { CurrencyType, RedEnvelopeType, sendRedEnvlope, sharePerUrl } from '../../../store/conMgr';
import { register, unregister } from '../../../store/store';
import { redEnvelopeSupportCurrency } from '../../../utils/constants';
import { getByteLen , openBasePage, removeLocalStorage } from '../../../utils/tools';

export class SendRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            itype:0,// 0 等额红包  1 拼手气红包
            balance:0,
            currencyName:redEnvelopeSupportCurrency[0],
            singleAmount:'',
            redEnvelopeNumber:0,
            totalAmount:'',
            leaveMessage:'',
            lmPlaceHolder:'恭喜发财  万事如意',
            leaveMessageMaxLen:20
        };
        this.updateBalance();
        register('cloudBalance',cloudBalance => {
            this.updateBalance();
        });
    }
    public destroy() {
        unregister('cloudBalance',null);

        return super.destroy();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    
    // 获取余额
    public updateBalance() {
        this.state.balance = cloudAccount.cloudBalance[this.state.currencyName];
        this.paint();
    }
    // 单个金额改变
    public singleAmountInputChange(e:any) {
        this.state.singleAmount = e.value;
        this.state.totalAmount = String(Number(e.value) * this.state.redEnvelopeNumber);
        this.paint();
    }
    // 红包个数改变
    public redEnvelopeNumberChange(e:any) {
        const num = Number(e.value);
        this.state.redEnvelopeNumber = num;
        if (this.state.itype === 0) {
            this.state.totalAmount = String(num * Number(this.state.singleAmount));
        }
        this.paint();
    }
    // 总金额改变
    public totalAmountInputChange(e:any) {
        this.state.totalAmount = e.value;
        this.paint();
    }
    // 红包类型切换
    public redEnvelopeTypeSwitchClick() {
        this.state.itype = this.state.itype === 0 ? 1 : 0;
        this.state.singleAmount = '';
        this.state.redEnvelopeNumber = 0;
        this.state.totalAmount = '';
        this.paint();
    }
    public leaveMessageChange(e:any) {
        this.state.leaveMessage = e.value;
        this.paint();
    }

    // 发送
    public async sendRedEnvelopeClick() {
        if (this.state.itype === 0 && Number(this.state.singleAmount) <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的单个红包金额',center:true });

            return;
        }
        if (this.state.itype !== 0 && Number(this.state.totalAmount) <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的红包总金额',center:true });

            return;
        }
        if (this.state.redEnvelopeNumber <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送红包数量',center:true });

            return;
        }
        if (Number(this.state.totalAmount) > this.state.balance) {
            popNew('app-components-message-message',{ itype:'error',content:'余额不足',center:true });

            return;
        }
        if (getByteLen(this.state.leaveMessage) > this.state.leaveMessageMaxLen * 2) {
            popNew('app-components-message-message',{ itype:'error',content:`留言最多${this.state.leaveMessageMaxLen}个字`,center:true });
            this.state.leaveMessage = '';
            this.paint();

            return;
        }
        const close = popNew('pi-components-loading-loading',{ text:'加载中...' });
        const lm = this.state.leaveMessage || this.state.lmPlaceHolder;
        const rtype = this.state.itype;
        const ctype = Number(CurrencyType[this.state.currencyName]);
        const totalAmount = Number(this.state.totalAmount);
        const redEnvelopeNumber = this.state.redEnvelopeNumber;
        const res = await sendRedEnvlope(rtype,ctype,totalAmount,redEnvelopeNumber,lm);
        close.callback(close.widget);
        if (res.result === 1) {
            popNew('app-view-redEnvelope-send-shareRedEnvelope',{
                rid:res.value,
                rtype:this.state.itype,
                leaveMessage:this.state.leaveMessage || this.state.lmPlaceHolder,
                currencyName:this.state.currencyName
            });
            this.state.singleAmount = '';
            this.state.redEnvelopeNumber = 0;
            this.state.totalAmount = '';
            this.state.leaveMessage = '';
            this.paint();
            removeLocalStorage('sendRedEnvelopeHistoryRecord');
            cloudAccount.updateBalance();
            if (this.state.itype === 0) {
                // tslint:disable-next-line:max-line-length
                console.log('url',`${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${res.value}&lm=${(<any>window).encodeURIComponent(lm)}`);
            } else {
                // tslint:disable-next-line:max-line-length
                console.log('url',`${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${res.value}&lm=${(<any>window).encodeURIComponent(lm)}`);
            }
            
        } else {
            popNew('app-components-message-message',{ itype:'error',content:'出错啦,请重试',center:true });
        }
        
    }
    
    // 红包记录
    public redEnvelopeRecordsClick() {
        this.inputBlur();
        popNew('app-view-redEnvelope-send-redEnvelopeRecord');
        
    }
    // 选择要发红包的货币
    public async chooseCurrencyClick() {
        // tslint:disable-next-line:max-line-length
        const index = await openBasePage('app-components-chooseCurrency-chooseCurrency',{ currencyList:redEnvelopeSupportCurrency,balance:cloudAccount.cloudBalance });
        this.state.currencyName = redEnvelopeSupportCurrency[index];
        this.updateBalance();
        this.paint();
    }

    public inputBlur() {
        const inputs: any = document.querySelectorAll('.pi-input-simple__inner');
        inputs.forEach(input => {
            input.blur();
        });
    }
}
