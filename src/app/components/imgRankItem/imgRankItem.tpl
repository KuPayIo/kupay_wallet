<div w-class="item">
    {{if parseInt(it.rank)<=3 }}
        <img src="../../res/image/goldmedal{{it.rank}}.png" width="40px" height="60px" w-class="goldmedalRankImg"/>
    {{else}}
        <span w-class="itemRank">{{it.rank}}</span>
    {{end}}    
    <img src="{{it.img}}" w-class="itemImg" />
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">{{it.name}}</div>
        <div w-class="itemDescribe">
            <pi-ui-lang>{{it.describe}}</pi-ui-lang>
            <span>{{it.descNumber}}</span>
        </div>
    </div>
</div>
