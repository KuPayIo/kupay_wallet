<div w-class="basicInput" style="{{it.style}}">
    <span w-class="prepend">
    {{if it.isShowPin}}
    <span w-class="other"><pi-ui-lang>{"zh_Hans":"拼","zh_Hant":"拼","en":""}</pi-ui-lang></span>
    {{end}}
    <pi-ui-lang>{{it.prepend}}</pi-ui-lang>    
    </span>
    <span style="flex: 1;height: 100%;">
        <app-components-input-input>{placeHolder: {{it.placeholder?it.placeholder:""}},style:"text-align: right;",itype:{{it.itype?it.itype:"text"}},input:{{it.input?it.input:''}},notUnderLine:{{it.notUnderLine?true:false}},maxLength:{{it.maxLength?it.maxLength:''}} }</app-components-input-input>
    </span>
    {{if it.append && it.append!=""}}
    <span w-class="append">
        <pi-ui-lang>{{it.append}}</pi-ui-lang></span>
    {{end}}
</div>