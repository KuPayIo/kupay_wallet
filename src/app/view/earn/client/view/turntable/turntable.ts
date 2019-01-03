/**
 * 大转盘 - 首页
 */


import { Widget } from "../../../../../../pi/widget/widget";
import { popNew } from "../../../../../../pi/ui/root";


interface Props {
    selectTicket: number;
    boxList: any;
}
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        selectTicket: 0,
        boxList: [
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
            {
                isOpen: false,
            },
        ]
    }

    
    /**
     * 重置所有宝箱
     */
    public resetBoxList(){
        this.props.boxList.forEach(element => {
            element.isOpen = false;
        });
        this.paint();
    }

    /**
     * 更改宝箱类型
     * @param num 票种
     */
    public change(num: number) {
        this.resetBoxList();
        this.props.selectTicket = num;
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('app-view-earn-client-view-openBox-openBoxHistory',{type:2});
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}