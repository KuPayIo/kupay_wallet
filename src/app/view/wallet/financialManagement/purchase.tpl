<div class="new-page" w-class="new-page">
    <div w-class="botBox">
        <div w-class="ConfirmPay">
            <span w-class="confirmText">
                {{it1.cfgData.title}}
            </span>
            <span>
                {{it1.spend}}&nbsp;{{it.product.coinType}}
            </span>
            <img src="../../../res/image/close_blue.png"  w-class="closeBtn" on-tap="close"/>
        </div>
        <div w-class="details">
            <p>{{it1.cfgData.detail[0] + it.product.unitPrice}}{{it.product.coinType}}</p>
            <p>{{it1.cfgData.detail[1] + it.product.productName}}</p>
            <p>{{it1.cfgData.detail[2] + it.amount + it1.cfgData.detail[5]}}</p>
            <p>{{it1.cfgData.detail[3] + it.product.profit}}</p>
            <p>{{it1.cfgData.detail[4] + it.product.lockday}}</p>       
        </div>
        <div w-class="tag">{{it1.cfgData.mess}}</div>
        <div ev-btn-tap="purchaseClicked" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"white"}</app-components1-btn-btn></div>
    </div>
</div>