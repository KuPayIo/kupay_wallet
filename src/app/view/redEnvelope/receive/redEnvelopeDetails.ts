/**
 * red-envelope details
 */
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyTypeReverse } from '../../../store/interface';

interface Props {
    leaveMessage:string;
    ctype:number;
    amount:number;
}
export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            currencyName:CurrencyTypeReverse[props.ctype]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}