<div w-class="purchase" id="purchase" class="ga-new-page" ev-back-click="goBackPage">
    <app-components-topBar-topBar>{title:"认购额度"}</app-components-topBar-topBar>
    <div w-class="productType">
        理财产品MPT理财产品第001期-1天（剩余额度0MPT）
    </div>
    <div w-class="purchaseBox">
        <div w-class="whiteArea">
            <input type="number" on-input="onValueChange" placeholder="请输入认购数量" w-class="numInput"/>
        </div>
        <div w-class="whiteArea">
            <div w-class="showBalance">
                托管账户可用余额：{{it1.managedAccountBalance.toFixed(4)}}<span w-class="recharge">充值</span>
            </div>
        </div>
    </div>
    <div w-class="blueBtn">
        立即认购
    </div>
</div>