<div w-class="basicInput" style="{{it.style}}">
    <span w-class="prepend"><span w-class="other">拼</span>{{it.prepend}}</span>
    <span style="flex: 1;height: 100%;"><app-components1-input-input>{placeHolder: {{it.placeholder?it.placeholder:""}},style:"text-align: right;",itype:{{it.itype?it.itype:"text"}} }</app-components1-input-input></span>
    {{if it.append && it.append!=""}}
    <span w-class="append">{{it.append}}</span>
    {{end}}
</div>