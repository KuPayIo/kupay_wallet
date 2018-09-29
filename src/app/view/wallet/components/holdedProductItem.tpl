<div w-class="item" on-tap="productItemClick">
    <div w-class="row1">
        <div>{{it.product.productName}}</div>
        <div w-class="status {{it1.stateBg}}">{{it1.stateShow}}</div>
    </div>
    <div w-class="row2">
        <div w-class="col">
            <div w-class="tag">{{it1.cfgData.tips[0] + "("+it.product.unitPrice +"/"+ it1.cfgData.tips[1]}})</div>
            <div w-class="tag1">{{it.product.amount + it1.cfgData.tips[1]}}</div>
        </div>
        <div w-class="col">
            <div w-class="tag">{{it1.cfgData.tips[2] +"("+ it.product.coinType}})</div>
            <div w-class="tag2">{{it.product.yesterdayIncoming}}</div>
        </div>
        <div w-class="col">
            <div w-class="tag">{{it1.cfgData.tips[3]}}</div>
            <div w-class="tag1">{{it.product.days + it1.cfgData.tips[4]}}</div>
        </div>
    </div>
</div>