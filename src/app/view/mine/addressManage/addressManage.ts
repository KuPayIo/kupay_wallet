/**
 * 地址管理
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { dataCenter } from '../../../store/dataCenter';
import { decrypt, getCurrentWallet, getDefaultAddr, getLocalStorage, setLocalStorage } from '../../../utils/tools';
import { Addr, Wallet } from '../../interface';

export class AddressManage extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            showtype: 1,
            selectnum: 0,
            coins: [
                { name: 'BTC' },
                { name: 'ETH' },
                { name: 'ETC' },
                { name: 'BCH' },
                { name: 'EOS' },
                { name: 'XRP' }
            ],
            content1: [
                { name: 'BTC 001', money: '2.00', address: 'Kye4gFqsnotKvjoVxNXMcksgUWVFTmam2f' },
                { name: 'BTC 002', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: 'BTC 003', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: 'BTC 004', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' }
            ],
            content2: [
                { name: '好友 001', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: '好友 002', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: '好友 003', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: '好友 004', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' }
            ]
        };
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
        const selectName = this.state.coins[this.state.selectnum].name;
        if (selectName === 'ETH' && this.state.showtype === 1) {
            const list = dataCenter.getAddrInfosByCurrencyName(selectName);

            this.state.content1 = list.map(v => {
                return {
                    name: v.addrName,
                    money: v.balance.toFixed(2),
                    address: v.addr
                };
            });
        } else {
            this.state.content1 = [
                { name: 'BTC 001', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: 'BTC 002', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: 'BTC 003', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: 'BTC 004', money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' }
            ];
        }
        this.paint();
    }

    public addNewaddr() {

        if (this.state.showtype === 1) {
            const selectName = this.state.coins[this.state.selectnum].name;

            let content = 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f';
            let wallets;
            let currencyRecord;
            let newGwlt;
            if (selectName === 'ETH') {
                wallets = getLocalStorage('wallets');
                const wallet: Wallet = getCurrentWallet(wallets);
                currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === selectName)[0];
                if (!currencyRecord) return;
                const gwlt = GaiaWallet.fromJSON(wallet.gwlt);
                newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), currencyRecord.addrs.length);
                content = newGwlt.address;
            }

            popNew('app-components-message-messagebox', { itype: 'prompt', title: '添加地址', placeHolder: '标签名', content: content }, (r) => {
                if (newGwlt) {
                    r = r || getDefaultAddr(newGwlt.address);
                    currencyRecord.addrs.push(newGwlt.address);
                    const list: Addr[] = getLocalStorage('addrs') || [];
                    list.push(
                        { addr: newGwlt.address, addrName: r, gwlt: newGwlt.toJSON(), record: [], balance: 0, currencyName: selectName }
                    );
                    currencyRecord.currentAddr = newGwlt.address;
                    setLocalStorage('addrs', list, false);
                    setLocalStorage('wallets', wallets, true);

                    dataCenter.addAddr(newGwlt.address, r, selectName);
                    this.state.content1.push({ name: r, money: '0.00', address: newGwlt.address });
                    this.paint();
                }
            });
        } else {
            const title = `添加${this.state.coins[this.state.selectnum].name}地址`;
            popNew('app-view-mine-addressManage-messagebox', {
                mType: 'prompt', title: title, content: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f'
            });
        }
    }
}