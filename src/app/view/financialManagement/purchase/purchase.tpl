<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="botBox">
        <div w-class="ConfirmPay">
            <span w-class="confirmText">
                确认付款
            </span>
            <span>
                {{it.money}} ETH
            </span>
            <img src="../../../res/image/exchange_delete.png"  w-class="closeBtn" on-tap="close"/>
        </div>
        <div w-class="details">
            <p>购买单价：{{it.unitPrice}}</p>
            <p>产品名称：{{it.productName}}</p>
            <p>购买份数：{{it.amount}}份</p>
            <p>年化收益：{{it.expectedEarnings}}</p>
            <p>锁定期：{{it.lockday}}</p>       
        </div>
        <div w-class="btnBox">
                如果云账户余额不够，将自动从本地钱包中扣款
                <div w-class="confirmBtn" on-tap="purchaseClicked">
                        立即购买
                </div>
        </div>
    </div>
</div>