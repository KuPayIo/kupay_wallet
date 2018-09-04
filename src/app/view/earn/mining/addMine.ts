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
        this.state = {};
        this.initData();
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
            if (itemJump === 'buyFinancial') {
                this.backPrePage();
            }
        }
    }

    /**
     * 获取更新数据
     */
    public async initData() {  
        const detail = find('addMine');
        const AllDetail = [
            {
                isComplete: detail[0].isComplete,
                itemImg: '../../../res/image/icon_bonus_new.png',
                itemName: '创建钱包',
                itemNum: detail[0].itemNum,
                itemDetail: `<div>1、创建钱包送300KT，每个APP最多创建10个钱包。</div>`,
                itemJump: 'walletCreate'
            }, {
                isComplete: detail[1].isComplete,
                itemImg: '../../../res/image/icon_bonus_phone.png',
                itemName: '验证手机号',
                itemNum: detail[1].itemNum,
                itemDetail: `<div>1、验证手机号，送2500KT。</div>
                        <div>2、一个钱包只能验证一个手机号。</div>`,
                itemJump: 'bindPhone'
            }, {
                isComplete: detail[2].isComplete,
                itemImg: '../../../res/image/icon_bonus_saves.png',
                itemName: '存币送ETH',
                itemNum: detail[2].itemNum,
                itemDetail: `<div>1、存币到自己的钱包地址上，存一个ETH送2000KT。</div>
                        <div>2、首次存币额外赠送1000KT。</div>
                        <div>3、1个BTC等于10个ETH。</div>`,
                itemJump: 'storeCoin'
            }, {
                isComplete: detail[3].isComplete,
                itemImg: '../../../res/image/icon_bonus_share.png',
                itemName: '与好友分享',
                itemNum: detail[3].itemNum,
                itemDetail: `<div>1、系统赠送邀请红包限量1个，内含0.5ETH，分成单个0.015ETH等额红包。</div>
                        <div>2、每成功邀请一人获得500KT和0.01ETH。</div>
                        <div>3、成功邀请的标准是对方曾经达到1000KT</div>`,
                itemJump: 'shareFriend'
            }, {
                isComplete: detail[4].isComplete,
                itemImg: '../../../res/image/icon_bonus_buy.png',
                itemName: '购买理财',
                itemNum: detail[4].itemNum,
                itemDetail: `<div>1、每购买1ETH等价的理财产品每天送100KT。</div>
                        <div>2、购买当日额外赠送500KT。</div>
                        <div>3、首次购买额外赠送1500KT。</div>
                        <div>4、购买理财不会降低矿山</div>`,
                itemJump: 'buyFinancial'
            }, {
                isComplete: detail[5].isComplete,
                itemImg: '../../../res/image/icon_bonus_chat.png',
                itemName: '聊天',
                itemNum: detail[5].itemNum,
                itemDetail: `<div>1、首次参与聊天赠送700。</div>`,
                itemJump: 'toChat'
            }
        ];
        this.state = {
            data:AllDetail
        };
        this.paint();
        
    }
}

register('addMine', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});