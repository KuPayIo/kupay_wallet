<div class="new-page" w-class="new-page" on-tap="maskClick">
    <div w-class="body">
        <div w-class="addr-list">
            {{for i,v of it.addrsInfo}}
            <div w-class="item" on-tap="addrItemClick(e,{{i}})">
                <div w-class="addr">{{v.addrShow}}</div>
                <div w-class="balance">{{v.balance%1===0?v.balance.toFixed(2):v.balance}}</div>
                {{if v.isChoosed}}
                <img src="../../../res/image/right.png" w-class="choosed"/>
                {{end}}
            </div>
            {{end}}
        </div>
        <div w-class="add-addr" on-tap="addAddrClick"><pi-ui-lang>{"zh_Hans":"添加地址","zh_Hant":"添加地址","en":""}</pi-ui-lang><img src="../../../res/image1/add.png" w-class="add-icon"/></div>
    </div>
</div>