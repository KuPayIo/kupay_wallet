<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="topbar">
        <div><span>{{it1.outCurrency}}</span>→<span>{{it1.inCurrency}}</span></div>
        <img src="../../res/image/AION.png" w-class="history"/>
    </div>
    <div w-class="body">
        <div w-class="currency-contaier">
            <div w-class="currency-item">
                <span>出账币种</span>
                <span w-class="currency">{{it1.outCurrency}}</span>
                <img src="../../res/image/AION.png" w-class="choose-out-currency"/>
            </div>
            <div w-class="currency-item">
                <span>发出数量</span>
                <div w-class="input-father" ev-input-change="amountChange"><app-components-input-input>{}</app-components-input-input></div>
            </div>
            <div w-class="available-balance">可用余额:{{it1.balance}}</div>
        </div>
        <div w-class="exchange-msg">
            <div w-class="min-limit-item">最小发出数量:(ETH)<span w-class="min-limit">{{it1.minimum}}</span></div>
            <div w-class="max-limit-item">最大发出数量:(ETH)<span w-class="max-limit">{{it1.maxLimit}}</span></div>
            <div w-class="rate">实时汇率 1{{it1.outCurrency}}={{it1.rate}}{{it1.inCurrency}}</div>
        </div>
        <div w-class="currency-contaier">
            <div w-class="currency-item">
                <span>入账币种</span>
                <span w-class="currency">{{it1.inCurrency}}</span>
                <img src="../../res/image/AION.png" w-class="choose-out-currency"/>
            </div>
            <div w-class="currency-item">
                <span>收到数量</span>
                <div w-class="input-father"><app-components-input-input>{input:{{it1.receiveAmount}}}</app-components-input-input></div>
            </div>
        </div>
        <div w-class="ok-btn" on-tap="sureClick">确定</div>
    </div>
</div>