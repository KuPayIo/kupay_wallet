<div class="pi-input {{( it.prepend || it.append ) ? 'pi-input-group' : ''}}" w-class="pi-input {{( it.prepend || it.append ) ? 'pi-input-group' : ''}}"
    on-mouseover="mouseover" on-mouseleave="mouseleave">
    <div w-class="pi-input-box">
        {{ :console.log("textarea ",it)}}
        <textarea class="{{it && it.disabled ? 'pi-input-textarea__inner-disabled' : 'pi-input-textarea__inner' }}" w-class="{{it && it.disabled ? 'pi-textarea__inner-disabled' : 'pi-textarea__inner' }} "
            style="{{it.styleStr}}" placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" value="{{it && it.currentValue ? it.currentValue : ''}}"
            disabled={{it && it.disabled ? true : false}} autofocus={{it && it.autofocus ? true : false}} on-input="change" on-blur="blur"
            on-focus="focus" {{if it && it.autosize}} rows="2" {{else}} rows="{{it && it.rows ? it.rows : '2'}}" {{end}}>
        {{it && it.currentValue ? it.currentValue : ''}}
    </textarea>
    </div>
</div>