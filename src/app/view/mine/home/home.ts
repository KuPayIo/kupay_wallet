/**
 * wallet home 
 */
import { getStore as earnGetStore } from '../../../../earn/client/app/store/memstore';
import { getMedalList } from '../../../../earn/client/app/utils/util';
import { CoinType } from '../../../../earn/client/app/xls/dataEnum.s';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetUserInfo } from '../../../middleLayer/toolsBridge';
import { callBackupMnemonic } from '../../../middleLayer/walletBridge';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { getStore, register } from '../../../store/memstore';
import { copyToClipboard, popNew3, popNewMessage, popPswBox, rippleShow } from '../../../utils/tools';
import { doScanQrCode } from '../../../viewLogic/native';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    public ok:() => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
        const hasBackupMnemonic = false;
        const hasWallet = false;
        this.props = {
            isTourist:true,
            list:[
                { img:'../../../res/image/28.png',name: '',components:'' },
                { img:'../../../res/image/10.png',name: '',components:'app-view-mine-other-help' },
                { img:'../../../res/image/21.png',name: '',components:'app-view-mine-setting-setting' },
                { img:'../../../res/image/23.png',name: '',components:'app-view-mine-other-contanctUs' },
                { img:'../../../res/image/24.png',name: '',components:'app-view-mine-other-aboutus' }
                
            ],
            acc_id:'000000',
            userName:'',
            avatar:'',
            userLevel:0,
            close:false,
            hasWallet,
            hasBackupMnemonic,
            offline:false,
            walletName : getModulConfig('WALLET_NAME'),
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
                    title: this.language.rankName[0],
                    medal: []
                },
                {
                    name: '中产',
                    title: this.language.rankName[1],
                    medal: []
                },
                {
                    name: '富人',
                    title: this.language.rankName[2],
                    medal: []
                }
            ],
            medalest:''
        };
        // if (getModulConfig('GITHUB')) {
        //     this.props.list.push({ img:'../../../res/image/43.png',name: '',components:'' });
        // }
        this.initData();
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 更新数据
     */
    public initData() {
        callGetUserInfo().then(userInfo => {
            if (userInfo) {
                this.props.userName = userInfo.nickName ? userInfo.nickName :this.language.defaultUserName;
                this.props.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
                this.props.userLevel = userInfo.level;
            }
    
            const wallet = getStore('wallet');
            if (wallet) {
                this.props.hasWallet = true;
                this.props.acc_id = userInfo.acc_id ? userInfo.acc_id :'000000';
                this.props.hasBackupMnemonic = wallet.isBackup;    
                this.props.isTourist = !wallet.setPsw;        
            } else {
                this.props.hasWallet = false;
                this.props.acc_id = '';
            }
            this.medalest();
            this.paint();
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
            this.props.medalest = '../../../res/image/medal-white.png';
        } else {
            this.props.medalest = `earn/client/app/res/image/medals/medal${this.props.mineMedal.rankMedal}.png`;
        }
        console.log(this.props.medalList);
        console.log('+++++++++++++++++++++++++++++',this.props.medalest);
    }
    public backPrePage() {
        this.ok && this.ok();
    } 

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await callBackupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index',{ ...ret });
        }
    }

    /**
     * 点击跳转
     */
    public itemClick(ind:number) {
        if (ind === 0) {
            popNew('app-view-mine-account-home');
        } else {
            popNew(this.props.list[ind].components);
        }
        // this.backPrePage();
    }

    /**
     * 复制地址
     */
    public copyAddr() {
        copyToClipboard(this.props.acc_id);
        popNewMessage(this.language.tips);
    }

    /**
     * 关闭侧边栏
     */
    public closePage() {
        this.props.close = true;
        setTimeout(() => {
            this.backPrePage();
        }, 200);
        this.paint();
    }

    /**
     * 扫描二维码
     */
    public scanQrcode() {
        doScanQrCode((res) => {
            console.log('扫一扫！！！！！！！！！！！！！！！！',res);
            if (res.search(/^\d{1,}$/) !== -1) {
                // 添加好友
                popNew3('chat-client-app-view-chat-addUser',{ rid:res });
            } else if (res.startsWith('0x') && res.length === 42) {
                // 判断转账ETH地址
                popNew('app-view-wallet-transaction-transfer',{ currencyName:'ETH',address:res });
            } else {
                // 判断转账BTC
                popNew('app-view-wallet-transaction-transfer',{ currencyName:'BTC',address:res });
            }
        });
    }

    /**
     * 展示我的二维码
     */
    public showMyQrcode() {
        popNew('app-view-mine-other-addFriend');
        // this.backPrePage();
    }

    /**
     * 展示我的勋章
     */
    public showMyMedal() {
        popNew('earn-client-app-view-medal-medal');
        // this.backPrePage();
    }

    /**
     * 创建钱包
     */
    public login() {
        if (this.props.hasWallet) {
            popNew('app-view-mine-account-home');
        } else {
            popNew('app-view-wallet-create-home');
        }
        // this.backPrePage();
    }

}

// ===================================================== 本地
// ===================================================== 立即执行
register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

register('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('user/info', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});
register('user/offline',(r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.props.offline = r;
        w.paint();
    }
});