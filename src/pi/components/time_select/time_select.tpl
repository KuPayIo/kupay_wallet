<div w-class="pi-time-select" ev-input-focus="focus" ev-input-blur="blur" ev-input-clear="clear">
    <components-input-input>{input:{{it1 && it1.currentValue}},clearable:true}</components-input-input>
    {{if it1.showTimeList && it1.timeList.length > 0}}
    <div w-class="pi-input-dropdown">
        <div w-class="pi-scrollbar">
            <div w-class="pi-time-select-suggestion__wrap">
                <ul w-class="pi-time-select-suggestion__list">
                    {{for index,item of it1.timeList}}
                    <li w-class="pi-time-select-item {{index === it1.currentIndex ? 'pi-item-selected' : ''}}" class="pi-time-select-item" on-mousedown="timeSelectItemClickListener(e,{{index}})">{{item}}</li>
                    {{end}}
                </ul>
            </div>
        </div>
        <div w-class="pi-popper__arrow" class="pi-popper__arrow"></div>
    </div>
    {{end}}
</div>