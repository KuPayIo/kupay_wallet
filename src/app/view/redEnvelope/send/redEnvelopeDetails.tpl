<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"红包详情",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
    <div w-class="ga-head"><img src="../../../res/image/application_icon_active.png" w-class="ga-big-head"/></div>
    <div w-class="ga-leave-message">{{it.leaveMessage}}</div>
    <div w-class="ga-records-list-box">
        <div w-class="ga-records-list-title">已领取1/4，共10MPT</div>
        <div w-class="ga-records-item">
            <img src="../../../res/image/application_icon_active.png" w-class="ga-little-head"/>
            <div w-class="ga-records-right">
                <div w-class="ga-item-top">
                    <span w-class="ga-records-type">{{it.type}}</span>
                    <div w-class="ga-amount"><span>{{it.amount}}</span>&nbsp;<span>{{it.currencyName}}</span></div>
                </div>
                <div w-class="ga-item-bottom">
                    <span w-class="ga-records-time">{{it.time}}</span>
                    <div w-class="ga-best">手气最佳</div>
                </div>
            </div>
        </div>
    </div>
</div>