<div w-class="pi-input-box" class="pi-input">
    <input 
        w-class="pi-input__inner {{it.disabled ? 'pi-input__inner-disabled' : '' }}" 
        class="pi-input"
        style="{{it.style}}"
        type="{{it.itype ? it.itype : 'text'}}" 
        autocomplete="off"
        placeholder="{{it.placeHolder?it.placeHolder:''}}" 
        value="{{it1.currentValue}}"
        disabled={{ it.disabled ? true : false}}
        on-input="change"
        on-blur="blur"
        on-focus="focus"
    />
</div>