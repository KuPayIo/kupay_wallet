<div w-class="base">
    <div w-class="slider" style="width: {{it.showValue?70:100}}%;">
        <div w-class="slider_bar" style="width: {{it1.showValue}}%; left: 0%;"></div>
        <div w-class="slider_block" style="left: {{it1.showValue}}%;">
            <div w-class="slider_block_button" on-mousedown="doButtonDown" on-touchdown="doButtonDown"></div>
        </div>
    </div>
    {{if it.showValue}}
    <div style="width: 20%;margin-left: 5%;" ev-selectcount="selectCountChange">
        <components-selectcount-selectcount>{value:{{it.value}},min:{{it.min}},max:{{it.max}}}</components-selectcount-selectcount>
    </div>
    {{end}}
</div>