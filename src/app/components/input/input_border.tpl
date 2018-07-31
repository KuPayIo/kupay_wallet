<div class="pi-input" w-class="pi-input" on-mouseover="mouseover" on-mouseleave="mouseleave">
    <div w-class="pi-input-box">
        <input w-class="{{it && it.disabled ? 'pi-input__inner-disabled' : 'pi-input__inner' }}" style="{{it1.styleStr}}" type="{{it.itype ? it.itype : 'text'}}"
            autocomplete="off" placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
            disabled={{it && it.disabled ? true : false}} autofocus={{it && it.autofocus ? true : false}} on-input="change" on-blur="blur"
            on-focus="focus" /> {{if it1 && it1.showClear()}}
        <span w-class="pi-input__suffix" class="pi-input-border__suffix" on-tap="clearClickListener"></span>{{end}}
    </div>

</div>