<div w-class="item" style="{{it.style?it.style:''}}">
    <span w-class="itemName">
        <pi-ui-lang>{{it.name}}</pi-ui-lang>
    </span>
    {{if it.describe && it.describe!=""}}
    <span w-class="itemDesc">
        <pi-ui-lang>{{it.describe}}</pi-ui-lang>
    </span>
    {{end}}
    <img src="../../res/image/right_arrow_blue.png" w-class="itemImg"/>
</div>