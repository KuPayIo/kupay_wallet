/**
 * 做任务
 */
import { popNew } from '../../../../../../pi/ui/root';
import { getLang } from '../../../../../../pi/util/lang';
import { Forelet } from '../../../../../../pi/widget/forelet';
import { Widget } from '../../../../../../pi/widget/widget';
import { getMineDetail, getMineItemJump } from '../../../../../net/pull';
import { getStore, register } from '../../../../../store/memstore';
import { popNewMessage } from '../../../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    public language: any;

    public props:any = {
        data: [
            {
                isComplete: false,
                itemImg: '../../res/image/addMine_create.png',
                itemName: '',
                itemShort: '',
                itemDetail: '',
                itemKT:'',
                itemJump: 'walletCreate',
                detailShow: false,
                modulIsShow:true
            }, {
                isComplete: false,
                itemImg: '../../res/image/addMine_verify.png',
                itemName: '',
                itemShort: '',
                itemDetail: '',
                itemKT:'',
                itemJump: 'bindPhone',
                detailShow: false,
                modulIsShow:true
            }
        ]
    };
    constructor() {
        super();
    }

    public setProps(props:any) {
        super.setProps(this.props);
    }

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
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
    public async goDetail(ind: number) {
        if (!this.props.data[ind].isComplete) {
            const itemJump = this.props.data[ind].itemJump;
            getMineItemJump(itemJump);

            switch (itemJump) {
                case 'walletCreate':                  // 创建钱包
                    popNew('app-view-wallet-create-home');
                    break;
                case 'bindPhone':                   // 绑定手机
                    popNew('app-view-mine-setting-phone');
                    break;
                default:
                    popNewMessage(this.language.tips);
            }
        }
    }

    /**
     * 展示或隐藏详细描述
     */
    public show(ind: number) {
        this.props.data[ind].detailShow = !this.props.data[ind].detailShow;
        this.paint();
    }

    /**
     * 获取更新数据
     */
    public initData() {
        const detail = getStore('activity/mining/addMine');
        // tslint:disable-next-line:max-line-length
        // const detail = [{isComplete:true},{isComplete:false},{isComplete:false},{isComplete:false},{isComplete:false},{isComplete:false}];
        if (detail && detail.length > 0) {
            for (const i in this.props.data) {
                this.props.data[i].isComplete = detail[i].isComplete;
                this.props.data[i].itemKT = detail[i].itemNum;
            }
        }

        this.paint();

    }
}

register('activity/mining/addMine', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
