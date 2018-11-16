<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"联系我们","zh_Hant":"聯繫我們","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="{{it1.walletLogo}}" w-class="logoimg"/>
        </div>
        <div w-class="version">V{{it1.version}}</div>
        <div w-class="shortmess">
            <pi-ui-lang>{"zh_Hans": "{{it1.walletName}}是一款功能全面、简单易用的钱包应用。","zh_Hant": "{{it1.walletName}}是一款功能全面、簡單易用的錢包應用。","en":""}</pi-ui-lang>
        </div>
        
        {{: itemName = [
        {"zh_Hans":"官方网站","zh_Hant":"官方網站","en":""},
        {"zh_Hans":"微信小助手","zh_Hant":"微信小助手","en":""},
        {"zh_Hans":"微信公众号","zh_Hant":"微信公眾號","en":""}] }}
        {{for ind,val of it1.data}}
            <div on-tap="itemClick(e,{{ind}})">
                <app-components-basicItem-basicItem>{"name":{{itemName[ind]}},"describe":{{val.desc}} }</app-components-basicItem-basicItem>
            </div>
        {{end}}
    </div>
</div>