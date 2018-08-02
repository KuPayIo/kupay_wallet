<div class="ga-new-page" w-class="ga-new-page">
    <div ev-back-click="backClick" w-class="ga-body">
        <app-components-topBar-topBar>{title:"领取0.5个ETH"}</app-components-topBar-topBar>
        <div w-class="ga-main">
            <img src="../../../res/image/open2.png" w-class="ga-open"/>
            <div w-class="ga-leave-message">{{it.leaveMessage}}</div>
            <div w-class="ga-tag">您准备了一个红包</div>
            <div w-class="ga-amount">0.5 ETH</div>
            <div w-class="ga-share-to" on-tap="shareToFriends">发给好友</div>
        </div>
        <div w-class="ga-box">
            <div w-class="ga-title">系统已经打包好了0.5ETH</div>
            <div w-class="ga-tip">邀请红包限量1个，是单个0.015ETH的等额红包。</div>
            <div w-class="ga-tip">红包可以多次发放！</div>       
            <div w-class="ga-tip">每成功邀请一人获得500KT和0.01ETH。</div>
            <div w-class="ga-invited">已成功邀请：5/20</div>
            <div w-class="ga-get">已获得：2500 KT / 0.05 ETH</div>
            <div w-class="ga-tip-little">成功邀请的标准是对方曾经达到1000KT。</div>
            <div w-class="ga-tip-little">邀请红包截止日期到9月10日，未领取的红包码将作废。</div>
        </div>
    </div>
</div>