<div class="new-page" w-class="ga-new-page">
    <div w-class="ga-share-top" on-tap="backPrePage"></div>
    <div w-class="ga-share-bottom">
        <div w-class="ga-share-title">{{it1.cfgData.title}}</div>
        <div w-class="ga-share-platforms">
            <div w-class="ga-share-platform" on-tap="shareToWechat">
                <img src="../../res/image/img_share_wechat.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>{{it1.cfgData.wechat}}</span>
            </div>
            <div w-class="ga-share-platform" on-tap="shareToFriends">
                <img src="../../res/image/img_share_wechatArea.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>{{it1.cfgData.friends}}</span>
            </div>
            <div w-class="ga-share-platform" on-tap="shareToQQSpace">
                <img src="../../res/image/img_share_qqArea.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>{{it1.cfgData.qqSpace}}</span>
            </div>
            {{if it1.isShowQQ}}
            <div w-class="ga-share-platform" on-tap="shareToQQ">
                <img src="../../res/image/img_share_qq.png" w-class="ga-share-icon{{it1.showCount}}" />
                <span>QQ</span>
            </div>
            {{end}}
        </div>
        <div w-class="ga-share-cancel" on-tap="backPrePage">{{it1.cfgData.cancel}}</div>
    </div>
</div>