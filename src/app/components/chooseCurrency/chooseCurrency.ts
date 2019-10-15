/**
 * choose currency
 */
import { Widget } from '../../../pi/widget/widget';
import { calCurrencyLogoUrl, getCurrentAddrInfo1 } from '../../utils/tools';
import { getStoreData } from '../../api/walletApi';
import { formatBalance } from '../../utils/pureUtils';

interface Props {
    list:string[];
    selected:number;
}
export class ChooseCurrency extends Widget {
    public ok:(index:number) => void;
    public cancel:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
       
        this.props = {
            ...this.props,
            currencyShowList:[],
            selected:this.props.selected
        };
        getStoreData('wallet/currencyRecords').then(currencyRecords => {
            const currencyShowList = [];
            this.props.list.forEach(item => {
                const balance = getCurrentAddrInfo1(item,currencyRecords).balance;
                currencyShowList.push({
                    name:item,
                    balance:formatBalance(balance),
                    img:calCurrencyLogoUrl(item)

                });
            });
            this.props.currencyShowList = currencyShowList;
            this.paint();
        });
    }

    public changeSelect(e:any,ind:number) {
        this.props.selected = ind;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok(ind);
        }, 100);
    }
    
    public close() {
        this.cancel && this.cancel();
    }
}