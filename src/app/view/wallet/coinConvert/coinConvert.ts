/**
 * coinconvert
 */
// =======================================导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { changellyCreateTransaction, changellyGetExchangeAmount, changellyGetMinAmount } from '../../../net/pull3';
import { transfer, transfer1, transfer3, TxPayload, TxPayload3 } from '../../../net/pullWallet';
import { ChangellyPayinAddr, ChangellyTempTxs, MinerFeeLevel, TxHistory, TxStatus, TxType } from '../../../store/interface';
import { getStore, register, setStore } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, fetchMinerFeeList, getCurrentAddrByCurrencyName, getCurrentAddrInfo, popNewMessage, popPswBox } from '../../../utils/tools';
// =========================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    currencyName:string;
}
export class CoinConvert extends Widget {
    public props:any;
    public ok: () => void;
    public language:any;

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看手续费介绍
     */
    public rateDetail() {
        const outCurrency = this.props.outCurrency;
        const minerFeeLevel = MinerFeeLevel.Standard;
        const minerFeeList = fetchMinerFeeList(this.props.outCurrency);
        const fee = minerFeeList[minerFeeLevel].minerFee;
        const cn = (outCurrency === 'ETH' || ERC20Tokens[outCurrency]) ? 'ETH' : 'BTC';
        const tips = `${this.language.tips[5]} ${fee} ${cn}`;
        popNew('app-components-allModalBox-modalBox1',{ title:this.language.title,content:this.language.content,tips:tips });
    }

    /**
     * 查看兑换历史
     */
    public goHistory() {
        popNew('app-view-wallet-coinConvert-convertHistory',{ currencyName:this.props.outCurrency,addr:this.props.curOutAddr });
    }

    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        const dataList = currencyExchangeAvailable();
        const canCurrencyExchange = dataList.indexOf(props.currencyName) >= 0;

        const outCurrency = canCurrencyExchange ? props.currencyName : 'ETH';
        const inCurrency = (outCurrency === 'BTC' ||  ERC20Tokens[outCurrency]) ? 'ETH' : 'BTC';
        // ZRX   BAT
        this.props = {
            ...this.props,
            outCurrency,
            inCurrency,
            pair:'',
            minimum:0,
            rate:0,
            outMinerFee:0,
            inMinerFee:0,
            timer:0,
            outBalance:0,
            outAmount:0,
            receiveAmount:0,
            curOutAddr:'',
            curInAddr:''
        };
        this.init();
        this.updateMinerFee();
    }

    // 更新矿工费
    public async updateMinerFee() {
        const minerFeeList = fetchMinerFeeList(this.props.currencyName);
        console.log(minerFeeList);
        // const gasLimit = obj.gasLimit;
        this.props.outMinerFee = minerFeeList[0].minerFee;
        this.paint();
    }

    public destroy() {
        clearTimeout(this.props.timer);

        return super.destroy();
    }
    public init() {
        this.props.outAmount = 0;
        this.props.receiveAmount = 0;
        this.setPair();
        // 获取出币币种的余额和当前使用地址
        this.props.curOutAddr = getCurrentAddrByCurrencyName(this.props.outCurrency);
        this.props.outBalance = getCurrentAddrInfo(this.props.outCurrency).balance;
        // 获取入币币种的当前使用地址
        this.props.curInAddr = getCurrentAddrByCurrencyName(this.props.inCurrency);
        this.marketInfoUpdated();
    }
    
    // 设置币币兑换的pair  如btc_eth
    public setPair() {
        this.props.pair = `${this.props.outCurrency.toLowerCase()}_${this.props.inCurrency.toLowerCase()}`;
        // this.props.pair = `${this.props.outCurrency}_${this.props.inCurrency}`;
    }
    
    // 定时获取兑率等信息 30s更新一次
    public marketInfoUpdated() {
        changellyGetExchangeAmount(this.props.outCurrency,this.props.inCurrency).then(res => {
            if (res.result) {
                this.props.rate = Number(res.result).toFixed(8);
                this.paint();
                console.log('changellyGetExchangeAmount = ',res);
            }
        });
        changellyGetMinAmount(this.props.outCurrency,this.props.inCurrency).then(res => {
            if (res.result) {
                this.props.minimum = Number(res.result).toFixed(8);
                this.paint();
                console.log('changellyGetMinAmount = ',res);
            }
        });
        clearTimeout(this.props.timer);
        this.props.timer = setTimeout(() => {
            this.marketInfoUpdated();
        },30 * 1000);
    }

    // 出币数量变化
    public outAmountChange(e:any) {
        const outAmount = Number(e.value);
        this.props.outAmount = outAmount;
        this.props.receiveAmount = (outAmount * this.props.rate).toFixed(8);
        this.paint();
    }

    // 入币数量变化
    public inAmountChange(e:any) {
        const receiveAmount = Number(e.value);
        this.props.receiveAmount = receiveAmount;
        this.props.outAmount = (receiveAmount / this.props.rate).toFixed(8);
        this.paint();
    }

    // // 选择出币币种 如果出币币种和入币币种一样时,入币币种顺延一种
    // public outCurrencySelectClick() {
    //     const data = currencyExchangeAvailable();
    //     const dataList = [];
    //     data.forEach(element => {
    //         dataList.push(element.symbol);
    //     });
    //     popNew('app-components-chooseCurrency-chooseCurrency',{ list:dataList,selected:dataList.indexOf(this.props.outCurrency) },
    //     (r) => {
    //         const currencyName = dataList[r];
    //         if (this.props.outCurrency === currencyName) return;
    //         if (this.props.inCurrency === currencyName) {
    //             const index = dataList.indexOf(currencyName);
    //             this.props.inCurrency = dataList[(index + 1) % dataList.length];
    //         }
    //         this.props.outCurrency = dataList[r];
    //         this.props.outAmount = 0;
    //         this.props.receiveAmount = 0;
    //         this.init();
    //         this.paint();
    //     });
    // }

    // 选择入币币种 如果入币币种和出币币种一样时,出币币种顺延一种
    public inCurrencySelectClick() {
        const dataList = currencyExchangeAvailable();
        popNew('app-components-chooseCurrency-chooseCurrency',{ list:dataList,selected:dataList.indexOf(this.props.inCurrency) },(r) => {
            const currencyName = dataList[r];
            if (this.props.inCurrency === currencyName) return;
            if (this.props.outCurrency === currencyName) {
                const index = dataList.indexOf(currencyName);
                this.props.outCurrency = dataList[(index + 1) % dataList.length];
            }
            this.props.inCurrency = dataList[r];
            this.props.outAmount = 0;
            this.props.receiveAmount = 0;
            this.init();
            this.paint();
        });
    }
    
    // 出币币种和入币币种切换
    public switchInOutClick() {
        const outCurrency = this.props.outCurrency;
        this.props.outCurrency = this.props.inCurrency;
        this.props.inCurrency = outCurrency;
        this.props.outAmount = 0;
        this.props.receiveAmount = 0;
        this.init();
        this.paint();
    }

    /**
     * 点击兑换
     */
    public async sureClick() {
        const outAmount = this.props.outAmount;
        const outCurrency = this.props.outCurrency;
        const inCurrency = this.props.inCurrency;
        if (outAmount <= 0) {
            popNewMessage(this.language.messages[0]);

            return;
        }
        // if (outAmount >= this.props.outBalance) {
        //     popNewMessage(this.language.messages[1]);

        //     return;
        // }
        if (outAmount < this.props.minimum) {
            popNewMessage(this.language.messages[2]);

            return;
        }
        // tslint:disable-next-line:max-line-length
        const content = [this.language.tips[6] + outAmount + outCurrency,this.language.tips[7] + this.props.receiveAmount + this.props.inCurrency];
        const passwd = await popPswBox(content);
        if (!passwd) return;
        
        const close = popNew('app-components1-loading-loading', { text: this.language.loading });
        const withdrawalAddress = this.props.curInAddr; // 入账币种的地址
        const returnAddress =  this.props.curOutAddr;// 失败后的退款地址
        changellyCreateTransaction(outCurrency,inCurrency,withdrawalAddress,outAmount,returnAddress).then(res => {
            console.log('changellyCreateTransaction = ',res);
            if (res.result) {
                const payinAddress = res.result.payinAddress;
                const minerFeeLevel = MinerFeeLevel.Standard;
                const minerFeeList = fetchMinerFeeList(outCurrency);
                const fee = minerFeeList[minerFeeLevel].minerFee;
                const payload:TxPayload = {
                    fromAddr:returnAddress,        
                    toAddr:payinAddress,         
                    pay:outAmount,            
                    currencyName:outCurrency, 
                    fee,             
                    minerFeeLevel
                };
                this.props.inMinerFee = fee;
                // close && close.callback(close.widget);
                const changellyPayinAddress = getStore('wallet/changellyPayinAddress');
                const tmp:ChangellyPayinAddr = {
                    currencyName:outCurrency,
                    payinAddress
                };
                const index = changellyPayinAddress.findIndex(item => {
                    return item.currencyName === tmp.currencyName && item.payinAddress === tmp.payinAddress;
                });
                if (index < 0) {
                    changellyPayinAddress.push(tmp);
                    setStore('wallet/changellyPayinAddress',changellyPayinAddress);
                }
                
                transfer1(passwd,payload).then(([err,hash]) => {
                    close && close.callback(close.widget);
                    if (err) {
                        popNewMessage(this.language.messages[3]);
                    } else {
                        popNewMessage(this.language.messages[4]);
                    }
                    const changellyTempTxs = getStore('wallet/changellyTempTxs');
                    const tempTxs:ChangellyTempTxs = {
                        hash,
                        id:res.result.id
                    };
                    changellyTempTxs.push(tempTxs);
                    setStore('wallet/changellyTempTxs',changellyTempTxs);
                });
            } else {
                close && close.callback(close.widget);
                popNewMessage(this.language.messages[3]);
            }
        }).catch(err => {
            console.log(err);
            close && close.callback(close.widget);
            popNewMessage(this.language.messages[3]);
        });
    }
    
}
