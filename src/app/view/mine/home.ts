import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';
import { getLocalStorage } from "../../utils/tools";

export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            hasNews: true,
            mineList: [{
                icon: "icon_mine_wallet.png",
                text: "我的钱包",
                components: "app-view-mine-walletManagement-walletManagement"
            }, {
                icon: "icon_mine_annal.png",
                text: "交易记录",
                components: "app-view-mine-transaction-record"
            }, {
                icon: "icon_mine_address.png",
                text: "地址管理",
                components: "app-view-mine-addressManage-addressManage"
            }, {
                icon: "icon_mine_Language.png",
                text: "语言设置",
                components: "app-view-mine-languageAndcoinset-language"
            }, {
                icon: "icon_mine_money.png",
                text: "货币设置",
                components: "app-view-mine-languageAndcoinset-coinset"
            }, {
                icon: "icon_mine_problem.png",
                text: "常见问题",
                components: "app-view-mine-FAQ-FAQ"
            }, {
                icon: "icon_mine_about.png",
                text: "关于我们",
                components: "app-view-mine-aboutus-aboutus"
            }, {
                icon: "icon_mine_share.png",
                text: "分享下载链接",
                components: "app-view-financialManagement-fund-share"
            }]
        }
    }


    public itemClick(e, index) {
        if (index <= 1) {
            const wallets = getLocalStorage("wallets");
            if (!wallets) {
                popNew("app-components-message-message", { type: "notice", content: "请创建钱包" });
                return
            }
        }

        popNew(this.state.mineList[index].components);
    }

    public goNotice(event: any) {
        popNew("app-view-messageList-messageList", { hasNews: this.state.hasNews }, (r) => {
            if (r) {
                this.state.hasNews = false;
                this.paint();
            }
        }, () => { });
    }
}