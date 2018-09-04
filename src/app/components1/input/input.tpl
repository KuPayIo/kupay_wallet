<div w-class="pi-input-box" class="pi-input">
    <input 
        w-class="{{it && it.disabled ? 'pi-input__inner-disabled' : 'pi-input__inner' }} {{it && it.prepend ? 'pi-input_inner-prepend' : ''}} {{it && it.append ? 'pi-input_inner-append' : ''}}" 
        class="pi-input {{it && it.disabled ? 'pi-input__inner-disabled pi-input-dom' : 'pi-input__inner1 pi-input-dom' }}"
        style="{{it.style ? it.style : ''}}"
        type="{{it.itype ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        disabled={{it && it.disabled ? true : false}}
        autofocus={{it && it.autofocus ? true : false}}
        on-input="change"
        on-blur="blur"
        on-focus="focus"
    />
    {{if it1.showClear}}<img w-class="pi-input__suffix" src="../../res/image/btn_img_close.png" on-tap="clearClickListener"/>{{end}}
</div>