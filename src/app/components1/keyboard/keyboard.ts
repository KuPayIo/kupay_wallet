/**
 * pasword screen
 */
import { Json } from '../../../pi/lang/type';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title: string;
    closePage?:boolean;
}

export class KeyBoard extends Widget {
    public props: any;
    public ok:(value:string) => void;
    public cancel:() => void;
    constructor() {
        super();
    }

    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.init();
    }

    public init() {
        this.props = {
            ...this.props,
            defArr:[1,2,3,4,5,6],
            numbers:[1,2,3,4,5,6,7,8,9,'',0,'x'],
            pswArr:[],
            closePage:this.props.closePage ? false :true
        };
    }

    /**
     * 键盘点击事件处理
     */
    public boardItemClick(ind:number) {
        const val = this.props.numbers[ind];

        if (val !== '' && val !== 'x') {
            this.props.pswArr.push(val);
            this.paint();
        } else if (val === 'x') {
            this.clearClick();
        } else {
            return;
        }

        if (this.props.pswArr.length === 6) {
            setTimeout(() => {
                this.ok && this.ok(this.props.pswArr.join(''));
            }, 100);
        }
    }

    /**
     * 清除输入数据
     */
    public clearClick() {
        if (this.props.pswArr.length === 0) return;
        this.props.pswArr.pop();
        this.paint();
    }

    public close() {
        this.cancel && this.cancel();
    }

}
