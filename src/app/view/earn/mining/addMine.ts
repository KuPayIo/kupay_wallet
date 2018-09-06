import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getMineItemJump, getMineDetail } from '../../../net/pull';
import { find, register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = {
            data:[
            {
                isComplete: false,
                itemImg: '../../res/image/addMine_create.png',
                itemName: '创建钱包',
                itemShort:"矿储量+300KT",
                itemDetail: "创建钱包赠送300KT",
                itemJump: 'walletCreate',
                show:false
            }, {
                isComplete: false,
                itemImg: '../../res/image/addMine_verify.png',
                itemName: '验证手机号',
                itemShort:"矿储量+2500KT",
                itemDetail: "手机号注册可提现，额外赠送2500KT",
                itemJump: 'bindPhone',
                show:false                
            }, {
                isComplete: false,
                itemImg: '../../res/image/addMine_store.png',
                itemName: '存币送ETH',
                itemShort:"矿储量+1000KT",                
                itemDetail: "存币到自己的钱包地址，首次存币送1000KT，2-4个送2000，4-8个送4000，8-16个送6000，16-32个送8000,32以上送10000封顶。",
                itemJump: 'storeCoin',
                show:false
            }, {
                isComplete: false,
                itemImg: '../../res/image/addMine_share.png',
                itemName: '与好友分享',
                itemShort:"一起分享0.5ETH",  
                itemDetail: "成功邀请一人送500KT和0.01ETH。",
                itemJump: 'shareFriend',
                show:false
            }, {
                isComplete: false,
                itemImg: '../../res/image/addMine_buy.png',
                itemName: '购买理财',
                itemShort:"首次购买额外+1500KT",
                itemDetail: "每购买1ETH等价的理财产品每天送100KT，购买当日额外赠送500KT，首次购买额外赠送1500KT，总量封顶",
                itemJump: 'buyFinancial',
                show:false
            }, {
                isComplete: false,
                itemImg: '../../res/image/addMine_chat.png',
                itemName: '聊天',
                itemShort:"聊天+700KT",
                itemDetail: "首次参与聊天赠送700",
                itemJump: 'toChat',
                show:false
            }
        ]};
        this.initData();
        getMineDetail();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 挖矿项目跳转
     * @param ind 挖矿项目参数
     */
    public goDetail(ind:number) {
        if (!this.state.data[ind].isComplete) {
            const itemJump = this.state.data[ind].itemJump;
            getMineItemJump(itemJump);
            // if (itemJump === 'buyFinancial') {
            //     this.backPrePage();
            // }
        }
    }

    /**
     * 展示或隐藏详细描述
     */
    public show(ind:number){
        this.state.data[ind].show = !this.state.data[ind].show;
        this.paint();
    }

    /**
     * 获取更新数据
     */
    public async initData() {  
        const detail = find('addMine');
        // const detail = [{isComplete:true},{isComplete:false},{isComplete:false},{isComplete:false},{isComplete:false},{isComplete:false}];
        if(detail){
            for(let i in detail){
                this.state.data[i].isComplete = detail[i].isComplete;
            }
        }
        this.paint();
        
    }
}

register('addMine', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});