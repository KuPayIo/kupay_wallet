<div class="new-page" ev-next-click="share" ev-back-click="backPrePage" w-class="new-page">
    <img src="../../../res/image1/topbar_backimg.png" style="position: absolute;top: 0;right: 0;"/>
    {{: topBarTitle = {"zh_Hans":"我的二维码","zh_Hant":"我的二維碼","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},nextImg:"../../res/image/share_white.png",background:"transparent"}</app-components-topBar-topBar>
    <div w-class="content">
        <div w-class="title">
            <img src={{it.userHead}} w-class="userHead"/>
            <span w-class="userName">{{it.userName}}</span>
        </div>
        <div w-class="address" on-tap="copyAddr">好嗨号：{{it.acc_id}}
            <img src="../../../res/image/copy_gray.png" width="30px" w-class="copy"/>
        </div>
        <div style="text-align: center;">
            <app-components-qrcode-qrcode>{value:{{it.acc_id}},size:"350"}</app-components-qrcode-qrcode>
            <div style="font-size: 32px;color: #222222;margin-top: 50px;">
                <pi-ui-lang>{"zh_Hans":"扫码添加{{it.walletName}}好友","zh_Hant":"掃碼添加{{it.walletName}}好友","en":""}</pi-ui-lang>
            </div>
        </div>
    </div>
</div>