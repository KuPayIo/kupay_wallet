/**
 * wheel view
 */
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    dataList:string[];
}
export class WheelView extends Widget {
    public ok:(active:number) => void;
    public cancel:() => void;
    public setProps(props:Props,oldPros:Props) {
        super.setProps(props,oldPros);
        this.init();
    }

    public init() {
        this.state = {
            active:0
        };
    }

    public attach() {
        const itemHeight = 80;
        const ul = (<any>this.tree).children[0].children[2];
        const ulNode = getRealNode(ul);
        ulNode.addEventListener('scroll',() => {
            const scrollHeight = ulNode.scrollTop;
            // tslint:disable-next-line:max-line-length
            this.state.active = (scrollHeight % itemHeight >= itemHeight / 2) ? Math.ceil(scrollHeight / itemHeight) : Math.floor(scrollHeight / itemHeight);
        });
    }

    public okClick(e:any) {
        this.ok && this.ok(this.state.active);
    }

    public cancelClick() {
        this.cancel && this.cancel();
    }
}