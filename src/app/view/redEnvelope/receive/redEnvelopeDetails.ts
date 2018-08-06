/**
 * red-envelope details
 */
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyTypeReverse } from '../../../store/conMgr';

interface Props {
    leaveMessage:string;
    ctype:number;
    amount:number;
}
export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log('props',props);
        this.state = {
            currencyName:CurrencyTypeReverse[props.ctype]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}