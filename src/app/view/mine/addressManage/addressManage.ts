import {Widget} from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { Api } from "../../../core/eth/api";
import { getLocalStorage, getCurrentWallet, decrypt, setLocalStorage } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";

export class addressManage extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.props={     
            showtype:1,  
            selectnum:0, 
            coins:[
                {name:"BTC"},
                {name:"ETH"},
                {name:"ETC"},
                {name:"BCH"},
                {name:"GAIA"},
                {name:"XRP"}
            ],
            content1:[
                {name:"BTC 001", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"},       
                {name:"BTC 002", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"},       
                {name:"BTC 003", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"},                                   
                {name:"BTC 004", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"}       
            ],
            content2:[
                {name:"好友 001", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"},       
                {name:"好友 002", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"},       
                {name:"好友 003", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"},                                   
                {name:"好友 004", money:"2.00",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"}   
            ]
        }
    }

    public goback(){
        this.ok && this.ok();
    }

    public tabchange(event:any,index:number){
        this.props.showtype=index;
        this.paint();
    }

    public coinchange(event:any,index:number){
        this.props.selectnum = index;
        this.paint();
    }

    public showDetails(){
        // popNew("app-view-mine-addritemDetails",{name:"BTC 001",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"});
    }

    public addNewaddr(){
        // let api = new Api();
        // let wallets = getLocalStorage("wallets");
        // const wallet = getCurrentWallet(wallets);
        // let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
        // if (!currencyRecord) return
        // let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        // let newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), this.state.list.length)

        popNew("pi-components-message-messagebox", { type: "prompt", title: "添加地址", content: "" }, (r) => {
            // currencyRecord.addrs.push({
            //     addr: newGwlt.address,
            //     addrName: r ? r : `默认地址${this.state.list.length}`,
            //     gwlt: newGwlt.toJSON(),
            //     record: []
            // });
            // currencyRecord.currentAddr = newGwlt.address;
            // setLocalStorage("wallets", wallets, true);
            // console.log(wallets)
            //todo 这里验证输入，并根据输入添加地址，且处理地址切换
            this.goback();
        }, () => {
            this.goback();
        })
    }
}