<div class="new-page" ev-next-click="share" ev-back-click="backPrePage" w-class="new-page">
    <img src="../../../res/image1/topbar_backimg.png" style="position: absolute;top: 0;right: 0;"/>
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},nextImg:"../../res/image/share_white.png",background:"transparent"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="title">
            <img src={{it1.userHead}} w-class="userHead"/>
            <span w-class="userName">{{it1.userName}}</span>
        </div>
        <div w-class="address" on-tap="copyAddr">{{it1.address}}
            <img src="../../../res/image/42.png" w-class="copy"/>
        </div>
        <div style="text-align: center;">
            <app-components-qrcode-qrcode>{value:{{it1.address}},size:"350"}</app-components-qrcode-qrcode>
            <div style="font-size: 32px;color: #222222;margin-top: 50px;">{{it1.cfgData.shortMess}}</div>
        </div>
    </div>
</div>