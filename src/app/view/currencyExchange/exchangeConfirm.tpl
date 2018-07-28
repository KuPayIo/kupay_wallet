<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-bottome-container">
        <div w-class="ga-exchange-head">
            <div w-class="ga-exchanges">
                <span w-class="ga-sure">确认换币</span>
                <span>{{it.outCurrency}}</span>
                <span w-class="ga-arrow">→</span>
                <span>{{it.inCurrency}}</span>
            </div>
            <img w-class="ga-cancel" on-tap="cancelClick" src="../../res/image/AION.png"/>
        </div>
        <div w-class="ga-container">
            <div w-class="ga-item">
                <div w-class="ga-tag">发出</div>
                <div w-class="ga-content">{{it.outAmount}}</div>
                <div w-class="ga-unit">{{it.outCurrency}}</div>
            </div>
            <div w-class="ga-item">
                <div w-class="ga-tag">收到</div>
                <div w-class="ga-content">{{it.inAmount}}</div>
                <div w-class="ga-unit">{{it.inCurrency}}</div>
            </div>
            <div w-class="ga-item">
                <div w-class="ga-tag">矿工费</div>
                <div w-class="ga-content">{{it.fee}}</div>
                <div w-class="ga-unit">{{it1.feeUnit}}</div>
            </div>
        </div>
        <div w-class="ga-ok-btn" on-tap="okClick">确定</div>
    </div>
</div>