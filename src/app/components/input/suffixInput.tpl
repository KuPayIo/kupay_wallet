<div w-class="pi-input-box input-focused-{{it.focused}}" class="pi-input">
    <input 
        w-class="pi-input__inner" 
        class="pi-input"
        style="{{it.style}}"
        type="{{it.itype ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it.placeHolder}}" 
        value="{{it.currentValue}}"
        on-input="change"
        on-blur="blur"
        on-focus="focus"
    />
    {{if it.showClear}}<img w-class="pi-input__suffix" src="../../res/image/{{it.available ? 'icon_right2' : 'fail'}}.png" on-tap="clearClickListener"/>{{end}}
</div>