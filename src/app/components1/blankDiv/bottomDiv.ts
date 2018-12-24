/**
 * 顶部空白div  主要用来空出底部高度
 */
import { Widget } from "../../../pi/widget/widget";
import { getStore, register } from "../../store/memstore";
import { topHeight } from "../../utils/constants";
import { Forelet } from "../../../pi/widget/forelet";


// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class BottomDiv extends Widget{
    public create(){
        super.create();
        this.props = {
            height:getStore('setting/bottomHeight',topHeight)
        };
    }
}

register('setting/bottomHeight',(bottomHeight:number)=>{
    const w = forelet.getWidget(WIDGET_NAME);
    if(w){
        w.props.height = bottomHeight;
        w.paint();
    }
});