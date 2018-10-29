/**
 * radioList
 */
// =============================================导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { setStore } from '../../../store/memstore';
// ================================================导出
export class ItemList extends Widget {
    public ok: () => void;
   
    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.state = {
            selected:0,
            list:[],
            keys:[]
        };
        const list = [];
        const keys = [];
        for (const i in this.props.list) {
            list.push(this.props.list[i]);
            keys.push(i);
        }
        const val = this.props.list[this.props.selected];
        this.state.selected =  list.indexOf(val); 
        this.state.list = list;
        this.state.keys = keys;
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public changeSelect(e:any) {
        if (this.props.flag === 0) {
            setStore('setting/language',this.state.keys[e.value === 2 ? 0 :e.value]);
        } else if (this.props.flag === 1) {
            setStore('setting/currencyUnit',this.state.keys[e.value]);            
        } else {
            setStore('setting/changeColor',this.state.keys[e.value]);  
        }
    }
}