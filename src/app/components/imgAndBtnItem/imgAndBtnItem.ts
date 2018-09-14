/**
 * 带图片和按钮的列表项组件
 * {"name":"拼手气红包","describe":"手气最好",img:"../../res/image/cloud_icon_cloud.png","btnName":"做任务","style":"",isComplete:false}
 * img:图片路径
 * name:标题
 * btnName:按钮名字
 * style:按钮的额外CSS
 * describe：描述，可选
 * isComplete: 是否完成，切换按钮样式
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    img:string;
    name:string;
    btnName:string;
    style?:string;
    describe?:string;
    isComplete?:boolean;
}
// ================================ 导出

export class ImgAndBtnItem extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(e:any) {
        notify(e.node,'ev-imgAndBtn-tap',{});
    }
}
