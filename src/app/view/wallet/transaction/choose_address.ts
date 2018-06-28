/**
 * 选择地址
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter, DataCenter } from '../../../store/dataCenter';
import {
    addNewAddr, getAddrById, getCurrentWallet, getLocalStorage, getNewAddrInfo, getStrLen, setLocalStorage, sliceStr
} from '../../../utils/tools';

interface Props {
    currencyName: string;
}

export class AddAsset extends Widget {
    public props: Props;
    public ok: () => void;

    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public init(): void {

        this.getAddrs();
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理选择地址
     */
    public chooseAddr(e: any, index: number) {
        if (!this.state.list[index].isChoose) {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
            if (currencyRecord) {
                currencyRecord.currentAddr = this.state.list[index].addr;
                setLocalStorage('wallets', wallets, true);
            }
        }
        this.doClose();
    }

    /**
     * 处理添加地址
     */
    public addAddr(e: any, index: number) {
        const info = getNewAddrInfo(this.props.currencyName);
        if (!info) return;
        const address = info.address;
        const wltJson = info.wltJson;

        popNew('app-components-message-messagebox', {
            itype: 'prompt', title: '添加地址', content: address, placeHolder: '标签名(限8个字)'
        }, (r) => {
            if (r && r.length >= DataCenter.MAX_ADDRNAME_LEN) {
                popNew('app-components-message-message', { itype: 'notice', content: '地址标签输入过长', center: true });

                return;
            }
            addNewAddr(this.props.currencyName, address, r, wltJson);

            // console.log(wallets)
            // todo 这里验证输入，并根据输入添加地址，且处理地址切换
            this.doClose();
        }, () => {
            this.doClose();
        });
    }

    private getAddrs() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);

        if (!wallet.currencyRecords || !this.props.currencyName) return [];

        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
        if (!currencyRecord) return [];

        const currentAddr = currencyRecord.currentAddr || wallet.walletId;
        this.state.list = currencyRecord.addrs.map(v => {
            const r = getAddrById(v);

            let addrName = r.addrName;
            const len = getStrLen(addrName);
            if (len > DataCenter.MAX_ADDRNAME_LEN) {
                addrName = `${sliceStr(addrName, 0, DataCenter.MAX_ADDRNAME_LEN)}...`;
            }
            const info = dataCenter.getAddrInfoByAddr(r.addr);

            return {
                name: addrName,
                balance: (info && info.balance) || 0,
                isChoose: r.addr === currentAddr,
                addr: r.addr
            };
        });
    }

}
