<div w-class="item" on-tap="productItemClick">
    <div w-class="row1">
        <div>{{it.product.productName}}</div>
        <div w-class="status {{it1.stateBg}}">{{it1.stateShow}}</div>
    </div>
    <div w-class="row2">
        <div w-class="col">
            <div w-class="tag">持有({{it.product.unitPrice}}/份)</div>
            <div w-class="tag1">{{it.product.amount}}份</div>
        </div>
        <div w-class="col">
            <div w-class="tag">昨日收益({{it.product.coinType}})</div>
            <div w-class="tag2">{{it.product.yesterdayIncoming}}</div>
        </div>
        <div w-class="col">
            <div w-class="tag">累计</div>
            <div w-class="tag1">{{it.product.days}}天</div>
        </div>
    </div>
</div>