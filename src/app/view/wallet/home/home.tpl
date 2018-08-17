<div class="ga-new-page hide-scrollbar" on-move="pageScroll">
    <div  id="page">
        <div id="gaHeader" w-class="ga-header-Outer">
        {{if it1.gwlt}}
        <div w-class="ga-header">
            <div w-class="ga-wallet-name-container">
                <img w-class="ga-wallet-header" src="../../../res/image/{{it1.wallet.avatar}}" on-tap="switchWalletClick"/>
                <span w-class="ga-wallet-name" on-tap="switchWalletClick">{{it1.gwlt.nickName}}</span>
            </div>
            <div w-class="ga-assets-container">
                <div w-class="ga-assets-box">
                    <span w-class="ga-assets">
                        <div w-class="ga-box"><span w-class="ga-assets-symbol">￥</span><span w-class="specialFont">{{it1.hiddenAssets ? it1.totalAssets.replace(/[0-9]/g,'-') : it1.totalAssets}}</span></div>
                        <img src="../../../res/image/{{it1.hiddenAssets ? 'btn_display_close_v2' : 'btn_display_open_v2'}}.png" w-class="ga-hidden" on-tap="hiddenAssetsClick"/>
                    </span>
                </div>
                <div w-class="ga-profit">今日盈利 ￥<span w-class="specialFont">{{it1.hiddenAssets ? '-.--' : '0.00'}}</span></div>
            </div>
            <div w-class="ga-add-container"><img w-class="ga-add-currency" src="../../../res/image/btn_add_money.png"  on-tap="clickAddCurrencyListener"/></div>
        </div>
        {{else}}
        <div w-class="ga-header" id="gaHeader">
            <div w-class="ga-wallet-name-container">
                <span w-class="ga-wallet-name" on-tap="createWalletClick">{{it1.otherWallets ? '选择钱包' : '创建钱包'}}</span>
            </div>
            <div w-class="ga-assets-container">
                <div w-class="ga-assets-box">
                    <span w-class="ga-assets">
                            <div w-class="ga-box"><span w-class="ga-assets-symbol">￥</span><span w-class="specialFont">{{it1.hiddenAssets ? it1.totalAssets.toFixed(2).replace(/./g,'*') : it1.totalAssets.toFixed(2)}}</span></div>
                        <img src="../../../res/image/{{it1.hiddenAssets ? 'btn_display_close_v2' : 'btn_display_open_v2'}}.png" w-class="ga-hidden" on-tap="hiddenAssetsClick"/>
                    </span>
                </div>
                <div w-class="ga-profit">今日盈利 ￥<span w-class="specialFont">{{it1.hiddenAssets ? '-.--' : '0.00'}}</span></div>
            </div>
        </div>
        {{end}}
        <div on-tap="backupWalletClick" w-class="ga-float-box"><span w-class="iconSpan"></span><span style="flex-grow: 1;">{{it1.floatBoxTip}}</span><img src="../../../res/image/right_arrow.png" w-class="ga-arrow-img"/></div>
    </div>
    
        <div w-class="ga-currency-list-container">
            <ul id="currencyList" w-class="ga-currency-list">
                {{for index,currency of it1.currencyList}}
                <li w-class="ga-currency-item" on-tap="clickCurrencyItemListener(e,{{index}})">
                    <div w-class="ga-currency-logo-container">
                        <img src="../../../res/image/currency/{{currency.currencyName}}.png" w-class="ga-currency-logo"/>
                    </div>
                    <div w-class="ga-item-right-container">
                        <div w-class="ga-item-top-container">
                            <div w-class="ga-curreny-name">{{currency.currencyName}}</div>
                            <div w-class="ga-curreny-balance">{{currency.balance}}</div>
                        </div>
                        <div w-class="ga-item-bottom-container">
                            <div w-class="ga-curreny-full-name">{{currency.currencyFullName}}</div>
                            <div w-class="ga-curreny-balance-value">≈{{currency.balanceValue}}&nbsp;CNY</div>
                        </div>
                    </div>
                </li>
                {{end}}
            </ul>
        </div>
    </div>
    <div id="hideHead" w-class="hideHeadOuter">
            <div w-class="hideHead">
                <span>
                        <span w-class="currencyIcon">￥</span>{{it1.totalAssets}}
                </span>
                {{if it1.gwlt}}
                <img src="../../../res/image/{{it1.wallet.avatar}}" w-class="hidetitleHeadImg"/>
                {{else}}
                <img src="../../../res/image/img_avatar1.png" w-class="hidetitleHeadImg"/>
                {{end}}

            </div>
    </div>
</div>
