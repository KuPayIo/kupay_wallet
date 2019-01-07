<div class="new-page" w-class="new-page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div style="position:relative;flex:1 0 0;">
        <div w-class="share-box" on-tap="shareClick"><img src="../../../res/image/share_blue.png" w-class="share"/></div>
        <div w-class="back-box" on-tap="backClick"><img src="../../../res/image/left_arrow_white.png" w-class="back"/></div>
        <div w-class="container">
            <div w-class="top">
                <div w-class="avatar" style="background-image: url({{it.avatar ? it.avatar : '../../../res/image/share_default_avatar.png'}});" ></div>
                {{: nickname = {"zh_Hans":it.nickName ? it.nickName : "我还没想好名字","zh_Hant":it.nickName ? it.nickName : "我還沒想好名字","en":""} }}
                <widget w-tag="pi-ui-lang" w-class="nickname">{{ nickname }}</widget>
                {{: addr = {"zh_Hans":"我正在KuPay","zh_Hant":"我正在KuPay","en":""} }}
                <widget w-tag="pi-ui-lang" w-class="app-addr">{{ addr }}</widget>
            </div>
            <div w-class="bottom">
                {{: action = {"zh_Hans":"扫描二维码","zh_Hant":"掃描二維碼","en":""} }}
                <widget w-tag="pi-ui-lang" w-class="action">{{ action }}</widget>
                <img src="../../../res/image/share_qrcode.png" w-class="qrcode"/>
                {{: desc = {"zh_Hans":"更安全的一站式数字资产管理平台","zh_Hant":"更安全的一站式數字資產管理平台","en":""} }}
                <widget w-tag="pi-ui-lang" w-class="action">{{ desc }}</widget>
            </div>
        </div>
    </div>  
</div>