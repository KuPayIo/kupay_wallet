<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":{{it.currencyName}},background:"linear-gradient(to right,#38CFE7,#318DE6)",nextImg:"location.png"}</app-components1-topBar-topBar>
        <div w-class="head">
            <img src="../../../res/image/currency/{{it.currencyName}}.png" w-class="currency-icon"/>
            <div w-class="asset-container">
                <div w-class="balance">{{it1.balance}}</div>
                <div w-class="balance-value">￥{{it1.balanceValue}}</div>
            </div>
            <div w-class="btn-exchange">换币</div>
        </div>
        <div w-class="operating">
            <div w-class="operating-item" on-tap="doTransferClick"><img src="../../../res/image/transfer.png" w-class="icon"/><span>转账</span></div>
            <div w-class="line"></div>
            <div w-class="operating-item"><img src="../../../res/image/19.png" w-class="icon"/><span>收款</span></div>
        </div>
    </div>
    <div w-class="show-container">
        <div w-class="quotes">行情&nbsp;￥{{it1.rate}}/ETH</div>
        <div  w-class="up-down">今日&nbsp;-0.54%</div>
    </div>
    <div w-class="body">
        <div w-class="tx-list-container">
            <div w-class="tx-list">
                {{for i,v of it1.txList}}
                <div on-tap="txListItemClick(e,{{i}})">
                <app-components-fourParaImgItem-fourParaImgItem>{"name":{{v.txType === 1 ? "转账" : "收款"}},"data":{{v.pay}},"time":{{v.TimeShow}},"describe":{{v.statusShow}},img:{{v.txType === 1 ? "transfer_icon.png" : "receive_icon.png"}}}</app-components-fourParaImgItem-fourParaImgItem>
                </div>
                {{end}}
            </div>
        </div>
    </div>
</div>