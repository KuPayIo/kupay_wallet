<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
    </div>
    <div w-class="balance">余额&nbsp;&nbsp;{{it.currencyBalance}}&nbsp;{{it.currencyName}}</div>
    <div w-class="body">
        <div w-class="get-addr">收款地址</div>
        <div w-class="get-addr-value" ev-input-change="onToChange">
            <div style="width: 500px;">
                <app-components-input-input>{input:{{it1.to}}}</app-components-input-input>
            </div>
            <div style="margin-left: 25px;" on-tap="doScan">
                <img src="../../../res/image/btn_scan.png" w-class="scanbtn" />
            </div>
        </div>
        <div w-class="pay" style="width: 690px;">
            <span>金额</span>
            <span w-class="pay-value-conversion">{{it1.payConversion||''}}</span>
        </div>

        <div w-class="pay-value" ev-input-change="onPayChange">
            <app-components-input-input>{placeHolder:"输入转账金额" }</app-components-input-input>
        </div>
        <div w-class="set-addr">
            <span>发币地址</span>
            &nbsp;&nbsp;
            <span style="margin-left: 8px;font-size: 32px;">{{it1.fromShow||''}}</span>
        </div>
        <div w-class="fees" style="width: 690px;">
            <span>矿工费</span>
            &nbsp;&nbsp;
            <span style="margin-left: 32px;font-size: 32px;">{{it1.feesShow||''}}</span>
            &nbsp;&nbsp;
            <span>{{it1.feesConversion||''}}</span>
            <span style="color: #00BD9A;position: absolute;right: 0px;">不拥堵</span>
        </div>
        <div style="position: relative;left: 166px;top: 240px;height: 80px;">
            <span w-class="{{it1.urgent?'isSelect':'unSelect'}}" on-tap="changeUrgent(e,true)">紧急</span>
            <span w-class="{{it1.urgent?'unSelect':'isSelect'}}" style="left: 210px;" on-tap="changeUrgent(e,false)">不紧急</span>
        </div>
        <div w-class="info">备注</div>
        <div w-class="info-value" ev-input-change="onInfoChange">
            <app-components-input-input>{placeHolder:"无"}</app-components-input-input>
        </div>

        <div w-class="next" on-tap="doNext">下一步</div>
    </div>
</div>