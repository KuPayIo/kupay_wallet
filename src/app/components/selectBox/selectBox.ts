/**
 * selectBox
 * {list:[{img:'',name:'',num:''}],selected:1}
 * list:下拉框列表，包含参数
 *      img:图片路径
 *      name:名字
 *      num：数字
 * selected：默认选中的参数
 */
// =============================================导入
import { Json } from '../../../pi/lang/type';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../modulConfig';
// ================================================导出
interface Props {
    list:any[];
    selected:number;
    forceHide?:boolean; // 是否强制关闭下拉框
}
export class SelectBox extends Widget {
    public ok: () => void;
    public props:any;
    constructor() {
        super();
    }

    public setProps(oldProps:Json,newProps:Json) {
        super.setProps(oldProps,newProps);
        this.props = {
            ...this.props,
            ktShow:getModulConfig('KT_SHOW'),
            showList:false,
            list:this.props.list,
            selected:this.props.selected
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 切换选择项
     */
    public changeSelect(e:any,ind:number) {
        this.props.selected = ind;
        this.props.showList = false;
        notify(e.node,'ev-selectBox-change',{ selected:this.props.selected });
        this.paint();
    }
    /**
     * 展示下拉列表
     */
    public showList() {
        this.props.showList = true;
        this.paint();
    }
}