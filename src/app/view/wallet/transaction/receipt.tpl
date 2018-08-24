<div w-class="base" class="ga-new-page">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}},iconColor:"white",titlePosition:"left",style:"backgroundColor:rgba(68, 140, 255, 1);color:#fff;"}</app-components-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="body-header">正在接收{{it.currencyName}}</div>
            <div w-class="qrcode">
                <app-components-qrcode-qrcode>{value:{{it.addr}},size:400}</app-components-qrcode-qrcode>
            </div>
            <div w-class="addr">{{it.addr}}</div>
            <div w-class="btns">
                <span w-class="btn btn-share" on-tap="shareToFriends">分享好友</span>
                <span w-class="btn btn-copy" on-tap="copyClick">复制</span>
            </div>
        </div>
    </div>
</div>