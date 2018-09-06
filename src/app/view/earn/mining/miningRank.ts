/**
 * 挖矿及矿山排名
 */
// ============================== 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find, register } from '../../../store/store';
import { Json } from '../../../../pi/lang/type';
import { getMineRank, getMiningRank } from '../../../net/pull';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class DividendItem extends Widget {
    public ok: () => void;
    public state:{
        data:any[];
        more:boolean;
        miningTotal:number;
        mineTotal:number;
    }
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public setProps(props: Json, oldProps?: Json)  {
        super.setProps(props,oldProps);
        this.state = {
            data:[],
            more:false,
            miningTotal:0,
            mineTotal:0
        };
        this.initData();
        this.initEvent();
    }
    

    /**
     * 获取更新数据
     */
    public async initData() {
        // const data = [{index:"001",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"002",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"003",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"004",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"005",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"006",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"007",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"008",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},{index:"009",name:"德邦一号",num:25222325,img:"../../res/image/cloud_icon_cloud.png"},];    
        let data = null;
        if(this.props.fg === 0){
            data = find('miningRank');
            if(data){
                this.state.data = data.miningRank;
            }
        }else{
            data = find('mineRank');
            if(data){
                this.state.data = data.mineRank;
            }
        }
        const mining = find("miningTotal");
        if(mining){
            this.state.mineTotal = mining.totalNum;
            this.state.miningTotal = mining.holdNum
        }

        
        this.paint();
    }

    /**
     * 更新事件
     */
    public initEvent() {
        getMineRank(100);
        getMiningRank(100);
    }
}

register('miningRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initDate();
    }
});