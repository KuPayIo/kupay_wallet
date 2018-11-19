<div w-class="item">
    {{if parseInt(it.rank)<=3 }}
        <img src="app/res/image/goldmedal{{it.rank}}.png" width="40px" height="60px" w-class="goldmedalRankImg"/>
    {{else}}
        <span w-class="itemRank">{{it.rank}}</span>
    {{end}}    
    <widget w-tag="app-components1-img-img" w-class="itemImg">{imgURL:{{it.img}},width:"80px;"}</widget>
    <div style="display: inline-block;flex: 1 0 0;">
        <div w-class="itemName">{{it.name}}</div>
        <div w-class="itemDescribe">
            <pi-ui-lang>{{it.describe}}</pi-ui-lang>
            <span>{{it.descNumber}}</span>
        </div>
    </div>
</div>
