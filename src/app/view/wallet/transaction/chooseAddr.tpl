<div class="new-page" w-class="new-page" on-tap="maskClick">
    <div w-class="body">
        <div w-class="addr-list">
            {{for i,v of it1.addrsInfo}}
            <div w-class="item" on-tap="addrItemClick(e,{{i}})">
                <div w-class="addr">{{v.addrShow}}</div>
                <div w-class="balance">{{v.balance}}</div>
                {{if v.isChoosed}}
                <img src="../../../res/image/right.png" w-class="choosed"/>
                {{end}}
            </div>
            {{end}}
        </div>
        <div w-class="add-addr" on-tap="addAddrClick"><span>{{it1.cfgData.addAddr}}</span><img src="../../../res/image/add.png" w-class="add-icon"/></div>
    </div>
</div>