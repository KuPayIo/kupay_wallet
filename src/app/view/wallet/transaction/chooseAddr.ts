/**
 * choose addr
 */
import { Widget } from '../../../../pi/widget/widget';
import { createNewAddr } from '../../../logic/localWallet';
import { getStore, setStore } from '../../../store/memstore';
import { getAddrsInfoByCurrencyName, getCurrentAddrInfo, parseAccount, popPswBox } from '../../../utils/tools';

interface Props {
    currencyName: string;
}
export class ChooseAddr extends Widget {
    public props: any;
    public ok: () => void;
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public init(): void {
        this.props = {
            ...this.props,
            addrsInfo:this.parseAddrsInfo()
        };
    }

    public parseAddrsInfo() {
        const addrsInfo = getAddrsInfoByCurrencyName(this.props.currencyName);
        const curAddr = getCurrentAddrInfo(this.props.currencyName).addr;
        addrsInfo.forEach(item => {
            item.addrShow = parseAccount(item.addr);
            item.isChoosed = item.addr === curAddr;
        });

        return addrsInfo;
    }

    public maskClick() {
        this.ok && this.ok();
    }

    public addrItemClick(e:any,index:number) {
        if (!this.props.addrsInfo[index].isChoosed) {
            const wallet = getStore('wallet');
            const record = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
            if (record) {
                record.currentAddr = this.props.addrsInfo[index].addr;
                setStore('wallet/currencyRecords', wallet.currencyRecords);
            }
        }
        this.ok && this.ok();
    }

    public async addAddrClick() {
        const psw = await popPswBox();
        if (!psw) return;
        this.ok && this.ok();
        createNewAddr(psw,this.props.currencyName);
    }
}