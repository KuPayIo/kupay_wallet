<div class="ga-new-page" w-class="ga-new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{title:"{{it.coinType}}充值"}</app-components-topBar-topBar>
    <div w-class="iconsBox">
        <div w-class="local">
            <img src="../../../res/image/cloud_icon_local.png" w-class="icon" />
            <div w-class="text">
                本地钱包
            </div>
        </div>
        <div w-class="arow">
                <img src="../../../res/image/cloud_change.png" />
        </div>
        <div w-class="cloud">
            <img src="../../../res/image/cloud_icon_cloud.png" w-class="icon" />
            <div w-class="text">
                云端账户
            </div>
        </div>
    </div>

    <div w-class="paddingBox">
        <div w-class="charge">
                <span w-class="chargeAmount">充值数量</span>
                <input type="number" w-class="amountInput" placeholder="{{it1.amount}}" on-input="amountInput"/>
                <span w-class="unit">{{it.coinType}}</span>
        </div>

        <div w-class="charge">
                <span w-class="chargeAmount">手续费</span>
                <div w-class="amountInput">{{it1.serviceCharge}}</div>
                <span w-class="unit">{{it.coinType}}</span>
        </div>

        <div w-class="balanceTip">
                本地余额 {{it1.localBalance}}{{it.coinType}}
        </div>
    </div>

    <div w-class="message">
            {{it1.isFeeEnough ? '' : '手续费不足'}}
    </div>
    <diV w-class="blueBtn">
            充值到云端
    </diV>
</div>