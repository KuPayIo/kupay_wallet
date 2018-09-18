/**
 * coinconvert
 */
// =======================================导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { beginShift, estimateMinerFee, getMarketInfo, transfer } from '../../../net/pullWallet';
import { MarketInfo, TransRecordLocal } from '../../../store/interface';
import { find, getBorn, register, updateStore } from '../../../store/store';
// tslint:disable-next-line:max-line-length
import { addRecord, currencyExchangeAvailable, fetchGasPrice, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, openBasePage, parseDate, popPswBox } from '../../../utils/tools';
import { wei2Eth } from '../../../utils/unitTools';
// =========================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class CoinConvert extends Widget {
    public ok: () => void;
    
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看手续费介绍
     */
    public rateDetail() {
        // tslint:disable-next-line:prefer-template
        const tips = '矿工费 ' + this.state.minerFee + ' ' + this.state.inCurrency;
        // tslint:disable-next-line:max-line-length
        popNew('app-components-modalBox-modalBox1',{ title:'汇率说明',content:'换币服务由shapeshift平台提供支持，换币汇率取决于国内外主流交易平台的实时相对价格，另外加上矿工费用及shapeshift平台收取的约0.5%服务费用。换币实际所得数量会因为实时价格有所浮动。换币矿工费会通过计算近期交易中矿工费得出',tips:tips });
    }

    /**
     * 查看兑换历史
     */
    public goHistory() {
        popNew('app-view-wallet-coinConvert-convertHistory',{ currencyName:this.state.outCurrency });
    }

    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        const data = currencyExchangeAvailable();
        const dataList = [];
        data.forEach(element => {
            dataList.push(element.symbol);
        });
        const canCurrencyExchange = dataList.indexOf(props.currencyName) >= 0;

        const outCurrency = canCurrencyExchange ? props.currencyName : 'ETH';
        const inCurrency = (outCurrency === 'BTC' ||  ERC20Tokens[outCurrency]) ? 'ETH' : 'BTC';
        // ZRX   BAT
        this.state = {
            outCurrency,
            inCurrency,
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
        this.state.receiveAmount = (outAmount * this.state.rate).toFixed(8);
        this.paint();
    }

    // 入币数量变化
    public inAmountChange(e:any) {
        const receiveAmount = Number(e.value);
        this.state.receiveAmount = receiveAmount;
        this.state.outAmount = (receiveAmount / this.state.rate).toFixed(8);
        this.paint();
    }

    // // 选择出币币种 如果出币币种和入币币种一样时,入币币种顺延一种
    // public outCurrencySelectClick() {
    //     const data = currencyExchangeAvailable();
    //     const dataList = [];
    //     data.forEach(element => {
    //         dataList.push(element.symbol);
    //     });
    //     popNew('app-components-chooseCurrency-chooseCurrency',{ list:dataList,selected:dataList.indexOf(this.state.outCurrency) },
    //     (r) => {
    //         const currencyName = dataList[r];
    //         if (this.state.outCurrency === currencyName) return;
    //         if (this.state.inCurrency === currencyName) {
    //             const index = dataList.indexOf(currencyName);
    //             this.state.inCurrency = dataList[(index + 1) % dataList.length];
    //         }
    //         this.state.outCurrency = dataList[r];
    //         this.state.outAmount = 0;
    //         this.state.receiveAmount = 0;
    //         this.init();
    //         this.paint();
    //     });
    // }

    // 选择入币币种 如果入币币种和出币币种一样时,出币币种顺延一种
    public inCurrencySelectClick() {
        const data = currencyExchangeAvailable();
        const dataList = [];
        data.forEach(element => {
            if (element.symbol !== this.state.outCurrency) { // 去掉出币币种
                dataList.push(element.symbol);
            }
        });
        popNew('app-components-chooseCurrency-chooseCurrency',{ list:dataList,selected:dataList.indexOf(this.state.inCurrency) },(r) => {
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

    /**
     * 点击兑换
     */
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

        const loading = popNew('app-components1-loading-loading', { text: '矿工费预估中...' });
        let gasLimit = 0;
        let fee = 0;
        const gasPrice = fetchGasPrice(GasPriceLevel.STANDARD);
        try {
            const obj = await estimateMinerFee(outCurrency,{ toAddr:this.state.curOutAddr,gasPrice,pay:this.state.outAmount });
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
        const close = popNew('app-components_level_1-loading-loading', { text: '交易中...' });
        const withdrawalAddress = this.state.curInAddr; // 入账币种的地址
        const returnAddress =  this.state.curOutAddr;// 失败后的退款地址
        const pair = this.state.pair;// 交易对
        beginShift(withdrawalAddress,returnAddress,pair,async (returnData) => {
            if (returnData.error) {
                popNew('app-components-message-message',{ content:'出错啦' });
                close.callback(close.widget);
                this.init();
                this.paint();

                return;
            }
            const depositAddress = returnData.deposit;
            const ret = await transfer(passwd,this.state.curOutAddr,depositAddress,this.state.gasPrice,gasLimit,outAmount,outCurrency);
            close.callback(close.widget);
            if (!ret) {
                return;
            }
            const hash = ret.hash;
            const nonce = ret.nonce;
               // tslint:disable-next-line:max-line-length
            this.setTemRecord(hash,this.state.curOutAddr,depositAddress,this.state.gasPrice,gasLimit,outAmount,nonce,outCurrency,this.state.inCurrency,this.state.rate);
            popNew('app-view-currencyExchange-currencyExchangeRecord', { currencyName:outCurrency });
            this.init();
            this.paint();
        },(err) => {
            console.error(err);
            popNew('app-components-message-message',{ itype:'error',content:'出错啦',center:true });
            close.callback(close.widget);
            this.init();
            this.paint();

            return;
        });

    }

    // 临时记录
    // tslint:disable-next-line:max-line-length
    public setTemRecord(hash: string,fromAddr:string,toAddr:string,gasPrice:number,gasLimit:number,pay:number,nonce:number,outCurrency:string,inCurrency:string,rate:number) {
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
        const record:TransRecordLocal = {
            hash,
            type: '转账',
            fromAddr: fromAddr,
            toAddr: toAddr,
            pay: pay,
            time: t.getTime(),
            showTime: parseDate(t),
            result: '交易中',
            info: '',
            currencyName: outCurrency,
            fee: wei2Eth(gasLimit * gasPrice),
            nonce,
            gasPriceLevel:GasPriceLevel.STANDARD
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