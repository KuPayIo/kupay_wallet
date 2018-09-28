<div class="new-page" w-class="new-page" on-page="doClose">
    <div w-class="main">
        <div w-class="title">{{it1.cfgData.title}}</div>
        <div w-class="list-container">
            {{for i,v of it.addrsInfo}}
            <div w-class="list-item" on-tap="chooseAddrClick(e,{{i}})">
                <div w-class="item-left">{{v.addrShow}}</div>
                <div w-class="item-right">{{v.balance}}</div>
                {{if v.isChoosed}}
                <img src="../../../../res/image/right.png" w-class="choosed"/>
                {{end}}
            </div>
            {{end}}
        </div>
    </div>
</div>