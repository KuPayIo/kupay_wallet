<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-share-top" on-tap="backPrePage"></div>
    <div w-class="ga-share-bottom">
        <div w-class="ga-share-title">选择要分享的平台</div>
        <div w-class="ga-share-platforms">
            <div w-class="ga-share-platform" on-tap="shareToWechat">
                <img src="../../res/image/img_share_wechat.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>微信</span>
            </div>
            <div w-class="ga-share-platform" on-tap="shareToFriends">
                <img src="../../res/image/img_share_moments.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>朋友圈</span>
            </div>
            <div w-class="ga-share-platform" on-tap="shareToQQSpace">
                <img src="../../res/image/img_share_moments.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>QQ空间</span>
            </div>
            {{if it1.isShowQQ}}
            <div w-class="ga-share-platform" on-tap="shareToQQ">
                <img src="../../res/image/img_share_moments.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>QQ</span>
            </div>
            {{end}}
        </div>
        <div w-class="ga-share-cancel" on-tap="backPrePage">取消分享</div>
    </div>
</div>