/**
 * currency exchange
 */
// ============================== 导入
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { ERC20Tokens } from '../../core/eth/tokens';
import { wei2Eth } from '../../core/globalWallet';
import { beginShift, estimateMinerFee, getMarketInfo, transfer } from '../../net/pullWallet';
import { MarketInfo } from '../../store/interface';
import { find, getBorn, register, updateStore } from '../../store/store';
// tslint:disable-next-line:max-line-length
import { 
    addRecord, 
    currencyExchangeAvailable, 
    getCurrentAddrBalanceByCurrencyName,
    getCurrentAddrByCurrencyName, 
    openBasePage, 
    parseDate,
    popPswBox} from '../../utils/tools'; 

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    currencyName:string;// 出账币种
}
export class CurrencyExchange extends Widget {
    public ok:() => void;

    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        const outCurrency = this.props.currencyName;
        const inCurrency = (outCurrency === 'BTC' ||  ERC20Tokens[outCurrency]) ? 'ETH' : 'BTC';
        // ZRX   BAT
        this.state = {
            outCurrency,
            inCurrency,
            gasPrice:5000000000,
            pair:'',
            maxLimit:0,
            minimum:0,
            rate:0,
            minerFee:0,
            timer:0,
            outBalance:0,
            outAmount:0,
            receiveAmount:0,
            curOutAddr:'',
            curInAddr:''
        };
        this.init();
    }
    public destroy() {
        clearTimeout(this.state.timer);

        return super.destroy();
    }
    public init() {
        this.state.outAmount = 0;
        this.state.receiveAmount = 0;
        this.setPair();
        // 获取出币币种的余额和当前使用地址
        this.state.curOutAddr = getCurrentAddrByCurrencyName(this.state.outCurrency);
        this.state.outBalance = getCurrentAddrBalanceByCurrencyName(this.state.outCurrency);
        // 获取入币币种的当前使用地址
        this.state.curInAddr = getCurrentAddrByCurrencyName(this.state.inCurrency);
        this.marketInfoUpdated();
    }
    public backClick() {
        this.ok && this.ok();
    }
    // 设置币币兑换的pair  如btc_eth
    public setPair() {
        this.state.pair = `${this.state.outCurrency.toLowerCase()}_${this.state.inCurrency.toLowerCase()}`;
    }
    // 重置汇率相关显示
    public resetMarketInfo(marketInfo:MarketInfo) {
        this.state.maxLimit = marketInfo.maxLimit;
        this.state.minimum = marketInfo.minimum;
        this.state.rate = marketInfo.rate;
        this.state.minerFee = marketInfo.minerFee;
        this.paint();
    }
    // 定时获取兑率等信息 30s更新一次
    public marketInfoUpdated() {
        getMarketInfo(this.state.pair);
        this.state.timer = setTimeout(() => {
            this.marketInfoUpdated();
        },30 * 1000);
    }

    // 出币数量变化
    public outAmountChange(e:any) {
        const outAmount = Number(e.value);
        this.state.outAmount = outAmount;
        this.state.receiveAmount = outAmount * this.state.rate;
        this.paint();
        
    }
    // 选择出币币种 如果出币币种和入币币种一样时,入币币种顺延一种
    public outCurrencySelectClick() {
        const data = currencyExchangeAvailable();
        const dataList = [];
        data.forEach(element => {
            dataList.push(element.symbol);
        });
        popNew('app-components-chooseCurrency-chooseCurrency',{ currencyList:dataList },(r) => {
            const currencyName = dataList[r];
            if (this.state.outCurrency === currencyName) return;
            if (this.state.inCurrency === currencyName) {
                const index = dataList.indexOf(currencyName);
                this.state.inCurrency = dataList[(index + 1) % dataList.length];
            }
            this.state.outCurrency = dataList[r];
            this.state.outAmount = 0;
            this.state.receiveAmount = 0;
            this.init();
            this.paint();
        });
    }

    // 选择入币币种 如果入币币种和出币币种一样时,出币币种顺延一种
    public inCurrencySelectClick() {
        const data = currencyExchangeAvailable();
        const dataList = [];
        data.forEach(element => {
            dataList.push(element.symbol);
        });
        popNew('app-components-chooseCurrency-chooseCurrency',{ currencyList:dataList },(r) => {
            const currencyName = dataList[r];
            if (this.state.inCurrency === currencyName) return;
            if (this.state.outCurrency === currencyName) {
                const index = dataList.indexOf(currencyName);
                this.state.outCurrency = dataList[(index + 1) % dataList.length];
            }
            this.state.inCurrency = dataList[r];
            this.state.outAmount = 0;
            this.state.receiveAmount = 0;
            this.init();
            this.paint();
        });
    }
    // 出币币种和入币币种切换
    public switchInOutClick() {
        const outCurrency = this.state.outCurrency;
        this.state.outCurrency = this.state.inCurrency;
        this.state.inCurrency = outCurrency;
        this.state.outAmount = 0;
        this.state.receiveAmount = 0;
        this.init();
        this.paint();
       
    }

    public exchangeRecordClick() {
        popNew('app-view-currencyExchange-currencyExchangeRecord',{ currencyName:this.state.outCurrency });
    }
    public async rateDescClick() {
        popNew('app-view-currencyExchange-rateDescription',{ currencyName:this.state.outCurrency,
            toAddr:this.state.curOutAddr,gasPrice:this.state.gasPrice,pay:this.state.outAmount });
    }
    // tslint:disable-next-line:max-func-body-length
    public async sureClick() {
        const outAmount = this.state.outAmount;
        const outCurrency = this.state.outCurrency;
        if (outAmount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'输入发出数量',center:true });

            return;
        }
        if (outAmount >= this.state.outBalance) {
            popNew('app-components-message-message',{ itype:'error',content:'余额不足',center:true });

            return;
        }
        if (outAmount > this.state.maxLimit || outAmount < this.state.minimum) {
            popNew('app-components-message-message',{ itype:'error',content:'换币数量必须在最小数量和最大数量之间',center:true });

            return;
        }

        const loading = popNew('pi-components-loading-loading', { text: '矿工费预估中...' });
        let gasLimit = 0;
        let fee = 0;
        try {
            // tslint:disable-next-line:max-line-length
            const obj = await estimateMinerFee(outCurrency,{ toAddr:this.state.curOutAddr,gasPrice:this.state.gasPrice,pay:this.state.outAmount });
            fee = obj.minerFee;
            gasLimit = obj.gasLimit;
        } catch (err) {
            console.error(err);
        } finally {
            console.log('gasLimit',gasLimit);
            loading.callback(loading.widget);
        }
        
        await openBasePage('app-view-currencyExchange-exchangeConfirm',{
            outCurrency,
            outAmount,
            inCurrency:this.state.inCurrency,
            inAmount:outAmount * this.state.rate,
            fee
        });
        
        const wallet = find('curWallet');
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('pi-components-loading-loading', { text: '交易中...' });
        const withdrawalAddress = this.state.curInAddr; // 入账币种的地址
        const returnAddress =  this.state.curOutAddr;// 失败后的退款地址
        const pair = this.state.pair;// 交易对
        beginShift(withdrawalAddress,returnAddress,pair,async (returnData) => {
            if (returnData.error) {
                popNew('app-components-message-message',{ itype:'error',content:'出错啦,请重试！',center:true });
                close.callback(close.widget);
                this.init();
                this.paint();

                return;
            }
            const depositAddress = returnData.deposit;
                // tslint:disable-next-line:max-line-length
            const hash = await transfer(passwd,this.state.curOutAddr,depositAddress,this.state.gasPrice,gasLimit,outAmount,outCurrency);
            close.callback(close.widget);
            if (!hash) {
                return;
            }
               // tslint:disable-next-line:max-line-length
            this.setTemRecord(hash,this.state.curOutAddr,depositAddress,this.state.gasPrice,gasLimit,outAmount,outCurrency,this.state.inCurrency,this.state.rate);
            popNew('app-view-currencyExchange-currencyExchangeRecord', { currencyName:outCurrency });
            this.init();
            this.paint();
        },(err) => {
            console.error(err);
            popNew('app-components-message-message',{ itype:'error',content:'出错啦,请重试！',center:true });
            close.callback(close.widget);
            this.init();
            this.paint();

            return;
        });

    }

    // 临时记录
    // tslint:disable-next-line:max-line-length
    public setTemRecord(hash: string,fromAddr:string,toAddr:string,gasPrice:number,gasLimit:number,pay:number,outCurrency:string,inCurrency:string,rate:number) {
        const t = new Date();
        // 币币兑换交易记录
        const tx = {
            hasConfirmations:'false',
            inputAddress:fromAddr,
            inputAmount:pay,
            inputCurrency:outCurrency,
            inputTXID:hash,
            outputAddress:'',
            outputAmount:'',
            outputCurrency:inCurrency,
            outputTXID:'',
            shiftRate:rate,
            status:'pending',
            timestamp:t.getTime() / 1000
        };
        console.log('tx',tx);
        const addrLowerCase = this.state.curOutAddr.toLowerCase();
        const shapeShiftTxsMap = getBorn('shapeShiftTxsMap');
        const shapeShiftTxs =  shapeShiftTxsMap.get(addrLowerCase) || { addr:addrLowerCase,list:[] };
        shapeShiftTxs.list.push(tx);
        shapeShiftTxsMap.set(addrLowerCase,shapeShiftTxs);
        updateStore('shapeShiftTxsMap',shapeShiftTxsMap);

        // 币币兑换出货币种交易记录
        const record = {
            id: hash,
            type: '转账',
            fromAddr: fromAddr,
            to: toAddr,
            pay: pay,
            time: t.getTime(),
            showTime: parseDate(t),
            result: '交易中',
            info: '兑换',
            currencyName: outCurrency,
            tip: gasLimit * wei2Eth(gasPrice)
        };
        addRecord(outCurrency, fromAddr, record);
    }
    
}

// =====================================本地
register('shapeShiftMarketInfo', marketInfo => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.resetMarketInfo(marketInfo);
    }
});
