<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it.currencyName}}}</app-components-topBar-topBar>

        <div w-class="search" on-tap="doSearch">
            <span>选择地址</span>
        </div>
    </div>

    <div w-class="body">
        <div w-class="balance">{{it1.showBalance}}</div>
        <div w-class="balance-conversion">{{it1.showBalanceConversion}}</div>
        <div w-class="transaction-record">
            <div w-class="record-text">交易记录</div>
            <div w-class="introduction-text" on-tap="showIntroduction">简介</div>
            <div w-class="line"></div>
            <div w-class="transaction-list">
                {{for i,each of it1.list}}
                <div w-class="each" on-tap="showTransactionDetails(e,{{i}})">
                    <div w-class="type" style="color:{{each.type==='收款'?'#008000':(each.type==='转账'?'#FF0000':'')}}">{{each.type}}</div>
                    <div w-class="account">{{each.account}}</div>
                    <div w-class="pay">{{each.type==='收款'?'+':(each.type==='转账'?'-':'')}}{{each.showPay}}</div>
                    <div w-class="time">{{each.showTime}}</div>
                    <div w-class="result">{{each.result}}</div>
                </div>
                {{end}}
            </div>
        </div>
    </div>
    <div w-class="footer">
        <div w-class="transfer" on-tap="doTransfer">转账</div>
        <div w-class="receipt" on-tap="doReceipt">收款</div>
    </div>

</div>