/**
 * 输入框的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { getRealNode } from '../../widget/painter';

interface Props{
    start:string;//开始时间 09:00
    step:string;//间隔时间 00:30
    end:string;//结束时间 18:00
}

interface State{
    timeList:Array<string>;//时间列表
    showTimeList:boolean;//是否显示时间列表
    currentValue:string;
    currentIndex:number;//当前选中下标
}
export class TimeSelect extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props){
        super.setProps(props,oldProps);
        let timeList = this.calcTimeList();
        this.state = {
            timeList,
            showTimeList:false,
            currentValue:"",
            currentIndex:-1
        }
    }
    public focus(){
        this.state.showTimeList = true;
        this.paint();
    }
    public blur(event:any){
        this.state.showTimeList = false;
        this.paint();
    }
    public timeSelectItemClickListener(event:any,index){
        this.state.currentIndex = index;
        this.state.currentValue = this.state.timeList[index];
        this.state.showTimeList = false;
        notify(event.node,"ev-input-select",{value:this.state.currentValue});
        this.paint(true);
    }
    public clear(){
        this.state.currentIndex = -1;
        this.state.currentValue = "";
        this.paint();
    }
    //计算时间列表
    public calcTimeList(){
        const start = this.props.start;
        const end = this.props.end;
        const step = this.props.step;
        const result = [];

        if (start && end && step) {
          let current = start;
          while (this.compareTime(current, end) <= 0) {
            result.push(current);
            current = this.nextTime(current, step);
          }
        }

        return result;
    }

    public parseTime(time) {
        const values = (time || '').split(':');
        if (values.length >= 2) {
          const hours = parseInt(values[0], 10);
          const minutes = parseInt(values[1], 10);
    
          return {
            hours,
            minutes
          };
        }
        /* istanbul ignore next */
        return null;
    };
    public formatTime(time) {
        return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
    };
    public compareTime(time1, time2) {
        const value1 = this.parseTime(time1);
        const value2 = this.parseTime(time2);
    
        const minutes1 = value1.minutes + value1.hours * 60;
        const minutes2 = value2.minutes + value2.hours * 60;
    
        if (minutes1 === minutes2) {
          return 0;
        }
    
        return minutes1 > minutes2 ? 1 : -1;
    };
    
    public nextTime(time, step) {
        const timeValue = this.parseTime(time);
        const stepValue = this.parseTime(step);

        const next = {
            hours: timeValue.hours,
            minutes: timeValue.minutes
        };

        next.minutes += stepValue.minutes;
        next.hours += stepValue.hours;

        next.hours += Math.floor(next.minutes / 60);
        next.minutes = next.minutes % 60;

        return this.formatTime(next);
    };
    
}
