<div class="new-page" w-class="new-page">
    <div w-class="share-box" on-tap="shareClick"><img src="../../../res/image/share_blue.png" w-class="share"/></div>
    <div w-class="back-box" on-tap="backClick"><img src="../../../res/image/left_arrow_white.png" w-class="back"/></div>
    <div w-class="container">
        <div w-class="top">
            <div w-class="avatar" style="background-image: url({{it.avatar ? it.avatar : '../../../res/image/share_default_avatar.png'}});" ></div>
            <div w-class="nickname">{{it.nickName ? it.nickName : "我还没想好名字"}}</div>
            <div w-class="app-addr">我正在KuPay</div>
        </div>
        <div w-class="bottom">
            <div w-class="action">扫描二维码</div>
            <img src="../../../res/image/share_qrcode.png" w-class="qrcode"/>
            <div w-class="desc">更安全的一站式数字资产管理平台</div>
        </div>
    </div>
</div>