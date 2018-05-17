import { Widget } from "../../pi/widget/widget";

interface Wallet{
    walletName:string;
    walletNameDotBgColor:string;
    totalAssets:string;// total assets
    currencyList:Array<any>;//Currency list
}
export class Home extends Widget{
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(): void{
        this.state = {
            walletName:"GAIA钱包",
            walletNameDotBgColor:"#fff",
            totalAssets:"0.00",
            currencyList:[{
                currencyName:"BTC",
                currencyFullName:"Bit coin",
                balance:"637,176.847802251578654457",
                balanceValue:"451,478,027.28"
            },{
                currencyName:"ETH",
                currencyFullName:"Ether",
                balance:"637,176.847802251578654457",
                balanceValue:"451,478,027.28"
            }]
        };
    }

    public clickCurrencyItemListener(){
        alert("hello")
    }
    public clickAddCurrencyListener(){
        alert("hello")
    }
}