<div 
    class="pi-input {{( it.prepend || it.append ) ? 'pi-input-group' : ''}}" 
    w-class="pi-input {{( it.prepend || it.append ) ? 'pi-input-group' : ''}}" 
    on-mouseover="mouseover" 
    on-mouseleave="mouseleave">
{{if it && it.itype === "textarea"}}
<div w-class="pi-input-box">
    <textarea 
        class="{{it && it.disabled ? 'pi-textarea__inner-disabled' : 'pi-textarea__inner' }}" 
        w-class="{{it && it.disabled ? 'pi-textarea__inner-disabled' : 'pi-textarea__inner' }} "
        style="{{it1.styleStr}}"
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}"
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        disabled={{it && it.disabled ? true : false}}
        autofocus={{it && it.autofocus ? true : false}}
        on-input="change"
        on-blur="blur"
        on-focus="focus"
        {{if it && it.autosize}} 
        rows="1"
        {{else}}
        rows="{{it && it.rows ? it.rows : '2'}}"
        {{end}}>
        {{it1 && it1.currentValue ? it1.currentValue : ''}}
    </textarea>
</div>
{{else}}
    {{if it.prepend}}
        <div w-class="pi-input-group__prepend">{{it.prepend}}</div>
    {{end}}
    <div w-class="pi-input-box">
    <input 
        w-class="{{it && it.disabled ? 'pi-input__inner-disabled' : 'pi-input__inner' }} {{it && it.prepend ? 'pi-input_inner-prepend' : ''}} {{it && it.append ? 'pi-input_inner-append' : ''}}" 
        class="{{it && it.disabled ? 'pi-input__inner-disabled pi-input-dom' : 'pi-input__inner1 pi-input-dom' }}"
        style="{{it1.styleStr}}"
        type="{{it.itype ? it.itype : 'text'}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        disabled={{it && it.disabled ? true : false}}
        autofocus={{it && it.autofocus ? true : false}}
        on-input="change"
        on-blur="blur"
        on-focus="focus"
        />
        {{if it1 && it1.showClear()}}<span w-class="pi-input__suffix" class="pi-input__suffix" on-tap="clearClickListener"></span>{{end}}
    </div>
    
    {{if it.append}}
        <div w-class="pi-input-group__append">{{it.append}}</div>
    {{end}}
{{end}}
</div>