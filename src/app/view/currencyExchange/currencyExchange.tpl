<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="topbar" ev-back-click="backClick">
        <app-components-topBar-topBar>{title:"货币买卖"}</app-components-topBar-topBar>
        <div w-class="history" on-tap="exchangeRecordClick">兑换记录</div>
    </div>
    <div w-class="exchange-msg">
        <div w-class="available-balance">可用金额{{it1.outBalance}}{{it1.outCurrency}}</div>
        <div w-class="min-limit-item">最小发出数量:<span w-class="ga-limit-currency">({{it1.outCurrency}})</span><span w-class="ga-limit-amount">{{it1.minimum}}</span></div>
        <div w-class="max-limit-item">最大发出数量:<span w-class="ga-limit-currency">({{it1.outCurrency}})</span><span w-class="ga-limit-amount">{{it1.maxLimit}}</span></div>
    </div>
    <div w-class="body">
        <div w-class="currency-contaier">
            <div w-class="ga-outin-container">
                <span w-class="ga-outin">卖出</span>
                <img src="../../res/image/{{it1.outCurrency}}.png" w-class="choose-out-currency" on-tap="outCurrencySelectClick"/>
                <span w-class="currency">{{it1.outCurrency}}</span>
            </div>
            <div w-class="ga-switch"><div w-class="ga-switch-img-box" on-tap="switchInOutClick"><img src="../../res/image/currency_exchange.png" w-class="ga-switch-img"/></div></div>
            <div w-class="ga-outin-container">
                <span w-class="ga-outin">买入</span>
                <img src="../../res/image/{{it1.inCurrency}}.png" w-class="choose-out-currency" on-tap="inCurrencySelectClick"/>
                <span w-class="currency">{{it1.inCurrency}}</span>
            </div>
        </div>
        <div w-class="ga-input-container">
            <div w-class="input-father" ev-input-change="outAmountChange"><app-components-input-input>{input:{{it1.outAmount}},placeHolder:"发出数量"}</app-components-input-input></div>
            <div w-class="ga-space"></div>
            <div w-class="input-father"><app-components-input-input>{input:{{it1.receiveAmount}},placeHolder:"收到数量"}</app-components-input-input></div>
        </div>
        <div w-class="rate" on-tap="rateDescClick">
            <img src="../../res/image/rate_tip.png" w-class="ga-tip" /> 
            <span>实时汇率 1{{it1.outCurrency}}={{it1.rate}}{{it1.inCurrency}}</span>
        </div>
        <div w-class="ok-btn" on-tap="sureClick">确定</div>
    </div>
</div>