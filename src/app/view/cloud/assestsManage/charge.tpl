<div class="ga-new-page" w-class="ga-new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{title:"{{it.currencyName}}充值"}</app-components-topBar-topBar>
    <div w-class="iconsBox">
        <div w-class="local">
            <img src="../../../res/image/cloud_icon_local.png" w-class="icon" />
            <div w-class="text">
                本地钱包
            </div>
        </div>
        <div w-class="arow">
                <img src="../../../res/image/right_arrow2.png" />
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
                <div ev-input-change="chargeChange" w-class="input-father">
                    <app-components-input-input_simple>{style:"fontSize:32px;textAlign:right;",input:{{it1.amount}},placeHolder:"0",reg:"[^0-9.]"}</app-components-input-input_simple>
                </div>
                <span w-class="unit">{{it.currencyName}}</span>
        </div>

        <div w-class="charge">
                <span w-class="chargeAmount">手续费</span>
                <div w-class="amountInput">{{it1.serviceCharge}}</div>
                <span w-class="unit">{{it.currencyName}}</span>
        </div>

        <div w-class="balanceTip">
                本地余额&nbsp;{{it1.localBalance}}{{it.currencyName}}
        </div>
    </div>

    <div w-class="message">
            {{it1.isFeeEnough ? '' : '手续费不足'}}
    </div>
    <diV w-class="blueBtn" on-tap="rechargeClick">
            充值到云端
    </diV>
</div>