/**
 * 基础列表项组件
 * {"name":"用户名","describe":"未设置"}
 * name:左侧标题
 * describe：右侧描述，可选
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    name:string; // 左侧名字
    describe?:string;
    style?:string;// 样式
    chooseImage:boolean;// 是否选择图片
    avatarHtml:string;//
    avatar:string;
    img:boolean;// 是否有图片
}
// ================================ 导出

// tslint:disable-next-line:completed-docs
export class BasicItem extends Widget {
    public props:Props = {
        name:'',
        describe:'',
        style:'',
        chooseImage:false,
        avatarHtml:'',
        avatar:'',
        img:false
    };
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(event:any) {
        notify(event.node,'ev-btn-tap',{});
    }
}
