<div class="new-page" w-class="new-page">
    <div w-class="botBox">
        <div w-class="ConfirmPay">
            <span w-class="confirmText">
                <pi-ui-lang>{"zh_Hans":"确认付款","zh_Hant":"確認付款","en":""}</pi-ui-lang>
            </span>
            <span>
                {{it1.spend}}&nbsp;{{it.product.coinType}}
            </span>
            <img src="../../../res/image/close_blue.png"  w-class="closeBtn" on-tap="close"/>
        </div>
        <div w-class="details">
            <p><pi-ui-lang>{"zh_Hans":"购买单价：","zh_Hant":"購買單價：","en":""}</pi-ui-lang> {{it.product.unitPrice}}{{it.product.coinType}}</p>
            <p><pi-ui-lang>{"zh_Hans":"产品名称：","zh_Hant":"產品名稱：","en":""}</pi-ui-lang> {{it.product.productName}}</p>
            <p><pi-ui-lang>{"zh_Hans":"购买份数：","zh_Hant":"購買份數：","en":""}</pi-ui-lang> {{it.amount}} <pi-ui-lang>{"zh_Hans":"份","zh_Hant":"份","en":""}</pi-ui-lang></p>
            <p><pi-ui-lang>{"zh_Hans":"年化收益：","zh_Hant":"年化收益：","en":""}</pi-ui-lang> {{it.product.profit}}</p>
            <p><pi-ui-lang>{"zh_Hans":"锁定期：","zh_Hant":"鎖定期：","en":""}</pi-ui-lang> {{it.product.lockday}}</p>       
        </div>
        <div w-class="tag"><pi-ui-lang>{"zh_Hans":"如果云账户余额不够，将自动从本地钱包中扣款","zh_Hant":"如果雲賬戶餘額不夠，將自動從本地錢包中扣款","en":""}</pi-ui-lang></div>
        {{: btnName = {"zh_Hans":"确认","zh_Hant":"確認","en":""} }}
        <div ev-btn-tap="purchaseClicked" w-class="btn"><app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"white"}</app-components1-btn-btn></div>
    </div>
</div>