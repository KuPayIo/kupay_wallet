<div class="pi-input {{( it.prepend || it.append ) ? 'pi-input-group' : ''}}" w-class="pi-input {{( it.prepend || it.append ) ? 'pi-input-group' : ''}}"
    on-mouseover="mouseover" on-mouseleave="mouseleave">
    <div w-class="pi-input-box">
        <textarea class="{{it && it.disabled ? 'pi-input-textarea__inner-disabled' : 'pi-input-textarea__inner' }}" w-class="{{it && it.disabled ? 'pi-textarea__inner-disabled' : 'pi-textarea__inner' }} "
            style="{{it1.styleStr}}" placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
            disabled={{it && it.disabled ? true : false}} autofocus={{it && it.autofocus ? true : false}} on-input="change" on-blur="blur"
            on-focus="focus" {{if it && it.autosize}} rows="2" {{else}} rows="{{it && it.rows ? it.rows : '2'}}" {{end}}>
        {{it1 && it1.currentValue ? it1.currentValue : ''}}
    </textarea>
    </div>
</div>