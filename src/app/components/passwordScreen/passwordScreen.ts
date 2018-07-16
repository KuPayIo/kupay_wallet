/**
 * 密码屏
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title: string;
    extraText?:string;
}

export class PasswordScreen extends Widget {
    public props: Props;
    constructor() {
        super();
    }

    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        console.log(props);
        this.init();
    }

    public init(){
        this.state = {
            defaultArr:new Array(6),
            pswArr:[]
        }
    }
}
