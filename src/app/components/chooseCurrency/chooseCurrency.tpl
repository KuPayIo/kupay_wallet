<div w-class="ga-new-page" class="ga-new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{title:"选择货币"}</app-components-topBar-topBar>
    <div w-class="ga-currency-container">
        <div w-class="ga-currency-list">
            {{for index,item of it1.currencyShowList}}
            <div w-class="ga-currency-item" on-tap="currencyItemClick(e,{{index}})">
                <img src="../../res/image/{{item.currencyName}}.png" w-class="ga-currency-icon"/>
                <div w-class="ga-currency">{{item.currencyName}}</div>
                <div w-class="ga-balance">{{item.balance}}</div>
            </div>
            {{end}}
        </div>
    </div>
</div>