<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
    </div>
    <div w-class="balance">余额&nbsp;&nbsp;{{it.currencyBalance}} ETH</div>
    <div w-class="body">
        <div w-class="get-addr">收款地址</div>
        <div w-class="get-addr-value" ev-input-change="onToChange">
            <pi-components-input-input>{}</pi-components-input-input>
        </div>
        <div w-class="pay">
            <span>金额</span>
            <span w-class="pay-value-conversion">{{it1.payConversion||''}}</span>
        </div>

        <div w-class="pay-value" ev-input-change="onPayChange">
            <pi-components-input-input>{}</pi-components-input-input>
        </div>
        <div w-class="set-addr">
            <span>发币地址</span>
            &nbsp;&nbsp;
            <span>{{it1.fromShow||''}}</span>
        </div>
        <div w-class="fees">
            <span>矿工费</span>
            &nbsp;&nbsp;
            <span>{{it1.feesShow||''}}</span>
            &nbsp;&nbsp;
            <span>{{it1.feesConversion||''}}</span>
        </div>
        <div w-class="info">备注</div>
        <div w-class="info-value" ev-input-change="onInfoChange">
            <pi-components-input-input>{placeHolder:"无"}</pi-components-input-input>
        </div>

        <div w-class="next" on-tap="doNext">下一步</div>
    </div>
</div>