<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"联系我们","zh_Hant":"聯繫我們","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="{{it.walletLogo}}" w-class="logoimg"/>
        </div>
        <div w-class="version">V{{it.version}}({{it.appVersion}})</div>
        <div w-class="shortmess">
            <pi-ui-lang>{"zh_Hans": "{{it.walletName}}是一个能赚钱能分红的游戏平台。","zh_Hant": "{{it.walletName}}是一個能賺錢能分紅的遊戲平台。","en":""}</pi-ui-lang>
        </div>
        
        {{: itemName = [
        {"zh_Hans":"官方网站","zh_Hant":"官方網站","en":""},
        {"zh_Hans":"联系客服","zh_Hant":"聯繫客服","en":""},
        {"zh_Hans":"微信公众号","zh_Hant":"微信公眾號","en":""}] }}
        {{for ind,val of it.data}}
            <div on-tap="itemClick(e,{{ind}})" on-down="onShow">
                <app-components-basicItem-basicItem>{"name":{{itemName[ind]}},"describe":{{val.desc}} }</app-components-basicItem-basicItem>
            </div>
        {{end}}
    </div>
</div>