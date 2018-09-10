<div w-class="item">
    <img src="../../res/image/{{it.img}}" w-class="itemImg"/>
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">
            <span w-class="itemLeft">{{it.name}}</span>
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