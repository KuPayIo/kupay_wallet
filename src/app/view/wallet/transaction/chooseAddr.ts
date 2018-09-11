/**
 * choose addr
 */
import { Widget } from "../../../../pi/widget/widget";
import { getAddrsInfoByCurrencyName, parseAccount, getCurrentAddrInfo, popPswBox } from "../../../utils/tools";
import { createNewAddr } from "../../../logic/localWallet";
import { find, updateStore } from "../../../store/store";

interface Props {
    currencyName: string;
}
export class ChooseAddr extends Widget{
    public props: Props;
    public ok: () => void;
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public init(): void {
        this.state = {
            addrsInfo:this.parseAddrsInfo()
        };
    }

    public parseAddrsInfo(){
        const addrsInfo = getAddrsInfoByCurrencyName(this.props.currencyName);
        const curAddr = getCurrentAddrInfo(this.props.currencyName).addr;
        addrsInfo.forEach(item=>{
            item.addrShow = parseAccount(item.addr);
            item.isChoosed = item.addr === curAddr;
        });
        return addrsInfo;
    }

    public maskClick(){
        this.ok && this.ok();
    }

    public addrItemClick(e:any,index:number){
        if (!this.state.addrsInfo[index].isChoosed) {
            const wallet = find('curWallet');
            const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
            if (currencyRecord) {
                currencyRecord.currentAddr = this.state.addrsInfo[index].addr;
                updateStore('curWallet', wallet);
            }
        }
        this.ok && this.ok();
    }

    public async addAddrClick(){
        const psw = await popPswBox();
        if(!psw) return;
        this.ok && this.ok();
        createNewAddr(psw,this.props.currencyName);
    }
}