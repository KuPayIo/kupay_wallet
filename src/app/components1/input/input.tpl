<div w-class="pi-input-box" class="pi-input">
    <input 
        w-class="pi-input__inner" 
        style="{{it.style ? it.style : ''}}"
        type="{{it.itype == 'password' ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
    />
    {{if it1.showClear}}
    <img w-class="clearBtn" src="../../res/image/btn_img_close.png" on-tap="clearClickListener"/>
    {{end}}
</div>