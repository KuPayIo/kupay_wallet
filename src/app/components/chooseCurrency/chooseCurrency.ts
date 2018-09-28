/**
 * choose currency
 */
import { Widget } from '../../../pi/widget/widget';
import { formatBalance, getCurrentAddrBalanceByCurrencyName, getLanguage } from '../../utils/tools';

interface Props {
    list:string[];
    selected:number;
}
export class ChooseCurrency extends Widget {
    public ok:(index:number) => void;
    public cancel:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        const currencyShowList = [];
        this.props.list.forEach(item => {
            // tslint:disable-next-line:max-line-length
            const balance = getCurrentAddrBalanceByCurrencyName(item);
            currencyShowList.push({
                name:item,
                balance:formatBalance(balance),
                // tslint:disable-next-line:prefer-template
                img:'../../res/image/currency/' + item + '.png'
            });
        });
        this.state = {
            currencyShowList,
            selected:this.props.selected,
            cfgData:getLanguage(this)
        };
    }

    public changeSelect(e:any,ind:number) {
        this.state.selected = ind;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok(ind);
        }, 100);
    }
    
    public close() {
        this.cancel && this.cancel();
    }
}