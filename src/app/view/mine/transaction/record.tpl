<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:"交易记录"}</app-components-topBar-topBar>
    </div>

    <div w-class="body">
        {{if it1.list.length<=0}}
        <div w-class="no-record"></div>
        <div w-class="no-record-text">还没有交易记录</div>
        {{end}}
        <div w-class="transaction-list">
                <app-view-wallet-transaction-currency_details_list>{list:{{it1.list}},height:1140}</app-view-wallet-transaction-currency_details_list>
        </div>
    </div>

</div>