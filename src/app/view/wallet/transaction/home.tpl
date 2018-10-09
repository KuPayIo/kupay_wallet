<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="chooseAddrClick">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":{{it.currencyName}},background:"linear-gradient(to right,#38CFE7,#318DE6)",nextImg:"../../res/image/location.png"}</app-components1-topBar-topBar>
        <div w-class="head">
            <img src="../../../res/image/currency/{{it.currencyName}}.png" w-class="currency-icon"/>
            <div w-class="asset-container">
                <div w-class="balance">{{it1.balance}}</div>
                <div w-class="balance-value">￥{{it1.balanceValue}}</div>
            </div>
            {{if it1.canConvert}}
            <div w-class="btn-exchange" on-tap="convertCurrencyClick">{{it1.cfgData.tabs[0]}}</div>
            {{end}}
        </div>
        <div w-class="operating">
            <div w-class="operating-item" on-tap="doTransferClick"><img src="../../../res/image/transfer.png" w-class="icon"/><span>{{it1.cfgData.tabs[1]}}</span></div>
            <div w-class="line"></div>
            <div w-class="operating-item" on-tap="doReceiptClick"><img src="../../../res/image/19.png" w-class="icon"/><span>{{it1.cfgData.tabs[2]}}</span></div>
        </div>
    </div>
    <div w-class="show-container">
        <div w-class="quotes">{{it1.cfgData.tabs[3]}}&nbsp;￥{{it1.rate}}/{{it.currencyName}}</div>
        {{if it1.redUp}}
        <div w-class="{{it.gain > 0 ? 'up' : 'down'}}">{{it1.cfgData.tabs[4]}}&nbsp;{{it.gain > 0 ? '+' : ''}}{{it.gain}}%</div>
        {{else}}
        <div w-class="{{it.gain > 0 ? 'down' : 'up'}}">{{it1.cfgData.tabs[4]}}&nbsp;{{it.gain > 0 ? '+' : ''}}{{it.gain}}%</div>
        {{end}}
    </div>
    <div w-class="body">
        <div w-class="tx-list-container">
            {{if it1.txList.length === 0}}
            <div w-class="no-recode">
                <img src="../../../res/image/dividend_history_none.png" w-class="no-recode-icon"/>
                <div w-class="no-recode-text">{{it1.cfgData.noneRes}}</div>
            </div>
            {{end}}
            <div w-class="tx-list">
                {{for i,v of it1.txList}}
                <div on-tap="txListItemClick(e,{{i}})">
                <app-components-fourParaImgItem-fourParaImgItem>{"name":{{v.txTypeShow}},"data":{{v.pay}},"time":{{v.TimeShow}},"describe":{{v.statusShow}},img:"../../res/image/{{v.txType === 2 ? "receive_icon.png" : "transfer_icon.png"}}"}</app-components-fourParaImgItem-fourParaImgItem>
                </div>
                {{end}}
            </div>
        </div>
    </div>
</div>