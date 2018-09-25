<div class="new-page" ev-next-click="share" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},nextImg:"../../res/image/09.png"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="title">
            <img src={{it1.userHead}} w-class="userHead"/>
            <span w-class="userName">{{it1.userName}}</span>
        </div>
        <div w-class="address">{{it1.address}}
            <img src="../../../res/image/42.png" style="width: 30px;height:30px;margin-left: 15px;vertical-align: middle;" on-tap="copyAddr"/>
        </div>
        <div style="text-align: center;">
            <app-components-qrcode-qrcode>{value:{{it1.address}},size:"350"}</app-components-qrcode-qrcode>
            <div style="font-size: 32px;color: #222222;margin-top: 50px;">{{it1.cfgData.shortMess}}</div>
        </div>
    </div>
</div>