/**
 * 做任务
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../middleLayer/memBridge';
import { callGetMineDetail } from '../../../middleLayer/netBridge';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { register } from '../../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    public language: any;

    public props:any;

    public create() {
        super.create();
        const ktShow = getModulConfig('KT_SHOW');
        const stShow = getModulConfig('ST_SHOW');
        this.props = {
            data: [
                {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_create.png',
                    itemName: { zh_Hans:'创建钱包',zh_Hant:'創建錢包',en:'' },
                    itemShort: { zh_Hans:'有个钱包是一切的基础',zh_Hant:'有個錢包是一切的基礎',en:'' },
                    btnName : { zh_Hans:'去创建',zh_Hant:'去創建',en:'' },
                    components: 'app-view-wallet-create-home',
                    modulIsShow:true
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_verify.png',
                    itemName: { zh_Hans:'验证手机号',zh_Hant:'驗證手機號',en:'' },
                    itemShort: { zh_Hans:'确认为真实用户的唯一标准',zh_Hant:'確認為真實用戶的唯一標準',en:'' },
                    btnName : { zh_Hans:'去验证',zh_Hant:'去驗證',en:'' },
                    components: 'app-view-mine-setting-phone',
                    modulIsShow:true
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_store.png',
                    itemName: { zh_Hans:`充值${ktShow}`,zh_Hant:`充值${ktShow}`,en:'' },
                    itemShort: { zh_Hans:`充${ktShow}送${stShow}`,zh_Hant:`充${ktShow}送${stShow}`,en:'' },
                    btnName : { zh_Hans:'去充值',zh_Hant:'去充值',en:'' },
                    components: 'app-view-wallet-cloudWalletCustomize-rechargeSC ',
                    modulIsShow:true
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_share.png',
                    itemName: { zh_Hans:'填写邀请码',zh_Hant:'填寫邀請碼',en:'' },
                    itemShort: { zh_Hans:'填写好友邀请码领奖励',zh_Hant:'填寫好友邀請碼領獎勵',en:'' },
                    btnName : { zh_Hans:'去填写',zh_Hant:'去填写',en:'' },
                    components: 'app-view-earn-exchange-exchange',
                    modulIsShow:true
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_chat.png',
                    itemName: { zh_Hans:'邀请好友',zh_Hant:'邀请好友',en:'' },
                    itemShort: { zh_Hans:'成功邀请送奖励',zh_Hant:'成功邀请送奖励',en:'' },
                    btnName : { zh_Hans:'去邀请',zh_Hant:'去邀請',en:'' },
                    components: 'earn-client-app-view-activity-inviteFriend',
                    modulIsShow:true
                }
            ]
        };
        this.initData();
        callGetMineDetail();
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
            const components = this.props.data[ind].components;
            popNew(components);
        }
    }

    /**
     * 获取更新数据
     */
    public initData() {
        getStoreData('activity/mining/addMine').then(detail => {
            if (detail && detail.length > 0) {
                for (const i in this.props.data) {
                    this.props.data[i].isComplete = detail[i].isComplete;
                    this.props.data[i].itemKT = detail[i].itemNum;
                }
            }
    
            this.paint();
        });
    }
}

register('activity/mining/addMine', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
