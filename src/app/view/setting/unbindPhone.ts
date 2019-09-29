/**
 * 解绑手机号
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getUserInfo } from '../../utils/tools';

export class UnbindPhone extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.props = {
            phoneNumber:'',
            areaCode:''
        };
        getUserInfo().then(userInfo => {
            this.props.phoneNumber = userInfo.phoneNumber;
            this.props.areaCode = userInfo.areaCode;
            this.paint();
        });
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public unbindClick() {
        popNew('app-view-mine-setting-phone',{ unbind:true },() => {
            this.ok && this.ok();
        });
    }
}