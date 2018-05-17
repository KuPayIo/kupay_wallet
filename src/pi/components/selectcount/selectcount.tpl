<div w-class="base">
    <span w-class="btn btn_left" on-tap="tapLeft" on-longtap="langTapLeft">-</span>
    <span w-class="input" ev-input-change="inputChange" ev-input-blur="inputBlur">
        <components-input-input>{input:{{it.value.toString()}},style:{{it1.style}}}</components-input-input>
    </span>
    <span w-class="btn btn_right" on-tap="tapRight" on-longtap="langTapRight">+</span>
</div>