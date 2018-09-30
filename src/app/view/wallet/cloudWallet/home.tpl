<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":{{it.currencyName}},background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
        <div w-class="head2">
            <div w-class="head2-left"><span w-class="balance">{{it1.balance}}</span><span w-class="balance-value">￥{{it1.balanceValue}}</span></div>
            <div w-class="head2-right"><span w-class="btn" on-tap="rechargeClick">{{it1.cfgData.recharge}}</span><span w-class="btn btn-withdraw" on-tap="withdrawClick">{{it1.cfgData.withdraw}}</span></div>
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
        <div w-class="quotes">{{it1.cfgData.quotation}}&nbsp;￥{{it1.rate}}/{{it.currencyName}}</div>
        <div w-class="{{it1.gain > 0 ? 'up' : 'down'}}">{{it1.cfgData.today}}&nbsp;{{it1.gain > 0 ? '+' : ''}}{{it1.gain}}%</div>
    </div>
    <div w-class="body">
        {{for i,v of it1.tabs}} {{let isActive = i===it1.activeNum}}
        <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}};  width:100%;height: 100%;">{isActive:{{isActive}},currencyName:{{it.currencyName}}}</widget>
        {{end}}
    </div>
</div>