<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:"交易记录"}</app-components-topBar-topBar>
    </div>

    <div w-class="body">
        {{if it1.list.length<=0}}
        <div w-class="no-record"></div>
        <div w-class="no-record-text">还没有交易记录</div>
        {{end}}
        <div w-class="transaction-list" class="hide-scrollbar">
            {{for i,each of it1.list}}
            <div w-class="each" on-tap="showTransactionDetails(e,{{i}})">
                <div w-class="type" style="color:{{each.type==='收款'?'#40875E':(each.type==='转账'?'#874040':'')}}">{{each.type}}</div>
                <div w-class="account">{{each.account}}</div>
                <div w-class="pay">{{each.type==='收款'?'+':(each.type==='转账'?'-':'')}}{{each.showPay}}</div>
                <div w-class="time">{{each.showTime}}</div>
                <div w-class="result">{{each.result}}</div>
            </div>
            {{end}}
        </div>
    </div>

</div>