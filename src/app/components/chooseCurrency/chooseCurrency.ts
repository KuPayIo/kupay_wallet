/**
 * choose currency
 */
import { Widget } from '../../../pi/widget/widget';
import { CurrencyType } from '../../store/interface';
import { find, getBorn } from '../../store/store';
import { formatBalance, getCurrentAddrBalanceByCurrencyName } from '../../utils/tools';

interface Props {
    currencyList:string[];
    isLocal:boolean;
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
            console.log(find('cloudBalance',item));
            // tslint:disable-next-line:max-line-length
            const balance = this.props.isLocal ? getCurrentAddrBalanceByCurrencyName(item) : getBorn('cloudBalance').get(CurrencyType[item]);
            currencyShowList.push({
                currencyName:item,
                balance:formatBalance(balance)
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