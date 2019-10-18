import { getStore as earnGetStore } from '../../../earn/client/app/store/memstore';
import { getMedalList } from '../../../earn/client/app/utils/tools';
import { getCompleteTask } from '../../../earn/client/app/view/home/home';
import { CoinType } from '../../../earn/client/app/xls/dataEnum.s';
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { clearUser, getStoreData, goRecharge } from '../../api/walletApi';
import { registerStoreData } from '../../postMessage/listenerStore';
import { getModulConfig } from '../../public/config';
import { initStore, register, setStore } from '../../store/memstore';
import { fetchCloudWalletAssetList, getUserInfo, rippleShow } from '../../utils/pureUtils';
// tslint:disable-next-line:max-line-length
import { loadAboutAppSource, loadAccountSource, loadCloudRechargeSource, loadDividendSource, loadHaihaiSource, loadMallSource, loadMedalSource, loadMiningSource, loadOpenBoxSource, loadPersonalInfoSource, loadRedEnvelopeSource, loadShareSource, loadTurntableSource } from './sourceLoaded';

export const forelet = new Forelet();
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    showDataList:any;// 广场，粉丝，关注，好友
    mallFunction:any;// 小功能
    user:any;
    hasWallet:boolean;
    hasBackupMnemonic:boolean;
    isTourist:boolean;
    mineMedal:any;
    medalList:any;
    medalest:string;// 最高勋章
    uid:number;// 用户ID
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
        user:{
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
        medalest:'',
        uid:0
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.state = STATE;
        this.initData();
    }

    /**
     * 更新数据
     */
    public initData() {
        Promise.all([getUserInfo()]).then(async ([userInfo]) => {
            this.props.user.nickName = userInfo.nickName ? userInfo.nickName :'昵称未设置';
            this.props.user.avatar = userInfo.avatar;
            this.props.user.userLevel = userInfo.level;
            this.props.user.acc_id = userInfo.acc_id ? userInfo.acc_id :'000000';
            this.props.uid = await getStoreData('user').uid;
            this.paint();
            this.medalest();
            this.updateLocalWalletAssetList();
            this.setRedFlags();
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
        this.state.wallet = [
            { num:assetList.SC,name:`${getModulConfig('SC_SHOW')}余额` },
            { num:assetList.KT,name:`我的${getModulConfig('KT_SHOW')}` }];
        this.paint();
    }

    /**
     * 我的资料
     */
    public userInfoSet() {
        loadAccountSource().then(() => {
            popNew('app-view-account-home');
        });
        
    }

    // tslint:disable-next-line:max-func-body-length
    public funClick(e:any,i:number) {
        const date = new Intl.DateTimeFormat('zh', {
            year: 'numeric',  
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const day = date.format(new Date()).split(' ')[0];
        const msg = JSON.parse(localStorage.getItem(`redFlags_${this.props.user.acc_id}`));
        switch (i) {
            case 0:
                loadMallSource().then(() => {
                    popNew('earn-client-app-view-mall-exchange');
                });
                break;
            case 1:
                loadRedEnvelopeSource().then(() => {
                    popNew('app-view-redEnvelope-writeRedEnv');
                });
                break;
            case 2:
                break;
            case 3:
                msg.invite = false;
                loadShareSource().then(() => {
                    popNew('earn-client-app-view-share-inviteFriend');
                });
                break;
            case 4:
                msg.treasureChest = false;
                loadOpenBoxSource().then(() => {
                    popNew('earn-client-app-view-openBox-openBox');
                });
                break;
            case 5:
                msg.turntable = false;
                loadTurntableSource().then(() => {
                    popNew('earn-client-app-view-turntable-turntable');
                });
                break;
            case 6:
                msg.mining = false;
                loadMiningSource().then(() => {
                    popNew('earn-client-app-view-mining-miningHome');
                });
                break;
            case 7:
                goRecharge();
                break;
            case 8:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-aboutus');
                });
                break;
            case 9:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-help');
                });
                break;
            case 10:
                loadMedalSource().then(() => {
                    popNew('earn-client-app-view-medal-medal');
                });
                break;
            case 11:
                loadHaihaiSource().then(() => {
                    popNew('chat-client-app-view-info-userDetail', { uid: this.props.uid });
                });
                break;
            case 12:
                loadAboutAppSource().then(() => {
                    popNew('app-view-aboutApp-contanctUs');
                });
                break;
            default:
        }
        msg.day = day;
        localStorage.setItem(`redFlags_${this.props.user.acc_id}`,JSON.stringify(msg));
        setStore('flags/redFlags',msg);
    }

    /**
     * 分红
     */
    public dividend() {
        loadDividendSource().then(() => {
            popNew('app-view-dividend-home');
        });
    }

    /**
     * 设置小红点的显示
     */
    public setRedFlags() {
        const date = new Intl.DateTimeFormat('zh', {
            year: 'numeric',  
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const day = date.format(new Date()).split(' ')[0];
        const msg = JSON.parse(localStorage.getItem(`redFlags_${this.props.user.acc_id}`));
        if (!msg) {
            const msg  = {
                day,
                invite:true,
                treasureChest:true,
                turntable:true,
                mining:true
            };
            localStorage.setItem(`redFlags_${this.props.user.acc_id}`,JSON.stringify(msg));

            return;
        }
        if (day === msg.day) {
            // 同一天登录
            this.props.mallFunction[3].fg = msg.invite;
            this.props.mallFunction[4].fg = msg.treasureChest;
            this.props.mallFunction[5].fg = msg.turntable;
            this.props.mallFunction[6].fg = msg.mining;
        } else {
            // 第二天登录
            this.props.mallFunction[3].fg = true;
            this.props.mallFunction[4].fg = true;
            this.props.mallFunction[5].fg = true;
            this.props.mallFunction[6].fg = true;
        }
        this.paint();
    }

    // 测试
    public test() {
        console.log('用户信息==============================',this.props);
    }

}
const STATE = {
    wallet:[
        { num:999.99,name:'银两余额' },
        { num:999.99,name:'我的嗨豆' }
    ]
};
// 云端余额变化
registerStoreData('cloud',(r) => {
    STATE.wallet = [
        { num:r.SC,name:'银两余额' },
        { num:r.KT,name:'我的嗨豆' }
    ];
    forelet.paint(STATE);
});

// 资料变化  监听踢人下线
registerStoreData('user',(r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

// 监听红点变化
register('flags/redFlags',(r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.setRedFlags();
    }
});