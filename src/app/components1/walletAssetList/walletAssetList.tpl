<div w-class="list-container">
    {{for i,v of it.assetList}}
    <div w-class="item" on-tap="itemClick(e,{{i}})">
        <img src="../../res/image/currency/{{v.currencyName}}.png" w-class="icon"/>
        <div w-class="right-container">
            <div w-class="top-container">
                <div w-class="currency-name">{{v.currencyName}}</div>
                <div w-class="balance">{{v.balance}}</div>
            </div>
            <div w-class="bottom-container">
                <div w-class="description">{{v.description}}</div>
                <div w-class="balance-container">
                    <div w-class="balance-value">￥{{v.balanceValue}}</div>
                    {{if it1.redUp}}
                    <div w-class="gain {{v.gain >= 0 ? 'gain-up' : 'gain-down'}}">{{v.gain >= 0 ? '+' : ''}}{{v.gain}}%</div>
                    {{else}}
                    <div w-class="gain {{v.gain >= 0 ? 'gain-down' : 'gain-up'}}">{{v.gain >= 0 ? '+' : ''}}{{v.gain}}%</div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>
    {{end}}
    <div w-class="space"></div>
</div>