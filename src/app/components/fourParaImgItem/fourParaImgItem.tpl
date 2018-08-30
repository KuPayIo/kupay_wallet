<div w-class="item">
    <img src="{{it.img}}" w-class="itemImg"/>
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">
            <span>{{it.name}}</span>
            <span w-class="itemRight">{{it.data}}</span>
        </div>
        <div w-class="itemTime">
            <span>{{it.time}}</span>
            {{if it.describe && it.describe!=""}}
            <span w-class="itemRight" style="color: #F7931A;">{{it.describe}}</span>
            {{end}}
        </div>
    </div>
</div>