<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-title-bar" ev-back-click="backPrePage">
        <app-components-topBar-topBar>{title:"兑换领奖"}</app-components-topBar-topBar>
        <div w-class="ga-red-envelope-record" on-tap="redEnvelopeRecordsClick">兑换记录</div>
    </div>
    <div w-class="ga-input-father" ev-input-change="redemptionCodeChange">
        <app-components-input-input_simple>{placeHolder:{{it1.placeHolder}},input:{{it1.cid}},style:"backgroundColor:#F8F8F8;border:1px solid #D6D9DF;borderRadius:6px;padding:0 17px;"}</app-components-input_simple>
    </div>
    <div w-class="ga-convert-btn" on-tap="convertClick">兑换领取</div>
    <div w-class="ga-tag">未领取的红包，将于24小时候发起退款</div>
</div>