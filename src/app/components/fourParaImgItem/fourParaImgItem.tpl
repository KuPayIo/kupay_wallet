<div w-class="item">
    <img src="{{it.img}}" w-class="itemImg" />
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">
            <span w-class="itemLeft">
            {{if typeof(it.name) ==='object'}}
                <pi-ui-lang>{{it.name}}</pi-ui-lang>
            {{else}}
                {{it.name}}
            {{end}}
            </span>
            <span>{{it.data}}</span>
        </div>
        <div w-class="itemTime">
            <span w-class="itemLeft">{{it.time}}</span>
            {{if it.describe && it.describe!=""}}
            <span style="color: #F7931A;">{{it.describe}}</span>
            {{end}}
        </div>
    </div>
</div>