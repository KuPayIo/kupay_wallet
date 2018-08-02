/**
 * currency exchange
 */
import { shapeshift } from '../../../app/exchange/shapeshift/shapeshift';
// tslint:disable-next-line:max-line-length
import { 
    currencyExchangeAvailable, 
    eth2Wei, 
    ethTokenMultiplyDecimals,
    getAddrById, 
    getCurrentAddrBalanceByCurrencyName,
    getCurrentAddrByCurrencyName,
    getCurrentWallet,
    getLocalStorage, 
    openBasePage, 
    parseDate, 
    resetAddrById, 
    setLocalStorage, 
    wei2Eth} from '../../../app/utils/tools'; 
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { BtcApi } from '../../core/btc/api';
import { BTCWallet } from '../../core/btc/wallet';
import { Api as EthApi } from '../../core/eth/api';
import { ERC20Tokens } from '../../core/eth/tokens';
import { EthWallet } from '../../core/eth/wallet';
import { GlobalWallet } from '../../core/globalWallet';
import { dataCenter } from '../../store/dataCenter';
import { shapeshiftApiPublicKey } from '../../utils/constants';

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

    // 定时获取兑率等信息 30s更新一次
    public marketInfoUpdated() {
        shapeshift.marketInfo(this.state.pair, (err, marketInfo) => {
            // console.log('marketInfo',marketInfo);
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
        const outCurrency = this.state.outCurrency;
        let gasLimit = 0;
        let fee = 0;
        if (outCurrency === 'ETH') {
            gasLimit = await estimateGasETH(this.state.curOutAddr);
            fee = gasLimit * wei2Eth(this.state.gasPrice);
        } else if (outCurrency === 'BTC') {
            gasLimit = 0;
            fee = 0;
        } else if (ERC20Tokens[outCurrency]) {
            gasLimit = await estimateGasERC20(outCurrency,this.state.curOutAddr,this.state.outAmount * this.state.rate);
            fee = gasLimit * wei2Eth(this.state.gasPrice);
        }
        popNew('app-view-currencyExchange-rateDescription',{ fee });
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
        if (outCurrency === 'ETH') {
            gasLimit = await estimateGasETH(this.state.curOutAddr);
            fee = gasLimit * wei2Eth(this.state.gasPrice);
        } else if (outCurrency === 'BTC') {
            gasLimit = 0;
            fee = 0;
        } else if (ERC20Tokens[outCurrency]) {
            gasLimit = await estimateGasERC20(outCurrency,this.state.curOutAddr,this.state.outAmount * this.state.rate);
            // 临时解决方案
            gasLimit  = gasLimit * 2;
            fee = gasLimit * wei2Eth(this.state.gasPrice);
        }
        console.log('gasLimit',gasLimit);
        loading.callback(loading.widget);
        await openBasePage('app-view-currencyExchange-exchangeConfirm',{
            outCurrency,
            outAmount,
            inCurrency:this.state.inCurrency,
            inAmount:outAmount * this.state.rate,
            fee
        });
        
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        let passwd;
        if (!dataCenter.getHash(wallet.walletId)) {
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', inputType: 'password'
            });
        }
        const close = popNew('pi-components-loading-loading', { text: '交易中...' });
        const options = {
            returnAddress: this.state.curOutAddr,// 失败后的退款地址
            apiKey:shapeshiftApiPublicKey
                // amount: this.state.receiveAmount // <---- must set amount here
        };
            // 0x958B0bA923260A91Ffd28e8E9a209240648066C2
        const withdrawalAddress = this.state.curInAddr; // 入账币种的地址
        shapeshift.shift(withdrawalAddress, this.state.pair, options, async (err, returnData) => {
            console.log('returnData',returnData);
            // ShapeShift owned BTC address that you send your BTC to
            const depositAddress = returnData.deposit;
            
            // NOTE: `depositAmount`, `expiration`, and `quotedRate` are only returned if
            // you set `options.amount`
    
            // amount to send to ShapeShift (type string)
            // const shiftAmount = returnData.depositAmount;
    
            // Time before rate expires (type number, time from epoch in seconds)
            // const expiration = new Date(returnData.expiration * 1000);
    
            // rate of exchange, 1 BTC for ??? LTC (type string)
            // const rate = returnData.quotedRate;
            // you need to actually then send your BTC to ShapeShift
            // you could use module `spend`: https://www.npmjs.com/package/spend
            // CONVERT AMOUNT TO SATOSHIS IF YOU USED `spend`
            // spend(SS_BTC_WIF, depositAddress, shiftAmountSatoshis, function (err, txId) { /.. ../ })
    
            // later, you can then check the deposit status
            // tslint:disable-next-line:max-line-length
            const hash = await this.transfer(passwd,this.state.curOutAddr,depositAddress,this.state.gasPrice,gasLimit,outAmount,outCurrency);
            // tslint:disable-next-line:max-line-length
            this.setTemporaryRecord(hash,this.state.curOutAddr,depositAddress,this.state.gasPrice,gasLimit,outAmount,outCurrency,this.state.inCurrency,this.state.rate);
            popNew('app-view-currencyExchange-currencyExchangeRecord', { currencyName:outCurrency });
            close.callback(close.widget);
            this.init();
            this.paint();
        });
    }

    // tslint:disable-next-line:max-line-length
    public async transfer(psw:string,fromAddr:string,toAddr:string,gasPrice:number,gasLimit:number,pay:number,currencyName:string,info ? :string) {
        // tslint:disable-next-line:no-this-assignment
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        let id: string;
        try {
            const addrIndex = GlobalWallet.getWltAddrIndex(wallet, fromAddr, currencyName);
            if (addrIndex >= 0) {
                const wlt = await GlobalWallet.createWlt(currencyName, psw, wallet, addrIndex);
                if (currencyName === 'ETH') {
                    id = await doEthTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, eth2Wei(pay), info);
                } else if (currencyName === 'BTC') {
                    id = await doBtcTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, pay, info);
                } else if (ERC20Tokens[currencyName]) {
                    id = await doERC20TokenTransfer(<any>wlt, fromAddr, toAddr, gasPrice, gasLimit, pay, currencyName);
                }
            }
            console.log('transfer hash',id);
        } catch (error) {
            console.log(error.message);
            if (error.message.indexOf('insufficient funds') >= 0) {
                popNew('app-components-message-message', { itype: 'error', content: '余额不足', center: true });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: error.message, center: true });
            }
        }

        return id;
    }
    // 临时记录
    // tslint:disable-next-line:max-line-length
    public setTemporaryRecord(hash: string,fromAddr:string,toAddr:string,gasPrice:number,gasLimit:number,pay:number,outCurrency:string,inCurrency:string,rate:number) {
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
        const currencyExchangeTxs = getLocalStorage('currencyExchangeTxs') || {};
        currencyExchangeTxs[this.state.curOutAddr.toLowerCase()].push(tx);
        setLocalStorage('currencyExchangeTxs',currencyExchangeTxs);

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
/**
 * 添加记录
 */
const addRecord = (currencyName, currentAddr, record) => {
    const addr = getAddrById(currentAddr, currencyName);
    if (!addr) return;
    addr.record.push(record);

    resetAddrById(currentAddr, currencyName, addr, true);
};
/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doEthTransfer(wlt: EthWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, info: string) {
    const api = new EthApi();
    const nonce = await api.getTransactionCount(acct1);
    const txObj = {
        to: acct2,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: value,
        data: info
    };

    // const currentAddr = getAddrById(acct1, 'ETH');
    // if (!currentAddr) return;

    // const wlt = EthWallet.fromJSON(currentAddr.wlt);

    const tx = wlt.signRawTransaction(txObj);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const id = await api.sendRawTransaction(tx);

    return id;
}

/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doBtcTransfer(wlt: BTCWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, info: string) {
    const addrs = getLocalStorage('addrs');
    const addr = addrs.filter(v => v.addr === acct1)[0];
    const output = {
        toAddr: acct2,
        amount: value,
        chgAddr: acct1
    };
    wlt.unlock();
    await wlt.init();

    const retArr = await wlt.buildRawTransaction(output, 'medium');
    wlt.lock();
    const rawHexString: string = retArr[0];
    const fee = retArr[1];

    // tslint:disable-next-line:no-unnecessary-local-variable
    const hash = await BtcApi.sendRawTransaction(rawHexString);

    return hash.txid;

}

/**
 * 处理eth代币转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doERC20TokenTransfer(wlt: EthWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, currencyName: string) {

    const api = new EthApi();
    const nonce = await api.getTransactionCount(acct1);
    console.log('nonce', nonce);
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, acct2, ethTokenMultiplyDecimals(value, currencyName));
    const txObj = {
        to: ERC20Tokens[currencyName],
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        value: 0,
        data: transferCode
    };

    // const currentAddr = getAddrById(acct1, currencyName);
    // if (!currentAddr) return;

    // const wlt = EthWallet.fromJSON(currentAddr.wlt);

    const tx = wlt.signRawTransaction(txObj);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const id = await api.sendRawTransaction(tx);

    return id;
}

// 预估ETH的gas limit
// tslint:disable-next-line:only-arrow-functions
async function estimateGasETH(toAddr:string) {
    const api = new EthApi();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const gas = await api.estimateGas({ to: toAddr,data:'' });

    return gas;
}

// 预估ETH ERC20Token的gas limit
// tslint:disable-next-line:only-arrow-functions
async function estimateGasERC20(currencyName:string,toAddr:string,amount:number) {
    const api = new EthApi();
    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(amount, currencyName));
    // tslint:disable-next-line:no-unnecessary-local-variable
    const gas = await api.estimateGas({ to: ERC20Tokens[currencyName], data: transferCode });

    return gas;
}
