<div w-class="pi-input-box input-focused-{{it1.focused}}" class="pi-input">
    <input 
        w-class="pi-input__inner {{it.isCenter?'pi-input__inner1':''}}" 
        class="pi-input"
        style="{{it.style}}"
        type="{{it.closeEye ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it.placeHolder}}" 
        value="{{it1.currentValue}}"
        on-input="change"
        on-blur="blur"
        on-focus="focus"
    />
    {{if it1.showClear}}<img w-class="pi-input__suffix" src="../../res/image/{{it.available ? 'icon_right2' : 'fail'}}.png" on-tap="clearClickListener"/>{{end}}
    {{if it.isShow}}<img src="{{it.closeEye?'../../res/image/closeEyes.png':'../../res/image/openEyes.png'}}" w-class="close-eyes" on-tap="showPassword"/>{{end}}
</div>