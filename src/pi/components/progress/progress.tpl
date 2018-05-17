<div>
    {{if it.type==="outer"}}
    <div w-class="bar">
        <div w-class="bar_outer" style="height: 6px;">
            <div w-class="bar_inner" style="width: {{it.value*100}}%;background-color: {{it.color||'#409eff'}};">
            </div>
        </div>
    </div>
    <div w-class="outer_text" style="font-size: 14.4px;">{{it.value*100}}%</div>
    {{elseif it.type==="inner"}}
    <div w-class="bar" style="padding-right:0px;">
        <div w-class="bar_outer" style="height: 18px;">
            <div w-class="bar_inner" style="width: {{it.value*100}}%;background-color: {{it.color||'#409eff'}};">
                <div w-class="inner_text" style="font-size: 14.4px;">{{it.value*100}}%</div>
            </div>
        </div>
    </div>
    {{elseif it.type==="circle"}}
    <div style="width: 126px;height: 126px;position: relative;">
        <widget w-tag="ui-html">{{it1.circleProgress}}</widget>
        {{if it.status === "exception"}}
        <div w-class="circle_text" style="font-size: 16px;color: {{it.color||'#409eff'}};">×</div>
        {{elseif it.status === "success"}}
        <div w-class="circle_text" style="font-size: 16px;color: {{it.color||'#409eff'}};">√</div>
        {{else}}
        <div w-class="circle_text" style="font-size: 16px;">{{it.value*100}}%</div>
        {{end}}
    </div>
    {{end}}

</div>