<div w-class="item" ev-btn-tap="doTap">
    <img src="{{it.img}}" w-class="itemImg"/>
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">{{it.name}}</div>
        <div w-class="itemDescribe">{{it.describe}}</div>
    </div>
    <div w-class="itemBtn"><app-components-btn-btn>{"name":{{it.btnName}},types:"small","color":"orange","style":{{it.style}}}</app-components-btn-btn></div>
</div>