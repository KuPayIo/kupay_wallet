<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it.currencyName}},style:"color:#fff;backgroundColor:#203260;",iconColor:"white"}</app-components-topBar-topBar>

        <div w-class="search" on-tap="doSearch">
            <span>...</span>
        </div>
    </div>

    <div w-class="container">
        <div w-class="balance">{{it1.showBalance}}</div>
        <div w-class="balance-conversion">{{it1.showBalanceConversion}}</div>
        <div id="k-line" w-class="k-line"></div>
    </div>
    <div w-class="transaction-record">
        <div w-class="box">
            <div w-class="record-text">交易记录</div>
            <div w-class="box1" >
                <div w-class="ga-up-and-down">-2.63%</div>
                <div on-tap="currencyExchangeClick" w-class="ga-exchange">买/卖</div>
            </div>
        </div>
        {{if it1.list.length<=0}}
        <div w-class="no-record-container">
            <img w-class="no-record" src="../../../res/image/img_none_record.png" />
            <div w-class="no-record-text">还没有交易记录</div>
        </div>
        {{else}}
        <div w-class="transaction-list" class="hide-scrollbar">
            <currency_details_list$>{list:{{it1.list}}}</currency_details_list>
        </div>
        {{end}}
        <div w-class="footer">
            <div w-class="btn transfer" on-tap="doTransfer">
                <img src="../../../res/image/icon_trans_transfer.png" alt="" />
                <span style="margin-left: 20px;">转账</span>
            </div>
            <div w-class="btn receipt" on-tap="doReceipt">
                <img src="../../../res/image/icon_trans_receipt.png" alt="" />
                <span style="margin-left: 20px;">收款</span>
            </div>
        </div>
    </div>


</div>