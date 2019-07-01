<div w-class="list-container">
    {{for i,v of it.assetList}}
    <div w-class="item" on-tap="itemClick(e,{{i}})" on-down="onShow">
        <img src="{{v.logo}}" w-class="icon"/>
        <div w-class="right-container">
            <div w-class="top-container">
                <div w-class="currency-name">{{v.currencyName === 'KT' ? it.ktShow : (v.currencyName === 'SC' ? it.scShow : v.currencyName)}}</div>
                <div w-class="balance">{{v.balance%1===0?v.balance.toFixed(2):v.balance}}</div>
            </div>
            <div w-class="bottom-container">
                <div w-class="description">&nbsp;≈{{it.currencyUnitSymbol}}{{v.rate}}/{{v.currencyName === 'KT' ? it.ktShow : (v.currencyName === 'SC' ? it.scShow : v.currencyName)}}</div>
                <div w-class="balance-container">
                    <div w-class="balance-value">{{it.currencyUnitSymbol}}{{v.balanceValue}}</div>
                    {{if it.redUp}}
                    <div w-class="gain {{v.gain >= 0 ? 'gain-up' : 'gain-down'}}">{{v.gain >= 0 ? '+' : ''}}{{v.gain}}%</div>
                    {{else}}
                    <div w-class="gain {{v.gain >= 0 ? 'gain-down' : 'gain-up'}}">{{v.gain >= 0 ? '+' : ''}}{{v.gain}}%</div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>
    {{end}}
</div>