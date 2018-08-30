<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
    </div>

    <div w-class="body">
        <div w-class="body-main">
            <div w-class="pay">{{it.type==="转账"?"-":(it.type==="收款"?"+":"")}}{{it.pay}} {{it.currencyName}}</div>
            <div w-class="result">{{it.result}}</div>
        </div>
        <div w-class="body-other">
            <div w-class="body-title" style="margin-top: 0px">收币地址</div>
            <div w-class="body-title-value">{{it.toAddr}}</div>
            <div w-class="body-title">矿工费</div>
            <div w-class="body-title-value">{{it.fee}}</div>
            <div w-class="body-title">备注</div>
            <div w-class="body-title-value">{{it.info}}</div>
            <div w-class="body-title">发币地址</div>
            <div w-class="body-title-value">{{it.fromAddr}}</div>
            <div w-class="body-title">交易时间</div>
            <div w-class="body-title-value">{{it.showTime}}</div>
            <div w-class="body-title">交易号</div>
            <div w-class="body-title-value">{{it.hash}}</div>
        </div>
    </div>
</div>