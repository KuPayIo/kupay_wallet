
<div class="new-page" ev-back-click="backPrePage" ev-next-click="shareImg">
    {{: topBarTitle = [{"zh_Hans":"微信客服","zh_Hant":"微信客服","en":""},{"zh_Hans":"微信公众号","zh_Hant":"微信公眾號","en":""}] }}
    <app-components1-topBar-topBar>{title:{{topBarTitle[it.fg]}},nextImg:"../../res/image/share_blue.png" }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="../../../res/image/wechatQrcode.jpg" w-class="logoimg"/>
        </div>
        {{: ids = [{"zh_Hans":"ID：kuplay","zh_Hant":"ID：kuplay","en":""},{"zh_Hans":"ID：kuplay","zh_Hant":"ID：kuplay","en":""}] }}
        {{: shortMess = [{"zh_Hans":"扫码添加小助手，进KuPlay官方微信群","zh_Hant":"掃碼添加小助手，進KuPlay官方微信群","en":""},{"zh_Hans":"扫码关注公众号，随时了解kuplay新动态","zh_Hant":"掃碼關注公眾號，隨時了解kuplay新動態","en":""}] }}
        <div w-class="ids"><pi-ui-lang>{{ids[it.fg]}}</pi-ui-lang></div>
        <div w-class="shortmess"><pi-ui-lang>{{shortMess[it.fg]}}</pi-ui-lang></div>
    </div>
</div>