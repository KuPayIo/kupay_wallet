/**
 * choose addr
 */
import { Widget } from '../../../../pi/widget/widget';
import { callGetAddrsInfoByCurrencyName, callGetCurrentAddrInfo,getStoreData, setStoreData } from '../../../middleLayer/wrap';
import { defaultPassword } from '../../../utils/constants';
import { parseAccount, popPswBox } from '../../../utils/tools';
import { createNewAddr } from '../../../viewLogic/localWallet';

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
            addrsInfo:[]
        };
        this.parseAddrsInfo();
    }

    public parseAddrsInfo() {
        const currencyName = this.props.currencyName;
        Promise.all([callGetAddrsInfoByCurrencyName(currencyName),callGetCurrentAddrInfo(currencyName)]).then(([addrsInfo,curAddrInfo]) => {
            const curAddr = curAddrInfo.addr;
            addrsInfo.forEach(item => {
                item.addrShow = parseAccount(item.addr);
                item.isChoosed = item.addr === curAddr;
            });

            this.props.addrsInfo = addrsInfo;
            this.paint();
        });
    }

    public maskClick() {
        this.ok && this.ok();
    }

    public addrItemClick(e:any,index:number) {
        if (!this.props.addrsInfo[index].isChoosed) {
            getStoreData('wallet').then(wallet => {
                const record = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
                if (record) {
                    record.currentAddr = this.props.addrsInfo[index].addr;
                    setStoreData('wallet/currencyRecords', wallet.currencyRecords);
                }
                this.ok && this.ok();
            });
        }
    }

    public async addAddrClick() {
        getStoreData('wallet/setPsw').then(async (setPsw) => {
            let psw;
            if (!setPsw) {
                psw = defaultPassword;
            } else {
                psw = await popPswBox();
            }
            if (!psw) return;
            this.ok && this.ok();
            createNewAddr(psw,this.props.currencyName);
        });
    }
}