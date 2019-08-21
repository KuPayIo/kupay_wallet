<div w-class="item" style="{{it.style?it.style:''}}">
    <span w-class="itemName">
        <pi-ui-lang>{{it.name}}</pi-ui-lang>
    </span>
    {{if it.describe}}
        {{if typeof(it.describe) === 'string'}}
            <div w-class="itemDesc">
                {{it.describe}}
            </div>
        {{else}}
            <div w-class="itemDesc">
                <pi-ui-lang>{{it.describe}}</pi-ui-lang>
            </div>
        {{end}}
    {{end}}
    {{if it.img}}
    <div style="margin-right:10px;height:80px;">
        {{if !it.chooseImage}}
            <widget w-tag="app-components1-img-img" on-tap="uploadAvatar">{imgURL:{{it.avatar}},width:"80px;"}</widget>
        {{else}}
            <widget w-tag="pi-ui-html" on-tap="uploadAvatar" w-class="ui-html">{{it.avatarHtml}}</widget>
        {{end}}
    </div>
    {{end}}
    <img src="app/res/image/right_arrow2_gray.png" w-class="itemImg"/>
</div>