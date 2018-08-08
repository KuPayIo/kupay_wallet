/**
 * 分红统计页面  
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getMineDetail, getMineRank, getMining, getMiningHistory, TaskSid } from '../../../store/conMgr';
import { kpt2kt } from '../../../utils/tools';

interface Items {
    isOpen:boolean;   // 是否展开详细描述
    isComplete:boolean;  // 是否已完成该挖矿步骤
    itemImg:string;  // 图片地址
    itemName:string;  // 挖矿项目名称
    itemNum:number;  // 该项目已得到数量
    itemDetail:any;  // 项目介绍
    itemBtn:string;  // 按钮名称
    itemJump:string;  // 跳转链接 
}

export class Dividend extends Widget {
    public ok: () => void;
    public state: {
        totalNum:number; 
        thisNum:number; 
        holdNum:number;
        mineRank:number; 
        data:Items[];
    };
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.init();
        this.initData();
    }

    /**
     * 初始化state参数
     */
    public init() {
        this.state = {
            totalNum:0,
            thisNum:0,
            holdNum:0,
            mineRank:0,
            data:[
                {
                    isOpen:false,
                    isComplete:true,
                    itemImg:'../../../res/image/icon_bonus_new.png',
                    itemName:'创建钱包',
                    itemNum:0,
                    itemDetail:`<div>1、创建钱包送300KT，每个APP最多创建10个钱包。</div>`,
                    itemBtn:'去创建',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/icon_bonus_phone.png',
                    itemName:'验证手机号',
                    itemNum:0,
                    itemDetail:`<div>1、验证手机号，送2500KT。</div>
                    <div>2、一个钱包只能验证一个手机号。</div>`,
                    itemBtn:'去验证',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/icon_bonus_saves.png',
                    itemName:'存币送ETH',
                    itemNum:0,
                    itemDetail:`<div>1、存币到自己的钱包地址上，存一个ETH送2000KT。</div>
                    <div>2、首次存币额外赠送1000KT。</div>
                    <div>3、1个BTC等于10个ETH。</div>`,
                    itemBtn:'去存币',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/icon_bonus_share.png',
                    itemName:'与好友分享',
                    itemNum:0,
                    itemDetail:`<div>1、系统赠送邀请红包限量1个，内含0.5ETH，分成单个0.015ETH等额红包。</div>
                    <div>2、每成功邀请一人获得500KT和0.01ETH。</div>
                    <div>3、成功邀请的标准是对方曾经达到1000KT</div>`,
                    itemBtn:'去分享',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/icon_bonus_buy.png',
                    itemName:'购买理财',
                    itemNum:0,
                    itemDetail:`<div>1、每购买1ETH等价的理财产品每天送100KT。</div>
                    <div>2、购买当日额外赠送500KT。</div>
                    <div>3、首次购买额外赠送1500KT。</div>
                    <div>4、购买理财不会降低矿山</div>`,
                    itemBtn:'去购买',
                    itemJump:''
                },{
                    isOpen:false,
                    isComplete:false,
                    itemImg:'../../../res/image/icon_bonus_chat.png',
                    itemName:'聊天',
                    itemNum:0,
                    itemDetail:`<div>1、首次参与聊天赠送700。</div>`,
                    itemBtn:'去聊天',
                    itemJump:''
                }
            ]
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看挖矿记录
     */
    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',2);
    }

    /**
     * 切换详情的展示与隐藏
     * @param ind 挖矿项目参数
     */
    public goToggle(ind:number) {
        this.state.data[ind].isOpen = !this.state.data[ind].isOpen;
        this.paint();
    }

    /**
     * 查看总排名情况
     */
    public goRank() {
        popNew('app-view-mine-dividend-dividendRank');
    }
    /**
     * 挖矿项目跳转
     * @param ind 挖矿项目参数
     */
    public goDetail(ind:number) {
        if (!this.state.data[ind].isComplete) {
            console.log(this.state.data[ind].itemBtn);
            // popNew(this.state.data[ind].itemJump);
        }
    }

    /**
     * 获取更新数据
     */
    public async initData() {
        const msg = await getMining();
        const totalNum = kpt2kt(msg.mine_total);
        const holdNum = kpt2kt(msg.mines);
        const today = kpt2kt(msg.today);
        let nowNum = (totalNum - holdNum + today) * 0.25 - today;  // 本次可挖数量为矿山剩余量的0.25减去今日已挖
        if (nowNum <= 0) {
            nowNum = 0;  // 如果本次可挖小于等于0，表示现在不能挖
        } else if ((totalNum - holdNum) > 100) {
            nowNum = (nowNum < 100 && (totalNum - holdNum) > 100) ? 100 :nowNum;  // 如果本次可挖小于100，且矿山剩余量大于100，则本次可挖100
        } else {
            nowNum = totalNum - holdNum;  // 如果矿山剩余量小于100，则本次挖完所有剩余量
        }
        
        this.state.totalNum = totalNum;
        this.state.thisNum = nowNum;
        this.state.holdNum = holdNum;
        
        const detail = await getMineDetail();
        if (detail.value.length !== 0) {
            for (let i = 0;i < detail.value.length;i++) {
                if (detail.value[i][0] === TaskSid.createWlt) {// 创建钱包
                    this.state.data[0].isComplete = true;
                    this.state.data[0].itemNum = kpt2kt(detail.value[i][1]);                    
                    this.state.data[0].itemBtn = '已创建';                    
                } else if (detail.value[i][0] === TaskSid.bindPhone) {// 注册手机号
                    this.state.data[1].isComplete = true;
                    this.state.data[1].itemNum = kpt2kt(detail.value[i][1]);
                    this.state.data[1].itemBtn = '已验证';
                } else if (detail.value[i][0] === TaskSid.chargeEth) {// 存币
                    this.state.data[2].itemNum = kpt2kt(detail.value[i][1]);
                } else if (detail.value[i][0] === TaskSid.inviteFriends) {// 与好友分享
                    this.state.data[3].itemNum = kpt2kt(detail.value[i][1]);                    
                } else if (detail.value[i][0] === TaskSid.buyFinancial) {// 购买理财
                    this.state.data[4].itemNum = kpt2kt(detail.value[i][1]);                    
                } else if (detail.value[i][0] === TaskSid.chat) {// 聊天
                    this.state.data[5].isComplete = true;
                    this.state.data[5].itemNum = kpt2kt(detail.value[i][1]);
                    this.state.data[5].itemBtn = '已聊天';                   
                }
            }
        }

        const mineRank = await getMineRank(100);
        this.state.mineRank = mineRank.me;
        this.paint();
        
    }
}