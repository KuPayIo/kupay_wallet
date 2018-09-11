<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="chooseAddrClick">
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
            <div w-class="operating-item" on-tap="doReceiptClick"><img src="../../../res/image/19.png" w-class="icon"/><span>收款</span></div>
        </div>
    </div>
    <div w-class="show-container">
        <div w-class="quotes">行情&nbsp;￥{{it1.rate}}/{{it.currencyName}}</div>
        <div w-class="{{it.gain > 0 ? 'up' : 'down'}}">今日&nbsp;{{it.gain > 0 ? '+' : ''}}{{it.gain}}%</div>
    </div>
    <div w-class="body">
        <div w-class="tx-list-container">
            {{if it1.txList.length === 0}}
            <div w-class="no-recode">
                <img src="../../../res/image/qrcode.png" w-class="no-recode-icon"/>
                <div w-class="no-recode-text">还没有记录哦</div>
            </div>
            {{end}}
            <div w-class="tx-list">
                {{for i,v of it1.txList}}
                <div on-tap="txListItemClick(e,{{i}})">
                <app-components-fourParaImgItem-fourParaImgItem>{"name":{{v.txTypeShow}},"data":{{v.pay}},"time":{{v.TimeShow}},"describe":{{v.statusShow}},img:{{v.txType === 1 ? "transfer_icon.png" : "receive_icon.png"}}}</app-components-fourParaImgItem-fourParaImgItem>
                </div>
                {{end}}
            </div>
        </div>
    </div>
</div>