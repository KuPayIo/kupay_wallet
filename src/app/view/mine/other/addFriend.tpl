<div class="new-page" ev-next-click="share" ev-back-click="backPrePage" w-class="new-page">
    {{: topBarTitle = {"zh_Hans":"我的二维码","zh_Hant":"我的二維碼","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}},nextImg:"../../res/image/share_white.png",background:"transparent"}</app-components-topBar-topBar>
    <div w-class="content">
        <div w-class="title">
            <div w-class="userId">ID：123456</div>
            <img src={{it.userHead}} w-class="userHead"/>
            <span w-class="userName">{{it.userName}}</span>
        </div>
        <div w-class="address" on-tap="copyAddr">{{it.address}}
            <img src="../../../res/image/copy_gray.png" width="30px" w-class="copy"/>
        </div>
        <div style="text-align: center;">
            <app-components-qrcode-qrcode>{value:{{it.address}},size:"350"}</app-components-qrcode-qrcode>
            <div style="font-size: 32px;color: #222222;margin-top: 50px;">
                <pi-ui-lang>{"zh_Hans":"扫码加好友、扫码转账","zh_Hant":"掃碼加好友、掃碼轉賬","en":""}</pi-ui-lang>
            </div>
        </div>
    </div>
</div>