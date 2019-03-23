<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"找客服","zh_Hant":"找客服","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: title = {"zh_Hans":"联系客服","zh_Hant":"聯繫客服","en":""} }}
        <div w-class="title"><pi-ui-lang>{{title}}</pi-ui-lang></div>
        {{: desc1 = {"zh_Hans":"好嗨微信公众号 ","zh_Hant":"好嗨微信公众号","en":""} }}
        <div w-class="desc1"><pi-ui-lang>{{desc1}}</pi-ui-lang></div>
        {{: desc2 = {"zh_Hans":"High-APP","zh_Hant":"High-APP","en":""} }}
        <div w-class="desc2"><pi-ui-lang>{{desc2}}</pi-ui-lang></div>
        <img src="{{it.wachatQrcode}}" w-class="wachatQrcode"/>
        {{: qq = {"zh_Hans":"好嗨客服QQ：","zh_Hant":"好嗨客服QQ：","en":""} }}
        <div w-class="qq"><pi-ui-lang>{{qq}}</pi-ui-lang>{{it.qq}}</div>
    </div>
</div>