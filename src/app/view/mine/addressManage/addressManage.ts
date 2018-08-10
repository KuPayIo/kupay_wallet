/**
 * 地址管理
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { dataCenter } from '../../../store/dataCenter';

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
            selectnum: 0,
            coins: [
                { name: 'BTC' },
                { name: 'ETH' }
            ],
            content:[]

        };
        this.state.content = dataCenter.getTopContacts('BTC').map(v => {
            return {
                currencyName: 'BTC',
                name: v.tags,
                address: v.addresse
            };
        });
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public coinchange(event: any, index: number) {
        this.state.selectnum = index;
        const selectName = this.state.coins[this.state.selectnum].name;
        const list = dataCenter.getTopContacts(selectName);
  
        this.state.content = list.map(v => {
            return {
                currencyName: selectName,
                name: v.tags,
                address: v.addresse
            };
        });
        
        this.paint();
    }

    public addNewaddr() {
        const defaultTag = this.getDefaultTags(this.state.coins[this.state.selectnum].name);
        const title = `添加地址-${this.state.coins[this.state.selectnum].name}`;
        popNew('app-view-mine-addressManage-messagebox', {
            mType: 'prompt', title: title,input2DefaultValue:defaultTag
        },(data) => {
            const addresse = data.addresse;
            let tags = data.tags;
            if (!addresse) {
                return;
            }
            if (!tags) {
                // TODO 自动生成地址名称
                tags = '默认地址';

            }
            dataCenter.addTopContacts(this.state.coins[this.state.selectnum].name,addresse,tags);
            this.coinchange(null,this.state.selectnum);
            popNew('app-components-message-message', { itype: 'success', content: '添加常用联系人成功！', center: true });
        });
    }

    public getDefaultTags(currencyName:string) {
        const contacts = dataCenter.getTopContacts(currencyName);
        const length = contacts.length + 1;

        return `${currencyName} ${length}`;
    }
}