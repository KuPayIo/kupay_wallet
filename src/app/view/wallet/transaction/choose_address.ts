/**
 * 选择地址
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Api } from '../../../core/eth/api';
import { GaiaWallet } from '../../../core/eth/wallet';
import { decrypt, getAddrById, getCurrentWallet, getDefaultAddr, getLocalStorage, setLocalStorage, wei2Eth } from '../../../utils/tools';
import { Addr } from '../../interface';

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
        this.state = {};

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
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
        if (!currencyRecord) return;
        const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        const newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), this.state.list.length);

        popNew('app-components-message-messagebox', {
            itype: 'prompt', title: '添加地址', content: newGwlt.address, placeHolder: '标签名'
        }, (r) => {

            r = r || getDefaultAddr(newGwlt.address);
            currencyRecord.addrs.push(newGwlt.address);
            const list: Addr[] = getLocalStorage('addrs') || [];
            list.push({
                addr: newGwlt.address, addrName: r, gwlt: newGwlt.toJSON(), record: [], balance: 0, currencyName: this.props.currencyName
            });
            currencyRecord.currentAddr = newGwlt.address;
            setLocalStorage('addrs', list, false);
            setLocalStorage('wallets', wallets, true);
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
        const api = new Api();
        this.state.list = currencyRecord.addrs.map(v => {
            const r = getAddrById(v);

            return {
                name: r.addrName,
                balance: r.balance,
                isChoose: r.addr === currentAddr,
                addr: r.addr
            };
        });

        currencyRecord.addrs.forEach(v => {
            api.getBalance(v).then(r => {
                this.setBalance(v, r);
            });
        });
    }

    private setBalance(addr: string, r: any) {
        let num = 0;
        if (this.props.currencyName === 'ETH') {
            num = wei2Eth((<any>r).toNumber());
        }
        this.state.list = this.state.list.map(v => {
            if (v.addr === addr) v.balance = num.toFixed(6);

            return v;
        });
        this.paint();
    }

}
