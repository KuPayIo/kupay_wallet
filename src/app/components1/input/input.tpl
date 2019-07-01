{{: ty = it.itype == 'password' ? 'password' : 'text'}}
<div w-class="pi-input-box {{it.notUnderLine?'':'input-focused-'+it.focused}}" class="pi-input">
    <input 
        w-class="pi-input__inner" 
        style="{{it.disabled ? 'color:#ccc;' : ''}}{{it.style ? it.style : ''}}"
        type="{{it.originalType}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it && it.currentValue ? it.currentValue : ''}}"
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
        on-compositionstart="compositionstart"
        on-compositionend="compositionend"
        disabled={{ it.disabled }}
    />
    {{if it.showClear}}
    <img w-class="clearBtn" src="../../res/image/30_gray.png" on-tap="clearClickListener"/>
    {{end}}
</div>