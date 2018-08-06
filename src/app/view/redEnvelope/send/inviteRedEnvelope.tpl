<div class="ga-new-page" w-class="ga-new-page">
    <div ev-back-click="backClick" w-class="ga-body">
        <app-components-topBar-topBar>{title:"领取{{it1.allCurrency}}"}</app-components-topBar-topBar>
        <div w-class="ga-main">
            <img src="../../../res/image/open2.png" w-class="ga-open" />
            <div w-class="ga-leave-message">恭喜发财 大吉大利</div>
            <div w-class="ga-tag">您准备了一个红包</div>
            <div w-class="ga-amount">{{it1.allCurrency}}</div>
            <div w-class="ga-share-to" on-tap="shareToFriends">发给好友</div>
        </div>
        <div w-class="ga-box">
            <div w-class="ga-title">系统已经打包好了{{it1.allCurrency}}</div>
            <div w-class="ga-tip">邀请红包限量1个，是单个{{it1.eachCurrency}}的等额红包。</div>
            <div w-class="ga-tip">红包可以多次发放！</div>
            <div w-class="ga-tip">每成功邀请一人获得{{it1.eachInviteCurrency1}}和{{it1.eachInviteCurrency2}}。</div>
            <div w-class="ga-invited">已成功邀请：{{it1.inviteOkCount}}/{{it1.inviteAllCount}}</div>
            <div w-class="ga-get">已获得：{{it1.inviteCurrency1}} / {{it1.inviteCurrency2}}</div>
            <div w-class="ga-tip-little">成功邀请的标准是对方曾经达到{{it1.inviteLimitCurrency}}。</div>
            <div w-class="ga-tip-little">邀请红包截止日期到{{it1.lastTime}}，未领取的红包码将作废。</div>
        </div>
    </div>
</div>