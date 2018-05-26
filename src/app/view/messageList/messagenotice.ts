import {Widget} from "../../../pi/widget/widget";
import {notify} from "../../../pi/widget/event";
import { popNew } from "../../../pi/ui/root";

export class messagenotice extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.props={       
            type:"公告",
            title:"标题标题标题标题标题标题标题标题标题标题",
            content:`fairblock发布内测版本，该版本实现了
            ·助记词导入钱包
            ·基于助记词和BIP44规范创建钱包
            ·支持钱包基本功能，包括：转账、收款、交易记录
            ·支持添加以太坊货币资产
            更多功能稍后退出`,
            time:"4-5"
        }
    }

    public create(){
        super.create();
        this.props = JSON.parse(window.sessionStorage.item);
    }

    public backPrePage(){
        this.ok && this.ok();
    }
   
}