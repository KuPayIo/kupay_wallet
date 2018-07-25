/**
 * currency exchange
 */
import { shapeshift } from '../../../app/exchange/shapeshift/shapeshift';
import { currencyExchangeAvailable, getCurrentWallet, getLocalStorage } from '../../../app/utils/tools'; 
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    outCurrency?:string;// 出账币种
    inCurrency?:string;// 入账币种
}
export class CurrencyExchange extends Widget {
    public create() {
        super.create();
        this.init();
    }

    public init() {
        setTimeout(() => {
            console.log(currencyExchangeAvailable());
        },5000);
        this.state = {
            outCurrency:this.props && this.props.outCurrency ? this.props.outCurrency : 'ETH',
            inCurrency:this.props && this.props.inCurrency ? this.props.inCurrency : 'BAT',
            pair:'',
            maxLimit:0,
            minimum:0,
            rate:0,
            timer:0,
            balance:0,
            amount:0,
            receiveAmount:0,
            curAddr:''
        };
        this.setPair();
        this.getOutCurrencyBalance();
        this.marketInfoUpdated();
    }

    public setPair() {
        this.state.pair = `${this.state.outCurrency.toLowerCase()}_${this.state.inCurrency.toLowerCase()}`;
    }

    public marketInfoUpdated() {
        shapeshift.marketInfo(this.state.pair, (err, marketInfo) => {
            console.log('marketInfo',marketInfo);
            if (err) {
                console.log(err);
                
                return;
            }
            this.state.maxLimit = marketInfo.maxLimit;
            this.state.minimum = marketInfo.minimum;
            this.state.rate = marketInfo.rate;
            this.paint();
        });
        this.state.timer = setTimeout(() => {
            this.marketInfoUpdated();
        },10 * 1000);
    }

    public getOutCurrencyBalance() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const currencyRecords = wallet.currencyRecords;
        let curAddr = '';

        for (let i = 0; i < currencyRecords.length; i ++) {
            if (currencyRecords[i].currencyName === this.state.outCurrency) {
                curAddr = currencyRecords[i].currentAddr;
                break;
            }
        }
        const addrs = getLocalStorage('addrs');
        for (let i = 0; i < addrs.length; i++) {
            if ((addrs[i].currencyName === this.state.outCurrency) && (addrs[i].addr === curAddr)) {
                this.state.balance = addrs[i].balance;
                this.paint();
                break;
            }
        }
        this.state.curAddr = curAddr;
    }

    public amountChange(e:any) {
        const amount = Number(e.value);
        this.state.amount = amount;
        this.state.receiveAmount = amount * this.state.rate;
        this.paint();
    }

    public sureClick() {
        const amount = this.state.amount;
        const options = {
            returnAddress: this.state.curAddr, // 失败后的退款地址
            amount: this.state.receiveAmount // <---- must set amount here
        };
        // 0x958B0bA923260A91Ffd28e8E9a209240648066C2
        const withdrawalAddress = this.state.curAddr; // 入账币种的地址
        // const close = popNew('pi-components-loading-loading', { text: '等待中...' });
        shapeshift.shift(withdrawalAddress, this.state.pair, options, (err, returnData) => {
            console.log('returnData',returnData);
          // ShapeShift owned BTC address that you send your BTC to
            const depositAddress = returnData.deposit;
        
          // NOTE: `depositAmount`, `expiration`, and `quotedRate` are only returned if
          // you set `options.amount`
        
          // amount to send to ShapeShift (type string)
            const shiftAmount = returnData.depositAmount;
        
          // Time before rate expires (type number, time from epoch in seconds)
            const expiration = new Date(returnData.expiration * 1000);
        
          // rate of exchange, 1 BTC for ??? LTC (type string)
            const rate = returnData.quotedRate;
          // you need to actually then send your BTC to ShapeShift
          // you could use module `spend`: https://www.npmjs.com/package/spend
          // CONVERT AMOUNT TO SATOSHIS IF YOU USED `spend`
          // spend(SS_BTC_WIF, depositAddress, shiftAmountSatoshis, function (err, txId) { /.. ../ })
        
          // later, you can then check the deposit status
           /*  shapeshift.status(depositAddress, (err, status, data) => {
                console.log('status',status); // => should be 'received' or 'complete'
            }); */

            popNew('app-components-message-messageboxPrompt',{ title:'请输入密码' },(r) => {
                const psw = r;
                
            });
        });
    }
}