/**
 * 选择地址
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { dataCenter, DataCenter } from '../../../logic/dataCenter';
import { find, updateStore } from '../../../store/store';
import { formatBalance, getAddrById, getStrLen, openBasePage, popPswBox, sliceStr } from '../../../utils/tools';
import { addNewAddr, getMnemonic } from '../../../utils/walletTools';

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
        this.state = {
            list: []
        };
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
            const wallet = find('curWallet');
            const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
            if (currencyRecord) {
                currencyRecord.currentAddr = this.state.list[index].addr;
                updateStore('curWallet', wallet);
            }
        }
        this.doClose();
    }

    /**
     * 处理添加地址
     */
    public async addAddr(e: any, index: number) {
        this.doClose();
        
        try {
            await this.doAddAddr();
        } catch (error) {
            //
        }
    }

    private async doAddAddr() {
        const wallet = find('curWallet');
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('app-components_level_1-loading-loading', { text: '添加中...' });
        const mnemonic = await getMnemonic(wallet, passwd);
        close.callback(close.widget);
        if (mnemonic) {
            const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
            const address = GlobalWallet.getWltAddrByMnemonic(mnemonic, this.props.currencyName, currencyRecord.addrs.length);
            if (!address) return;
            const addrName = await openBasePage('app-components-message-messagebox', {
                itype: 'prompt', title: '添加地址', content: address, placeHolder: '标签名(限8个字)'
            });
            if (addrName && addrName.length >= DataCenter.MAX_ADDRNAME_LEN) {
                popNew('app-components-message-message', { itype: 'notice', content: '地址标签输入过长', center: true });

                return;
            }
            addNewAddr(this.props.currencyName, address, addrName);
        } else {
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }

    }

    private getAddrs() {
        const wallet = find('curWallet');

        if (!wallet.currencyRecords || !this.props.currencyName) return [];

        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
        if (!currencyRecord) return [];

        const currentAddr = currencyRecord.currentAddr || wallet.walletId;
        this.state.list = currencyRecord.addrs.map(v => {
            const r = getAddrById(v, this.props.currencyName);
            let addrName = r.addrName;
            const len = getStrLen(addrName);
            if (len > DataCenter.MAX_ADDRNAME_LEN) {
                addrName = `${sliceStr(addrName, 0, DataCenter.MAX_ADDRNAME_LEN)}...`;
            }
            const info = dataCenter.getAddrInfoByAddr(r.addr, this.props.currencyName);

            return {
                name: addrName,
                balance: formatBalance((info && info.balance) || 0),
                isChoose: r.addr === currentAddr,
                addr: r.addr
            };
        });
    }

}
