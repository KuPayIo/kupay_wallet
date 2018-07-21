/**
 * 地址管理
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter, DataCenter } from '../../../store/dataCenter';
import { addNewAddr, getNewAddrInfo } from '../../../utils/tools';

export class AddressManage extends Widget {
    public ok: () => void;
    constructor() {
        super();

    }

    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            showtype: 1,
            selectnum: 0,
            coins: [
                { name: 'BTC' },
                { name: 'ETH' },
                { name: 'YNC' },
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
        this.state.content1 = dataCenter.getAddrInfosByCurrencyName('BTC').map(v => {
            return {
                currencyName: "BTC",
                name: v.addrName,
                money: v.balance.toFixed(2),
                address: v.addr
            };
        });
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
        if (this.state.showtype === 1) {
            const list = dataCenter.getAddrInfosByCurrencyName(selectName);
            if (list.length > 0) {
                this.state.content1 = list.map(v => {
                    return {
                        currencyName: selectName,
                        name: v.addrName,
                        money: v.balance.toFixed(2),
                        address: v.addr
                    };
                });
            } else {
                this.state.content1 = [
                    { name: `${selectName} 001`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                    { name: `${selectName} 002`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                    { name: `${selectName} 003`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                    { name: `${selectName} 004`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' }
                ];
            }

        } else {
            this.state.content1 = [
                { name: `${selectName} 001`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: `${selectName} 002`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: `${selectName} 003`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' },
                { name: `${selectName} 004`, money: '2.00', address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f' }
            ];
        }
        this.paint();
    }

    public addNewaddr() {

        if (this.state.showtype === 1) {
            const selectName = this.state.coins[this.state.selectnum].name;
            const info = getNewAddrInfo(selectName);
            let address;
            let wltJson;

            if (info) {
                address = info.address;
                wltJson = info.wltJson;
            } else {
                address = 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f';
            }

            popNew('app-components-message-messagebox',
                { itype: 'prompt', title: '添加地址', placeHolder: '标签名(限8个字)', content: address }, (r) => {
                    if (wltJson) {
                        if (r && r.length >= DataCenter.MAX_ADDRNAME_LEN) {
                            popNew('app-components-message-message', { itype: 'notice', content: '地址标签输入过长', center: true });

                            return;
                        }

                        const info = addNewAddr(selectName, address, r, wltJson);

                        this.state.content1.push({ name: info.addrName, money: '0.00', address: address });
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