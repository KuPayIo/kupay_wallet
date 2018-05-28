<div class="ga-new-page"  w-plugin='{"mod":"pi/widget/scroller/scroller", "options":{} }'>
    <div>
            {{if it1.gwlt}}
            <div w-class="ga-header">
                <div w-class="ga-loading-container"><img src="../../res/image/u250.png" /></div>
                <div w-class="ga-wallet-name-container">
                    <img w-class="ga-wallet-header" src="../../res/image/{{it1.wallet.avatar}}"/>
                    <span w-class="ga-wallet-name" on-tap="switchWalletClick">{{it1.gwlt.nickName}}</span>
                </div>
                <div w-class="ga-assets-container">
                    <div w-class="ga-assets-box">
                        <span w-class="ga-assets-title">总资产(CNY)</span>
                        <span w-class="ga-assets"><span w-class="ga-assets-symbol">≈</span>{{it1.totalAssets}}</span>
                    </div>
                    <img w-class="ga-add-currency" src="../../res/image/btn_add_money.png"  on-tap="clickAddCurrencyListener"/>
                </div>
            </div>
            {{else}}
            <div w-class="ga-header">
                <div w-class="ga-loading-container"><img src="../../res/image/u250.png" /></div>
                <div w-class="ga-wallet-name-container">
                    <img w-class="ga-wallet-header-none"/>
                    <span w-class="ga-wallet-name" on-tap="createWalletClick">创建钱包</span>
                </div>
                <div w-class="ga-assets-container">
                    <div w-class="ga-assets-box">
                        <span w-class="ga-assets-title">总资产(CNY)</span>
                        <span w-class="ga-assets"><span w-class="ga-assets-symbol">≈</span>{{it1.totalAssets}}</span>
                    </div>
                </div>
            </div>
            {{end}}
            <div w-class="ga-currency-list-container">
                <ul w-class="ga-currency-list">
                    {{for index,currency of it1.currencyList}}
                    <li w-class="ga-currency-item" on-tap="clickCurrencyItemListener(e,{{index}})">
                        <div w-class="ga-currency-logo-container">
                            <img src="../../res/image/{{currency.currencyName}}.png" w-class="ga-currency-logo"/>
                        </div>
                        <div w-class="ga-item-right-container">
                            <div w-class="ga-item-top-container">
                                <div w-class="ga-curreny-name">{{currency.currencyName}}</div>
                                <div w-class="ga-curreny-balance">{{currency.balance}}</div>
                            </div>
                            <div w-class="ga-item-bottom-container">
                                <div w-class="ga-curreny-full-name">{{currency.currencyFullName}}</div>
                                <div w-class="ga-curreny-balance-value">{{currency.balanceValue}}</div>
                            </div>
                        </div>
                    </li>
                    {{end}}
                </ul>
            </div>
            <div style="position: relative;height: 110px;"></div>
    </div>
</div>
