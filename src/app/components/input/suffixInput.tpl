<div w-class="pi-input-box input-focused-{{it1.focused}}" class="pi-input">
    <input 
        w-class="pi-input__inner" 
        class="pi-input"
        style="{{it.style}}"
        type="{{it.itype ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it.placeHolder}}" 
        value="{{it1.currentValue}}"
        on-input="change"
        on-blur="blur"
        on-focus="focus"
    />
    {{if it1.showClear}}<img w-class="pi-input__suffix" src="../../res/image/{{it.available ? 'icon_right2' : 'fail'}}.png" on-tap="clearClickListener"/>{{end}}
</div>