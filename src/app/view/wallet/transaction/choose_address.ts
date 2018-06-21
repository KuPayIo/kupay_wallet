/**
 * 选择地址
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Api as BtcApi } from '../../../core/btc/api';
import { BTCWallet } from '../../../core/btc/wallet';
import { Api as EthApi } from '../../../core/eth/api';
import { GaiaWallet } from '../../../core/eth/wallet';
import { dataCenter } from '../../../store/dataCenter';
import {
    decrypt, getAddrById, getCurrentWallet, getDefaultAddr, getLocalStorage, getStrLen, setLocalStorage, sliceStr, wei2Eth
} from '../../../utils/tools';
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
        this.state = { maxNameLen: 9 };

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
        let address;
        let gwltJson;

        if (this.props.currencyName === 'ETH') {
            const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            const newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), this.state.list.length);
            address = newGwlt.address;
            gwltJson = newGwlt.toJSON();
        } else if (this.props.currencyName === 'BTC') {
            const addrs = getLocalStorage('addrs');
            const firstAddr = addrs.filter(v => v.addr === currencyRecord.addrs[0])[0];

            const psw = decrypt(wallet.walletPsw);
            const gwlt = BTCWallet.fromJSON(firstAddr.gwlt, psw);
            gwlt.unlock(psw);
            address = gwlt.derive(currencyRecord.addrs.length);
            gwlt.lock(psw);

            gwltJson = firstAddr.gwlt;
        }

        popNew('app-components-message-messagebox', {
            itype: 'prompt', title: '添加地址', content: address, placeHolder: '标签名(限8个字)'
        }, (r) => {
            if (r && r.length >= this.state.maxNameLen) {
                popNew('app-components-message-message', { itype: 'notice', content: '地址标签输入过长', center: true });

                return;
            }
            r = r || getDefaultAddr(address);
            currencyRecord.addrs.push(address);
            const list: Addr[] = getLocalStorage('addrs') || [];
            list.push({
                addr: address, addrName: r, gwlt: gwltJson, record: [], balance: 0, currencyName: this.props.currencyName
            });
            currencyRecord.currentAddr = address;

            dataCenter.addAddr(address, r, this.props.currencyName);

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
        this.state.list = currencyRecord.addrs.map(v => {
            const r = getAddrById(v);

            let addrName = r.addrName;
            const len = getStrLen(addrName);
            if (len > this.state.maxNameLen) {
                addrName = `${sliceStr(addrName, 0, this.state.maxNameLen)}...`;
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
