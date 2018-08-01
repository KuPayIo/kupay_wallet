<div w-class="pi-input-simple" class="pi-input-simple">
    <input 
        w-class="pi-input-simple__inner" 
        class="pi-input-simple__inner"
        style="{{it.style ? it.style : '' }}"
        type="{{it.itype ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        on-input="change"
        on-blur="blur"
        on-focus="focus"/>
</div>