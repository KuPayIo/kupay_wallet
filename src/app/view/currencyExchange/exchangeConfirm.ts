/**
 * exchange confirm
 */
import { Widget } from '../../../pi/widget/widget';
import { ERC20Tokens } from '../../core/eth/tokens';
interface Props {
    outCurrency:string;
    inCurrency:string;
    outAmount:number;
    inAmount:number;
    fee:number;
    
}
export class ExchangeConfirm extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public setProps(props:Props,oldPros:Props) {
        super.setProps(props,oldPros);
        this.init();
    }

    public init() {
        const outCurrency = this.props.outCurrency;
        let feeUnit = 'ETH';
        if (outCurrency === 'BTC') {
            feeUnit = 'BTC';
        } else if (outCurrency === 'ETH' || ERC20Tokens[outCurrency]) {
            feeUnit = 'ETH';
        }
        this.state = {
            feeUnit
        };
    }
    public cancelClick() {
        this.cancel && this.cancel();
    }
    public okClick() {
        this.ok && this.ok();
    }
}