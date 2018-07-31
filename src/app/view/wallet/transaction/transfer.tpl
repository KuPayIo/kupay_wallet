<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}},iconColor:"white",style:"backgroundColor:rgba(68, 140, 255, 1);color:#fff;"}</app-components-topBar-topBar>
    </div>
   <div w-class="qrcode-scan" on-tap="doScan">
        <img src="../../../res/image/btn_scan.png" w-class="scanbtn" />
    </div>
    <div w-class="balance">余额&nbsp;&nbsp;{{it.currencyBalance}}&nbsp;<span w-class="currency-name">{{it.currencyName}}</span></div>
    <div w-class="body">
        <div w-class="ga-item get-addr-value" ev-input-change="onToChange">
            <div w-class="textarea-father">
                <app-components-input-input_textarea>{input:{{it1.to}},itype:"textarea",placeHolder:"请输入收款地址"}</app-components-input-input_textarea>
            </div>
        </div>
        <div w-class="ga-item pay ga-item-space-between" >
            <div w-class="pay-value input-father" ev-input-change="onPayChange">
                <app-components-input-input>{placeHolder:"输入转账金额",input:{{it1.pay}},style:{{it1.inputStyle}} }</app-components-input-input>
            </div>
            <span w-class="pay-value-conversion">≈￥{{it1.payConversion||''}}</span>
        </div>

        {{if it1.showNote}}
        <div w-class="ga-item">
            <div w-class="info-value input-father" ev-input-change="onInfoChange">
                <app-components-input-input>{placeHolder:"备注",style:{{it1.inputStyle}}}</app-components-input-input>
            </div>
        </div>
        {{end}}

        <div w-class="ga-item pay ga-item-space-between" >
            <div w-class="pay-value input-father" ev-input-change="onGasFeeChange">
                <app-components-input-input>{placeHolder:"矿工费",input:{{it1.fees||''}},style:{{it1.inputStyle}} }</app-components-input-input>
            </div>
            <span w-class="pay-value-conversion">≈￥{{it1.feesConversion||''}}</span>
        </div>
       
        <div w-class="ga-item ga-congestion-container">
            <img src="../../../res/image/rate_tip.png" w-class="ga-img"/>
            <span w-class="ga-congestion-title">拥堵情况</span>
            <span w-class="ga-congestion">畅通</span>
        </div>
       
        <div w-class="next" on-tap="doNext">发送</div>

        <div w-class="set-addr">
            <span>发币地址</span>
            <span w-class="addr-from">{{it.fromAddr||''}}</span>
        </div>
    </div>
</div>