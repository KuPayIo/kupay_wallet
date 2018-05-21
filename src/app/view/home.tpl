<div>
    {{if it1.wallet}}
    <div w-class="ga-header">
        <div w-class="ga-loading-container"><img src="../res/image/u250.png" /></div>
        <div w-class="ga-wallet-name-container">
            <span w-class="ga-wallet-name-dot" style="background-color:{{it1.walletNameDotBgColor}};"></span>
            <span w-class="ga-wallet-name" on-tap="switchWalletClick">{{it1.wallet.walletName}}</span>
        </div>
        <div w-class="ga-assets-container">
            <div w-class="ga-assets-box">
                <span w-class="ga-assets-title">总资产</span>
                <span w-class="ga-assets">≈${{it1.totalAssets}}</span>
            </div>
            <img w-class="ga-add-currency" src="../res/image/u124.png"  on-click="clickAddCurrencyListener"/>
        </div>
    </div>
    {{else}}
    <div w-class="ga-header">
        <div w-class="ga-loading-container"><img src="../../res/image/u250.png" /></div>
        <div w-class="ga-wallet-name-container">
            <span w-class="ga-wallet-name" on-click="createWalletClick">创建钱包</span>
        </div>
        <div w-class="ga-assets-container">
            <div w-class="ga-assets-box">
                <span w-class="ga-assets-title">总资产</span>
                <span w-class="ga-assets">≈${{it1.totalAssets}}</span>
            </div>
        </div>
    </div>
    {{end}}
    <div w-class="ga-currency-list-container">
        <ul w-class="ga-currency-list">
            {{for index,currency of it1.currencyList}}
            <li w-class="ga-currency-item" on-click="clickCurrencyItemListener(e,{{index}})">
                <img src="../res/image/u250.png" w-class="ga-currency-logo"/>
                <div w-class="ga-curreny-name-container">
                    <div w-class="ga-curreny-name">{{currency.currencyName}}</div>
                    <div w-class="ga-curreny-full-name">{{currency.currencyFullName}}</div>
                </div>
                <div w-class="ga-curreny-assets-container">
                    <div w-class="ga-curreny-balance">{{currency.balance}}</div>
                    <div w-class="ga-curreny-balance-value">{{currency.balanceValue}}</div>
                </div>
            </li>
            {{end}}
        </ul>
    </div>
    <app-components-bottomTabBar-bottomTabBar></app-components-bottomTabBar-bottomTabBar>
</div>
