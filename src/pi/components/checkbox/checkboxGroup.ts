/**
 * 选择框的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    chooseAll: string;
    list: any[];
    min: number;
    max: number;
}

interface State {
    chooseAllType: string;

}

export class Checkbox extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = <any>{};
        this.checkChooseAllType();
    }
    public doAllClick(event: any) {
        if (!this.props.chooseAll) return;
        let newType = "true";
        if (this.state.chooseAllType === "true") newType = "false";
        this.props.list = this.props.list.map(v => {
            if (v.type === "disabled") return v;
            v.type = newType;
            return v;
        });
        notify(event.node, 'ev-checkbox-all-click', { oldType: this.state.chooseAllType, newType: newType });
        this.state.chooseAllType = newType;
        this.paint();
    }
    public doEachClick(event: any) {
        if (event.index === undefined) return

        let oldChooseLen = this.props.list.filter(v => v.type === "true").length;
        this.props.list[event.index].type = event.newType;
        if (this.props.min !== undefined || this.props.max !== undefined) {
            let chooseLen = this.props.list.filter(v => v.type === "true").length;
            if ((this.props.min !== undefined && chooseLen < this.props.min && chooseLen < oldChooseLen)
                || (this.props.max !== undefined && chooseLen > this.props.max && chooseLen > oldChooseLen)) {
                this.props.list[event.index].type = event.oldType;
                if (this.props.list[event.index].reset) {
                    this.props.list[event.index].reset++;
                } else {
                    this.props.list[event.index].reset = 1;
                }
            }
        }

        this.checkChooseAllType();
        this.paint();
    }

    private checkChooseAllType() {
        if (!this.props.chooseAll) return;
        let ischooseNone = this.props.list.some((v) => v.type === "false");
        let isChoose = this.props.list.some(v => v.type === "true");
        if (!isChoose) {
            this.state.chooseAllType = "false";
        } else if (ischooseNone) {
            this.state.chooseAllType = "indeterminate";
        } else {
            this.state.chooseAllType = "true";
        }
    }

}
