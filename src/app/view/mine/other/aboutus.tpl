<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"关于"+it.walletName,"zh_Hant":"關於"+it.walletName,"en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="{{it.walletLogo}}" w-class="logoimg"/>
        </div>
        <div w-class="version">V{{it.version}}({{it.appVersion}})</div>
        {{: shortMess = {"zh_Hans":"好玩的、能赚钱的游戏都在"+it.walletName+"体验！","zh_Hant":"好玩的、能賺錢的遊戲都在"+it.walletName+"體驗！","en":""} }}
        <div w-class="shortmess">
            <pi-ui-lang>{{shortMess}}</pi-ui-lang>
        </div>

        {{: itemName = [
            {"zh_Hans":"协议及隐私","zh_Hant":"協議及隱私","en":""},
            {"zh_Hans":"版本更新","zh_Hant":"版本更新","en":""},
            {"zh_Hans":"分享下载链接","zh_Hant":"分享下載鏈接","en":""}] }}
        
        {{for ind,val of it.data}}
            <div on-tap="itemClick(e,{{ind}})" on-down="onShow">
                <app-components-basicItem-basicItem>{"name":{{itemName[ind]}},"describe":{{val.desc}} }</app-components-basicItem-basicItem>
            </div>
        {{end}}
    </div>
</div>