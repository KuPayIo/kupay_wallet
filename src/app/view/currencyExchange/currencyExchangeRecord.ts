/**
 * currency exchange records
 */
import { shapeshift } from '../../../app/exchange/shapeshift/shapeshift';
import { Widget } from '../../../pi/widget/widget';
import { shapeshiftApiPrivateKey } from '../../utils/constants';
import { getCurrentAddrByCurrencyName,parseAccount,timestampFormat } from '../../utils/tools';

interface tx {
    hasConfirmations:boolean;
    inputAddress:string;
    inputAmount:number;
    inputCurrency:string;
    inputTXID:string;
    outputAddress:string;
    outputAmount:string;
    outputCurrency:string;
    outputTXID:string;
    shiftRate:string;
    status:string;
    timestamp:number;
}
interface Props {
    currencyName:string;
}
export class CurrencyExchangeRecord extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const outAddr = getCurrentAddrByCurrencyName(this.props.currencyName).toLowerCase();
        console.log('outAddr',outAddr);
        shapeshift.transactions(shapeshiftApiPrivateKey,outAddr, (err, transactions) => {
            console.log('transactions',transactions);
            if (err) return console.error(err);
            const txList = [];
            transactions.forEach((tx) => {
                txList.push({
                    ...tx,
                    inputTXID_show:parseAccount(tx.inputTXID),
                    outputTXID_show:parseAccount(tx.outputTXID),
                    timestamp_show:timestampFormat(tx.timestamp)
                });
            });
            this.state.txList = txList;
            this.paint();
        });
        this.state = {
            txList:[]
        };
    }
    public backClick() {
        this.ok && this.ok();
    }
}