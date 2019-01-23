<div w-class="item" style="{{it.style?it.style:''}}">
    <span w-class="itemName">
        <pi-ui-lang>{{it.name}}</pi-ui-lang>
    </span>
    {{if typeof(it.describe) === 'string'}}
        <span w-class="itemDesc">
            {{it.describe}}
        </span>
    {{else}}
        <span w-class="itemDesc">
            <pi-ui-lang>{{it.describe}}</pi-ui-lang>
        </span>
    {{end}}
    
    <img src="../../res/image/right_arrow2_gray.png" w-class="itemImg"/>
</div>