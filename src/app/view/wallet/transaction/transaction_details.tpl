<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
    </div>

    <div w-class="body">
        <div w-class="pay">{{it.type==="转账"?"-":"+"}}{{it.pay}} ETH</div>
        <div w-class="result">{{it.result}}</div>
        <div w-class="line"></div>
        <div w-class="body-title">收币地址</div>
        <div w-class="body-title-value">{{it.to}}</div>
        <div w-class="body-title">矿工费</div>
        <div w-class="body-title-value">{{it.tip}}</div>
        <div w-class="body-title">备注</div>
        <div w-class="body-title-value">{{it.info}}</div>
        <div w-class="body-title">发币地址</div>
        <div w-class="body-title-value">{{it.from}}</div>
        <div w-class="body-title">交易时间</div>
        <div w-class="body-title-value">{{it.showTime}}</div>
        <div w-class="body-title">交易号</div>
        <div w-class="body-title-value">{{it.id}}</div>
    </div>
</div>