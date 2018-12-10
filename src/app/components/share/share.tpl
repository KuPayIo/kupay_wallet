<div class="new-page" w-class="ga-new-page">
    <div w-class="ga-share-top" on-tap="backPrePage"></div>
    <div w-class="ga-share-bottom">
        <div w-class="ga-share-title">
            <pi-ui-lang>{"zh_Hans":"选择要分享的平台","zh_Hant":"選擇要分享的平台","en":""}</pi-ui-lang>
        </div>
        <div w-class="ga-share-platforms">
            <div w-class="ga-share-platform" on-tap="shareToWechat">
                <img src="../../res/image/img_share_wechat.png" w-class="ga-share-icon{{it.showCount}}" />
                <pi-ui-lang>{"zh_Hans":"微信","zh_Hant":"微信","en":""}</pi-ui-lang>
            </div>
            <div w-class="ga-share-platform" on-tap="shareToFriends">
                <img src="../../res/image/img_share_wechatArea.png" w-class="ga-share-icon{{it.showCount}}" />
                <pi-ui-lang>{"zh_Hans":"朋友圈","zh_Hant":"朋友圈","en":""}</pi-ui-lang>
            </div>
            <div w-class="ga-share-platform" on-tap="shareToQQSpace">
                <img src="../../res/image/img_share_qqArea.png" w-class="ga-share-icon{{it.showCount}}" />
                <pi-ui-lang>{"zh_Hans":"QQ空间","zh_Hant":"QQ空間","en":""}</pi-ui-lang>
            </div>
            {{if it.isShowQQ}}
            <div w-class="ga-share-platform" on-tap="shareToQQ">
                <img src="../../res/image/img_share_qq.png" w-class="ga-share-icon{{it.showCount}}" />
                <span>QQ</span>
            </div>
            {{end}}
        </div>
        <div w-class="ga-share-cancel" on-tap="backPrePage"><pi-ui-lang>{"zh_Hans":"取消分享","zh_Hant":"取消分享","en":""}</pi-ui-lang></div>
    </div>
</div>