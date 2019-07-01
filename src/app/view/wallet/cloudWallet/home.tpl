<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    <div w-class="top-head">
        {{: topBarTitle = {"zh_Hans":it.topBarTitle,"zh_Hant":it.topBarTitle,"en":""} }}
        <app-components-topBar-topBar>{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6)",refreshImg:"../../res/image1/refresh_white.png"}</app-components-topBar-topBar>
        <div w-class="head2">
            <div w-class="head2-left">
                <span w-class="balance">{{it.balance%1===0?it.balance.toFixed(2):it.balance}}</span>
                <span w-class="balance-value">{{it.currencyUnitSymbol}}{{it.balanceValue}}</span>
            </div>
            <div w-class="head2-right">
                <span w-class="btn" on-tap="rechargeClick"><pi-ui-lang>{"zh_Hans":"充值","zh_Hant":"充值","en":""}</pi-ui-lang></span>
                <span w-class="btn btn-withdraw" on-tap="withdrawClick"><pi-ui-lang>{"zh_Hans":"提币","zh_Hant":"提幣","en":""}</pi-ui-lang></span>
            </div>
        </div>
        <div w-class="nav-wrap">
            <div w-class="nav">
                {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
                <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick(e,{{i}})">
                    {{v.tab}}
                </div>
                {{end}}
            </div>
        </div>
    </div>
    <div w-class="show-container">
        <div w-class="quotes"><pi-ui-lang>{"zh_Hans":"行情","zh_Hant":"行情","en":""}</pi-ui-lang>&nbsp;{{it.currencyUnitSymbol}}{{it.rate}}/{{it.topBarTitle}}</div>
        {{if it.redUp}}
        <div w-class="{{it.gain >= 0 ? 'up' : 'down'}}"><pi-ui-lang>{"zh_Hans":"今日","zh_Hant":"今日","en":""}</pi-ui-lang>&nbsp;{{it.gain >= 0 ? '+' : ''}}{{it.gain}}%</div>
        {{else}}
        <div w-class="{{it.gain >= 0 ? 'down' : 'up'}}"><pi-ui-lang>{"zh_Hans":"今日","zh_Hant":"今日","en":""}</pi-ui-lang>&nbsp;{{it.gain >= 0 ? '+' : ''}}{{it.gain}}%</div>
        {{end}}
    </div>
    <div w-class="body">
        {{for i,v of it.tabs}} {{let isActive = i===it.activeNum}}
        <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;height: 100%;">{isActive:{{isActive}},currencyName:{{it.currencyName}}}</widget>
        {{end}}
    </div>
</div>