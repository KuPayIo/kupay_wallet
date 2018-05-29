<div w-class="transaction-list" class="hide-scrollbar" style="overflow-y: auto;overflow-x: hidden;height: {{it.height||700}}px;">
    <div>
        {{for i,each of it.list}}
        <div w-class="each" on-tap="showTransactionDetails(e,{{i}})">
            <div w-class="type" style="color:{{each.type==='收款'?'#40875E':(each.type==='转账'?'#874040':'')}}">{{each.type}}</div>
            <div w-class="account">{{each.account}}</div>
            <div w-class="pay">{{each.type==='收款'?'+':(each.type==='转账'?'-':'')}}{{each.showPay}}</div>
            <div w-class="time">{{each.showTime}}</div>
            <div w-class="result">{{each.result}}</div>
            <div w-class="line" style="top: 138px;"></div>
        </div>
        {{end}}
    </div>
</div>