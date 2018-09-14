<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
<div>
    <app-components1-topBar-topBar>{"title":"ETH资管第2期",background:"#fff"}</app-components1-topBar-topBar>
    <div w-class="top-head">
        <div w-class="row1">
            <div w-class="col1">
                <div w-class="desc">预期年化收益</div>
                <div w-class="content">{{it.product.profit}}%</div>
            </div>
            <div w-class="col2">
                <div w-class="desc">持续天数</div>
                <div w-class="content">{{it.product.days}}</div>
            </div>
        </div>
        <div w-class="row2">以上利率均为预期年化结算利率，以实际回报为准</div>
        <div w-class="row3"><div w-class="progress" style="width:{{it1.usePercent}}%;"></div></div>
        <div w-class="row4">
            <div style="width:{{it1.usePercent}}%;"></div>
            <div w-class="sold" >已售&nbsp;{{it1.usePercent}}%</div>
        </div>
    </div>
    <div w-class="bottom-box">
        <div w-class="row5">{{it.product.productIntroduction}}</div>
        <div w-class="title">详细信息</div>
        <div w-class="detail-box">
            <div w-class="detail">价格：{{it.product.unitPrice}}&nbsp;{{it.product.coinType}}/份</div>
            <div w-class="detail">剩余：{{it1.leftPercent}}%</div>
            <div w-class="detail">锁定期：无</div>
        </div>
        <div w-class="unit">
            <span>单价/份</span>
            <div w-class="limit"><span>（</span><span w-class="limit-number">限购{{it.product.limit}}份</span><span>）</span></div>
        </div>
        <div w-class="select-num">
            <span w-class="unit-price">
                {{it.product.unitPrice}}&nbsp;{{it.product.coinType}}
            </span>
            <div w-class="right-box">
                <img w-class="sub" on-tap="minus" src="../../../res/image/less.png"/>
                <span>{{it1.amount}}</span>
                <img w-class="plus" on-tap="add" src="../../../res/image/add_gray.png" />
            </div>
        </div>
        <div w-class="read">阅读声明</div>
        <div ev-btn-tap="purchaseClicked" w-class="btn"><app-components1-btn-btn>{"name":"购买","types":"big","color":"blue"}</app-components1-btn-btn></div>
    </div>
</div>
</div>