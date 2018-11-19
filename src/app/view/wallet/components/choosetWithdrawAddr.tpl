<div class="new-page" w-class="new-page" on-tap="doClose">
    <div w-class="main">
        <div w-class="title">
            <pi-ui-lang>{"zh_Hans":"地址","zh_Hant":"地址","en":""}</pi-ui-lang>
        </div>
        <div w-class="list-container">
            {{for i,v of it.addrsInfo}}
            <div w-class="list-item" on-tap="chooseAddrClick(e,{{i}})">
                <div w-class="item-left">{{v.addrShow}}</div>
                <div w-class="item-right">{{v.balance%1===0?v.balance.toFixed(2):v.balance}}</div>
                {{if v.isChoosed}}
                <img src="../../../res/image/right.png" w-class="choosed"/>
                {{end}}
            </div>
            {{end}}
        </div>
    </div>
</div>