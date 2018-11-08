<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    <div w-class="top-head">
        {{: topBarTitle = {"zh_Hans":it.currencyName,"zh_Hant":it.currencyName,"en":""} }}
        <app-components1-topBar-topBar>{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6)",refreshImg:"../../res/image1/refresh_white.png"}</app-components1-topBar-topBar>
        <div w-class="head2">
            <div w-class="head2-left"><span w-class="balance">{{it1.balance}}</span><span w-class="balance-value">{{it1.currencyUnitSymbol}}{{it1.balanceValue}}</span></div>
            <div w-class="head2-right">
                <span w-class="btn" on-tap="rechargeClick"><pi-ui-lang>{"zh_Hans":"充值","zh_Hant":"充值","en":""}</pi-ui-lang></span>
                <span w-class="btn btn-withdraw" on-tap="withdrawClick"><pi-ui-lang>{"zh_Hans":"提币","zh_Hant":"提幣","en":""}</pi-ui-lang></span>
            </div>
        </div>
        <div w-class="nav-wrap">
            <div w-class="nav">
                {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
                <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="tabsChangeClick(e,{{i}})">
                    {{v.tab}}
                </div>
                {{end}}
            </div>
        </div>
    </div>
    <div w-class="show-container">
        <div w-class="quotes"><pi-ui-lang>{"zh_Hans":"行情","zh_Hant":"行情","en":""}</pi-ui-lang>&nbsp;￥{{it1.rate}}/{{it.currencyName}}</div>
        {{if it1.redUp}}
        <div w-class="{{it1.gain >= 0 ? 'up' : 'down'}}"><pi-ui-lang>{"zh_Hans":"今日","zh_Hant":"今日","en":""}</pi-ui-lang>&nbsp;{{it1.gain >= 0 ? '+' : ''}}{{it1.gain}}%</div>
        {{else}}
        <div w-class="{{it1.gain >= 0 ? 'down' : 'up'}}"><pi-ui-lang>{"zh_Hans":"今日","zh_Hant":"今日","en":""}</pi-ui-lang>&nbsp;{{it1.gain >= 0 ? '+' : ''}}{{it1.gain}}%</div>
        {{end}}
    </div>
    <div w-class="body">
        {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
        <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;height: 100%;">{isActive:{{isActive}},currencyName:{{it.currencyName}}}</widget>
        {{end}}
    </div>
</div>