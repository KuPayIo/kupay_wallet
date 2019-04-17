<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head" ev-next-click="doScanClick">
        {{: topBarTitle = {"zh_Hans":it.currencyName +"收款","zh_Hant":it.currencyName +"收款","en":""} }}
        <app-components-topBar-topBar>{"title":{{topBarTitle}},background:"transparent"}</app-components-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="title">
                <widget w-tag="app-components1-img-img" w-class="avatar" >{imgURL:{{it.avatar}},width:"40px;"}</widget>
                <div><pi-ui-lang>{"zh_Hans":"向他人收款","zh_Hant":"向他人收款","en":""}</pi-ui-lang></div>
            </div>
            <div w-class="content">
                <div w-class="qrcode-container"><app-components-qrcode-qrcode>{value:{{it.fromAddr}},size:400}</app-components-qrcode-qrcode></div>
                <div w-class="addr-container" on-tap="copyClick">{{it.fromAddr}}<img src="app/res/image/copy_gray.png" w-class="copy_img" /></div>
                <div w-class="btn-container" ev-btn-tap="shareClick">
                    {{: btnName = {"zh_Hans":"分享好友","zh_Hant":"分享好友","en":""} }}
                    <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"white"}</app-components1-btn-btn>
                </div>
            </div>
        </div>
    </div>
</div>