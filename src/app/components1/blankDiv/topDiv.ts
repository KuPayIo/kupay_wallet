/**
 * 顶部空白div  主要用来空出刘海高度
 */
import { Widget } from "../../../pi/widget/widget";
import { getStore, register } from "../../store/memstore";
import { topHeight } from "../../utils/constants";
import { Forelet } from "../../../pi/widget/forelet";


// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class TopDiv extends Widget{
    public create(){
        super.create();
        this.props = {
            height:getStore('setting/topHeight',topHeight)
        };
    }
}

register('setting/topHeight',(topHeight:number)=>{
    const w = forelet.getWidget(WIDGET_NAME);
    forelet.paint(topHeight);
    if(w){
        w.props.height = topHeight;
        w.paint();
    }
});