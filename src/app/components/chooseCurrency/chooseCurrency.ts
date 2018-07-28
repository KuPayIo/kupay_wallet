/**
 * choose currency
 */
import { Widget } from '../../../pi/widget/widget';
import { formatBalance, getCurrentAddrBalanceByCurrencyName } from '../../utils/tools';

interface Props {
    currencyList:string[];
}
export class ChooseCurrency extends Widget {
    public ok:(index:number) => void;
    public cancel:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyShowList = [];
        this.props.currencyList.forEach(item => {
            currencyShowList.push({
                currencyName:item,
                balance:formatBalance(getCurrentAddrBalanceByCurrencyName(item))
            });
        });
        this.state = {
            currencyShowList
        };
    }

    public currencyItemClick(e:any,index:number) {
        this.ok && this.ok(index);
    }
    public backClick() {
        this.cancel && this.cancel();
    } 
}