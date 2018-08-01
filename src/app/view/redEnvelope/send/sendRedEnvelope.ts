/**
 * send red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { redEnvelopeSupportCurrency } from '../../../utils/constants';
import { getByteLen, openBasePage } from '../../../utils/tools';

export class SendRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            inputStyle:{
                border:'none',
                textAlign:'right'
            },
            itype:1,// 1 等额红包  2 拼手气红包
            balance:this.getBalance(),
            currencyName:redEnvelopeSupportCurrency[0],
            singleAmount:0,
            redEnvelopeNumber:0,
            totalAmount:0,
            leaveMessage:'恭喜发财  万事如意',
            leaveMessageMaxLen:20
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    
    // 获取余额
    public getBalance() {
        return 100.50;
    }
    // 单个金额改变
    public singleAmountInputChange(e:any) {
        const amount = Number(e.value);
        this.state.singleAmount = amount;
        this.state.totalAmount = amount * this.state.redEnvelopeNumber;
        this.paint();
    }
    // 红包个数改变
    public redEnvelopeNumberChange(e:any) {
        const num = Number(e.value);
        this.state.redEnvelopeNumber = num;
        if (this.state.itype === 1) {
            this.state.totalAmount = num * this.state.singleAmount;
        }
        this.paint();
    }
    // 总金额改变
    public totalAmountInputChange(e:any) {
        this.state.totalAmount = Number(e.value);
        this.paint();
    }
    // 红包类型切换
    public redEnvelopeTypeSwitchClick() {
        this.state.itype = this.state.itype === 1 ? 2 : 1;
        this.state.singleAmount = 0;
        this.state.redEnvelopeNumber = 0;
        this.state.totalAmount = 0;
        this.paint();
    }
    public leaveMessageChange(e:any) {
        this.state.leaveMessage = e.value;
    }

    // 发送
    public sendRedEnvelopeClick() {
        if (this.state.itype === 1 && this.state.singleAmount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的单个红包金额',center:true });

            return;
        }
        if (this.state.itype !== 1 && this.state.totalAmount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的红包总金额',center:true });

            return;
        }
        if (this.state.redEnvelopeNumber <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送红包数量',center:true });

            return;
        }
        if (getByteLen(this.state.leaveMessage) > this.state.leaveMessageMaxLen * 2) {
            popNew('app-components-message-message',{ itype:'error',content:`留言最多${this.state.leaveMessageMaxLen}个字`,center:true });
            this.state.leaveMessage = '';
            this.paint();

            return;
        }
        popNew('app-view-redEnvelope-send-shareRedEnvelope',{
            amount:this.state.amount,
            leaveMessage:this.state.leaveMessage,
            currencyName:this.state.currencyName
        });
    }
    
    // 红包记录
    public redEnvelopeRecordsClick() {
        console.log('redEnvelopeRecordsClick');
        popNew('app-view-redEnvelope-send-redEnvelopeRecord');
        
    }
    // 选择要发红包的货币
    public async chooseCurrencyClick() {
        const index = await openBasePage('app-components-chooseCurrency-chooseCurrency',{ currencyList:redEnvelopeSupportCurrency });
        this.state.currencyName = redEnvelopeSupportCurrency[index];
        this.paint();
    }
}