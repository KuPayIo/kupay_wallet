import { Widget } from "../../pi/widget/widget";
import { popNew } from "../../pi/ui/root";
import { getLocalStorage } from '../utils/tools'

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
        const wallet = getLocalStorage("wallet",(wallet)=>{
            this.state.wallet = wallet;
            this.paint();
        });
        this.state = {
            wallet,
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
        popNew("app-view-transaction-currency_details",{currencyName:"ETH",currencyBalance:"0.001 ETH",currencyBalanceConversion:"≈￥4.73"})
        
    }
    public clickAddCurrencyListener(){
        popNew("app-view-assets-add_asset")
    }
    public createWalletClick(){
        popNew("app-view-walletCreate-walletCreate");
    }
}