/**
 * currency exchange
 */
import { shapeshift } from '../../../app/exchange/shapeshift/shapeshift';
import { currencyExchangeAvailable, eth2Wei, ethTokenMultiplyDecimals, getCurrentWallet, getLocalStorage } from '../../../app/utils/tools'; 
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { BtcApi } from '../../core/btc/api';
import { BTCWallet } from '../../core/btc/wallet';
import { Api as EthApi } from '../../core/eth/api';
import { ERC20Tokens } from '../../core/eth/tokens';
import { GaiaWallet } from '../../core/eth/wallet';
import { GlobalWallet } from '../../core/globalWallet';

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
        // ZRX   BAT
        this.state = {
            outCurrency:this.props && this.props.outCurrency ? this.props.outCurrency : 'ETH',
            inCurrency:this.props && this.props.inCurrency ? this.props.inCurrency : 'ZRX',
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
        /* this.state.timer = setTimeout(() => {
            this.marketInfoUpdated();
        },30 * 1000); */
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
            returnAddress: this.state.curAddr// 失败后的退款地址
            // amount: this.state.receiveAmount // <---- must set amount here
        };
        // 0x958B0bA923260A91Ffd28e8E9a209240648066C2
        const withdrawalAddress = this.state.curAddr; // 入账币种的地址
        // const close = popNew('pi-components-loading-loading', { text: '等待中...' });
        // 0x9399264c3367d9bdc589c3aea32901611845b2a4  未退回的交易 hash 0x899f84b755cfa2db660ffeb73ba6952162f4ee125c11a2d6ec2a557edf10f915
        shapeshift.status('0x9399264c3367d9bdc589c3aea32901611845b2a4', (err, status, data) => {
            console.error('errror',err);
            console.log('status',status); // => should be 'received' or 'complete'
            console.log('status data',data);
        });
        console.log(this.state.pair);
        /* popNew('app-components-message-messageboxPrompt',{ title:'请输入密码' },(r) => {
            const psw = r;
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
                console.log(depositAddress,shiftAmount);
              // you need to actually then send your BTC to ShapeShift
              // you could use module `spend`: https://www.npmjs.com/package/spend
              // CONVERT AMOUNT TO SATOSHIS IF YOU USED `spend`
              // spend(SS_BTC_WIF, depositAddress, shiftAmountSatoshis, function (err, txId) { /.. ../ })
            
              // later, you can then check the deposit status
                // this.doNext(psw,this.state.curAddr,depositAddress,5000000000,21000,amount,'ETH');
            });
        }); */
    }

    // tslint:disable-next-line:max-line-length
    public async doNext(psw:string,fromAddr:string,toAddr:string,gasPrice:number,gasLimit:number,pay:number,currencyName:string,info?:string) {
        // tslint:disable-next-line:no-this-assignment
        const thisObj = this;
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const loading = popNew('pi-components-loading-loading', { text: '交易中...' });
        try {
            let id: any;
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
            console.log(id);
        } catch (error) {
            console.log(error.message);
            if (error.message.indexOf('insufficient funds') >= 0) {
                popNew('app-components-message-message', { itype: 'error', content: '余额不足', center: true });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: error.message, center: true });
            }
        }

        loading.callback(loading.widget);
            
    }
}

/**
 * 处理转账
 */
// tslint:disable-next-line:only-arrow-functions
async function doEthTransfer(wlt: GaiaWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
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

    // const wlt = GaiaWallet.fromJSON(currentAddr.wlt);

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
async function doERC20TokenTransfer(wlt: GaiaWallet, acct1: string, acct2: string, gasPrice: number, gasLimit: number
    , value: number, currencyName: string) {

    const api = new EthApi();
    const nonce = await api.getTransactionCount(acct1);
    console.log('nonce', nonce);
    const transferCode = GaiaWallet.tokenOperations('transfer', currencyName, acct2, ethTokenMultiplyDecimals(value, currencyName));
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

    // const wlt = GaiaWallet.fromJSON(currentAddr.wlt);

    const tx = wlt.signRawTransaction(txObj);
    // tslint:disable-next-line:no-unnecessary-local-variable
    const id = await api.sendRawTransaction(tx);

    return id;
}
