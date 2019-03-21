/**
 * 4参数带图片列表项组件
 * {"name":"拼手气红包","data":"1 ETH","time":"04-30 14:32:00","describe":"手气最好",img:"../../res/image/cloud_icon_cloud.png"}
 * img:图片路径
 * name:左侧标题
 * data:右侧数据
 * time:时间
 * describe：右侧描述，可选
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    img:string;
    name:string;
    data:string;
    time:string;
    describe?:string;
}
// ================================ 导出

export class FourParaImgItem extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(event:any) {
        notify(event.node,'ev-btn-tap',{});
    }
}
