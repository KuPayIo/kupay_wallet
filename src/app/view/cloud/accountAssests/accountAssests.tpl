<div class="ga-new-page" w-class="ga-new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{title:{{it.coinType}}}</app-components-topBar-topBar>
    <div w-class="assestsHead">
        <img src="../../../res/image/currency/{{it.coinType}}.png" w-class="assestsImg" />
        <span w-class="coinType">{{it.coinType}}</span>
        <span w-class="balance">{{it1.balance}}</span>
    </div>
    <div w-class="panelBtnGroup">
        {{for k,v of it1.panelBtns}}
        <span w-class="btn {{v.isActive ? 'active' : ''}}" on-tap="panelBtnClicked(e,{{k}})">{{v.label}}</span>
        {{end}}
    </div>

    <div w-class="mask" style="height:{{it1.maskHeight-470}}px;">
        <widget w-tag={{it1.routePath}}></widget>
    </div>
    <div w-class="botFixed">
        <div w-class="fixedBtn Charge" on-tap="chargeClicked">
            <img src="../../../res/image/cloud_charge.png" w-class="btnIcon" />充值
        </div>
        <div w-class="fixedBtn Withdraw" on-tap="withdrawClicked">
            <img src="../../../res/image/cloud_withdraw.png" w-class="btnIcon" />提现
        </div>
    </div>
</div>