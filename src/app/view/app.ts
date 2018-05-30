import { Widget } from "../../pi/widget/widget";
import { open, popNew } from '../../pi/ui/root';
import { getLocalStorage, getCurrentWallet, randomRgbColor } from '../utils/tools'
export class App extends Widget{
    constructor(){
        super();
    }
    public create(){
        super.create();
        //alert(window.crypto.getRandomValues(new Uint8Array(16)));
        let wallets = getLocalStorage("wallets");

        /* for(let i =0;i< wallets.walletList.length;i++){
            alert(wallets.walletList[i].walletId)
        } */
        this.init();
    }
    public init():void{
        this.state = {
            tabBarList:[{
                text:'钱包',
                icon:"wallet_icon.png",
                iconActive:"wallet_icon_active.png",
                components:"app-view-wallet-home"
            },{
                text:'理财',
                icon:"financialManagement_icon.png",
                iconActive:"financialManagement_icon_active.png",
                components:"app-view-financialManagement-home"
            },{
                text:'交易所',
                icon:"exchange_icon.png",
                iconActive:"exchange_icon_active.png",
                components:"app-view-exchange-home"
            },{
                text:'应用',
                icon:"application_icon.png",
                iconActive:"application_icon_active.png",
                components:"app-view-application-home"
            },{
                text:'我的',
                icon:"mine_icon.png",
                iconActive:"mine_icon_active.png",
                components:"app-view-mine-home"
            }],
            isActive:0
        }
    }
    public tabBarChangeListener(event:any,index:number){
        if(this.state.isActive === index) return;
        this.state.isActive = index;
        this.paint();
    }

    public tabChangeTo(e){
        let index = e.index;
        if(this.state.isActive === index) return;
        this.state.isActive = index;
        this.paint();
    }
}