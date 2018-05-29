import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { Api } from "../../../core/eth/api";
import { getLocalStorage, getCurrentWallet, decrypt, setLocalStorage, getDefaultAddr } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";
import { dataCenter } from "../../../store/dataCenter";

export class addressManage extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            showtype: 1,
            selectnum: 0,
            coins: [
                { name: "BTC" },
                { name: "ETH" },
                { name: "ETC" },
                { name: "BCH" },
                { name: "EOS" },
                { name: "XRP" }
            ],
            content1: [
                { name: "BTC 001", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "BTC 002", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "BTC 003", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "BTC 004", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" }
            ],
            content2: [
                { name: "好友 001", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "好友 002", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "好友 003", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "好友 004", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" }
            ]
        }
    }

    public goback() {
        this.ok && this.ok();
    }

    public tabchange(event: any, index: number) {
        this.state.showtype = index;
        this.paint();
    }

    public coinchange(event: any, index: number) {
        this.state.selectnum = index;
        let selectName = this.state.coins[this.state.selectnum].name;
        if (selectName === "ETH" && this.state.showtype === 1) {
            let list = dataCenter.getAddrBalancesByCurrencyName(selectName);

            this.state.content1 = list.map(v => {
                return {
                    name: v.addrName,
                    money: v.balance.toFixed(2),
                    address: v.addr
                }
            })
        } else {
            this.state.content1 = [
                { name: "BTC 001", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "BTC 002", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "BTC 003", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" },
                { name: "BTC 004", money: "2.00", address: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" }
            ];
        }
        this.paint();
    }

    public showDetails() {
        // popNew("app-view-mine-addritemDetails",{name:"BTC 001",address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"});
    }

    public addNewaddr() {
        // let api = new Api();
        // let wallets = getLocalStorage("wallets");
        // const wallet = getCurrentWallet(wallets);
        // let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.state.currencyName)[0];
        // if (!currencyRecord) return
        // let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        // let newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), this.state.list.length)

        if (this.state.showtype == 1) {
            let selectName = this.state.coins[this.state.selectnum].name;

            let content = "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f";
            let wallets;
            let currencyRecord;
            let newGwlt;
            if (selectName === "ETH") {
                wallets = getLocalStorage("wallets");
                const wallet = getCurrentWallet(wallets);
                currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === selectName)[0];
                if (!currencyRecord) return
                const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
                newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), currencyRecord.addrs.length)
                content = newGwlt.address;
            }

            popNew("app-components-message-messagebox", { type: "prompt", title: "添加地址", placeHolder: "标签名", content: content }, (r) => {
                if (newGwlt) {
                    r = r || getDefaultAddr(newGwlt.address);
                    currencyRecord.addrs.push({
                        addr: newGwlt.address,
                        addrName: r,
                        gwlt: newGwlt.toJSON(),
                        record: []
                    });
                    currencyRecord.currentAddr = newGwlt.address;
                    setLocalStorage("wallets", wallets, true);


                    dataCenter.addAddr(newGwlt.address, r, selectName);
                    this.state.content1.push({ name: r, money: "0.00", address: newGwlt.address });
                    this.paint();
                }
            })
        }
        else {
            let title = `添加${this.state.coins[this.state.selectnum].name}地址`;
            popNew("app-view-mine-addressManage-messagebox", { type: "prompt", title: title, content: "Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f" })
        }
    }
}