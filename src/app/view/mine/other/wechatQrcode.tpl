{{: data = it1.cfgData}}
<div class="new-page" ev-back-click="backPrePage" ev-next-click="shareImg">
    <app-components1-topBar-topBar>{title:{{data.topBarTitle[it.fg]}},nextImg:"../../res/image/share_blue.png" }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="../../../res/image/wechatQrcode.jpg" w-class="logoimg"/>
        </div>
        <div w-class="ids">{{data.ids[it.fg]}}</div>
        <div w-class="shortmess">{{data.shortMess[it.fg]}} </div>
    </div>
</div>