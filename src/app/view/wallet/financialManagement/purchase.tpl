<div class="new-page" w-class="new-page">
    <div w-class="botBox">
        <div w-class="ConfirmPay">
            <span w-class="confirmText">
                确认付款
            </span>
            <span>
                {{it1.spend}}&nbsp;{{it.product.coinType}}
            </span>
            <img src="../../../res/image/close_blue.png"  w-class="closeBtn" on-tap="close"/>
        </div>
        <div w-class="details">
            <p>购买单价：{{it.product.unitPrice}}{{it.product.coinType}}</p>
            <p>产品名称：{{it.product.productName}}</p>
            <p>购买份数：{{it.amount}}份</p>
            <p>年化收益：{{it.product.profit}}</p>
            <p>锁定期：{{it.product.lockday}}</p>       
        </div>
        <div w-class="tag">如果云账户余额不够，将自动从本地钱包中扣款</div>
        <div ev-btn-tap="purchaseClicked" w-class="btn"><app-components1-btn-btn>{"name":"确认","types":"big","color":"white"}</app-components1-btn-btn></div>
    </div>
</div>