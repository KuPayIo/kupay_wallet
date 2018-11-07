<div w-class="item" ev-btn-tap="doTap">
    <img src="{{it.img}}" w-class="itemImg"/>
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">
            <pi-ui-lang>{{it.name}}</pi-ui-lang></div>
        <div w-class="itemDescribe">
            <pi-ui-lang>{{it.describe}}</pi-ui-lang></div>
    </div>
    <div w-class="itemBtn">
        {{if it.isComplete}}
        <div w-class="mybtn">
            <img src="../../res/image/32_white.png" style="width: 40px;height: 40px;margin-right: 10px;vertical-align: middle;"/>
            {{: complete = {"zh_Hans":"完成","zh_Hant":"完成","en":""} }}
            <pi-ui-lang>{{complete}}</pi-ui-lang>
        </div>
        {{else}}
        <app-components1-btn-btn>{"name":{{it.btnName}},types:"small","color":"orange","style":{{it.style}}}</app-components1-btn-btn>
        {{end}}
    </div>
</div>