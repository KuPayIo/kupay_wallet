import { getStore as earnGetStore } from '../../../earn/client/app/store/memstore';
import { getMedalList } from '../../../earn/client/app/utils/tools';
import { CoinType } from '../../../earn/client/app/xls/dataEnum.s';
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStoreData, goRecharge } from '../../api/walletApi';
import { registerStoreData } from '../../postMessage/listenerStore';
import { getModulConfig } from '../../public/config';
import { fetchCloudWalletAssetList, getUserInfo, rippleShow } from '../../utils/pureUtils';
// tslint:disable-next-line:max-line-length
import { loadAboutAppSource, loadAccountSource, loadCloudRechargeSource, loadDividendSource, loadMallSource, loadMedalSource, loadMiningSource, loadOpenBoxSource, loadPersonalInfoSource, loadRedEnvelopeSource, loadShareSource, loadTurntableSource } from './sourceLoaded';

export const forelet = new Forelet();
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    showDataList:any;// 广场，粉丝，关注，好友
    wallet:any;// 钱包余额
    mallFunction:any;// 小功能
    userInfo:any;
    hasWallet:boolean;
    hasBackupMnemonic:boolean;
    isTourist:boolean;
    mineMedal:any;
    medalList:any;
    medalest:string;// 最高勋章
}

/**
 * 个人主页
 */
export class MyHome extends Widget {
    public props:Props = {
        showDataList:[
            { num:4,name:'广场' },
            { num:4,name:'关注' },
            { num:4,name:'粉丝' },
            { num:4,name:'好友' }
        ],
        wallet:[
            { num:999.99,name:'银两余额' },
            { num:999.99,name:'我的嗨豆' }
        ],
        mallFunction:[
            { src:'../../res/image/mallFunction/mall.png',name:'嗨豆商城' },
            { src:'../../res/image/mallFunction/red.png',name:'红包' },
            { src:'../../res/image/mallFunction/blockchainwallet.png',name:'区块链钱包' },
            { src:'../../res/image/mallFunction/share.png',name:'邀请好友',fg:true },
            { src:'../../res/image/mallFunction/treasureChest.png',name:'开宝箱',fg:true },
            { src:'../../res/image/mallFunction/turntable.png',name:'大转盘',fg:true },
            { src:'../../res/image/mallFunction/mining.png',name:'挖矿',fg:true },
            { src:'../../res/image/mallFunction/recharge.png',name:'充值' },
            { src:'../../res/image/mallFunction/about.png',name:'关于好嗨' },
            { src:'../../res/image/mallFunction/help.png',name:'帮助' },
            { src:'../../res/image/mallFunction/medal.png',name:'我的勋章' },
            { src:'../../res/image/mallFunction/public.png',name:'嗨嗨号' },
            { src:'../../res/image/mallFunction/contact.png',name:'联系我们' }

        ],
        userInfo:{
            acc_id: '332935',
            areaCode: '86',
            avatar: 'app/res/image/default_avater_big.png',
            isRealUser: false,
            level: 0,
            nickName: '昵称未设置',
            note: '',
            phoneNumber: '',
            sex: 2
        },
        hasWallet:false,
        hasBackupMnemonic:false,
        isTourist:true,
        mineMedal: {
            rankMedal: 8000,
            desc: { zh_Hans: '无', zh_Hant: '无', en: '' },
            nextNeedKt: 1,
            nowClass:'无',
            ktNum:0
        },
        medalList: [
            {
                name: '平民',
                title: '平民',
                medal: []
            },
            {
                name: '中产',
                title: '中产',
                medal: []
            },
            {
                name: '富人',
                title: '富人',
                medal: []
            }
        ],
        medalest:''
    };
    public setProps(props:any) {
        this.props = {
            ...this.props
        };
        super.setProps(this.props);
        this.initData();
    }

    /**
     * 更新数据
     */
    public initData() {
        Promise.all([getUserInfo()]).then(([userInfo]) => {
            this.props.userInfo.nickName = userInfo.nickName ? userInfo.nickName :'昵称未设置';
            this.props.userInfo.avatar = userInfo.avatar;
            this.props.userInfo.userLevel = userInfo.level;
            this.props.userInfo.acc_id = userInfo.acc_id ? userInfo.acc_id :'000000';
            this.medalest();
            this.updateLocalWalletAssetList();
        });
    }
    // 获取最高勋章
    public medalest() {
        const medalList = getMedalList(CoinType.KT, 'coinType');
        // this.props.mineMedal = computeRankMedal();
        const ktNum = earnGetStore('balance/KT'); 
        for (const element1 of this.props.medalList) {
            element1.medal = [];
            medalList.forEach((element,i) => {
                // tslint:disable-next-line:max-line-length
                const medal = { title: { zh_Hans: element.desc, zh_Hant: element.descHant, en: '' }, img: `medal${element.id}`, id: element.id ,isHave:false };
                if (element.coinNum < ktNum) {
                    medal.isHave = true;
                    this.props.mineMedal.rankMedal = element.id;
                    this.props.mineMedal.desc = medal.title;
                    this.props.mineMedal.nextNeedKt = medalList[i + 1].coinNum - ktNum;
                    this.props.mineMedal.nowClass = element.typeNum;
                    this.props.mineMedal.ktNum = ktNum;
                }
                if (element1.name === element.typeNum) { // 添加到勋章等级列表
                    element1.medal.push(medal);
                }
            });
        }
        if (this.props.mineMedal.rankMedal === 8000) {
            this.props.medalest = '../../res/image/medal-white.png';
        } else {
            this.props.medalest = `earn/client/app/res/image/medals/medal${this.props.mineMedal.rankMedal}.png`;
        }
        console.log(this.props.medalList);
        console.log('+++++++++++++++++++++++++++++',this.props.medalest);
    }

    /**
     * 展示我的勋章
     */
    public showMyMedal(e:any) {
        this.funClick(e,10);
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    // 更新本地资产
    public async updateLocalWalletAssetList() {
        const assetList = await getStoreData('cloud');
        this.props.wallet = [
            { num:assetList.SC,name:`${getModulConfig('SC_SHOW')}余额` },
            { num:assetList.KT,name:`我的${getModulConfig('KT_SHOW')}` }];
        this.paint();
    }

    /**
     * 我的资料
     */
    public userInfoSet() {
        const loading = popNew('app-components1-loading-loading1');
        loadAccountSource().then(() => {
            popNew('app-view-account-home');
            
            loading.callback(loading.widget);
        });
        
    }

    // tslint:disable-next-line:max-func-body-length
    public funClick(e:any,i:number) {
        const loading = popNew('app-components1-loading-loading1');
        switch (i) {
            case 0:
                loadMallSource().then(() => {
                    popNew('earn-client-app-view-mall-exchange');
                    loading.callback(loading.widget);
                });
                break;
            case 1:
                loadRedEnvelopeSource().then(() => {
                    popNew('app-view-redEnvelope-writeRedEnv');
                    loading.callback(loading.widget);
                });
                break;
            case 2:
                break;
            case 3:
                loadShareSource().then(() => {
                    popNew('earn-client-app-view-share-inviteFriend');
                    loading.callback(loading.widget);
                });
                break;
            case 4:
                loadOpenBoxSource().then(() => {
                    popNew('earn-client-app-view-openBox-openBox');
                    loading.callback(loading.widget);
                });
                break;
            case 5:
                loadTurntableSource().then(() => {
                    popNew('earn-client-app-view-turntable-turntable');
                    loading.callback(loading.widget);
                });
                break;
            case 6:
                loadMiningSource().then(() => {
                    popNew('earn-client-app-view-mining-miningHome');
                    loading.callback(loading.widget);
                });
                break;
            case 7:
                goRecharge();
                loading.callback(loading.widget);
                break;
            case 8:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-aboutus');
                
                    loading.callback(loading.widget);
                });
                break;
            case 9:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-help');
                
                    loading.callback(loading.widget);
                });
                break;
            case 10:
                loadMedalSource().then(() => {
                    popNew('earn-client-app-view-medal-medal');
                    loading.callback(loading.widget);
                });
                break;
            case 11:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-wechatQrcode',{ fg:1 });
                
                    loading.callback(loading.widget);
                });
                break;
            case 12:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-contanctUs');
                    loading.callback(loading.widget);
                });
                break;
            default:
        }
    }

    /**
     * 分红
     */
    public dividend() {
        const loading = popNew('app-components1-loading-loading1');
        loadDividendSource().then(() => {
            popNew('app-view-dividend-home');
            loading.callback(loading.widget);
        });
    }

}
// 云端余额变化
registerStoreData('cloud',(r) => {
    console.log('云端余额变化',JSON.parse(r));
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateLocalWalletAssetList();
    }
});

// 资料变化
registerStoreData('user',(r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});