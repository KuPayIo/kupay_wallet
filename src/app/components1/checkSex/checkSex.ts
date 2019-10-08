// tslint:disable-next-line:missing-jsdoc
import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../../utils/pureUtils';

interface Props {
    title:string;
    active:number;// 性别  0男  1女 2中性
    sexList:any;// 性别列表
}

/**
 * 性别 
 */
export class CheckSex extends Widget {
    public ok: (value:number) => void;
    public props:Props = {
        title:'',
        active:2,
        sexList:[
            { sex:'男',src:'../../res/image/male.png' },
            { sex:'女',src:'../../res/image/female.png' }
        ]
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    /**
     * 选择性别
     */
    public checkTypeSex(index:number) {
        this.props.active = index;
        this.paint();
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    /**
     * 点击确认按钮
     */
    public okBtnClick() {
        this.ok && this.ok(this.props.active);
    }
}