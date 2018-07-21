<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"红包详情",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
    <div w-class="ga-head"><img src="../../../res/image/application_icon_active.png" w-class="ga-big-head"/></div>
    <div w-class="ga-leave-message">{{it.redEnvelope.leaveMessage}}</div>
    <div w-class="ga-type">恭喜你收到</div>
    <div w-class="ga-amount"><span>{{it.redEnvelope.amount}}</span><span w-class="ga-currency-name">{{it.redEnvelope.currencyName}}</span></div>
    <div w-class="ga-bottom">
        <div w-class="ga-tips">收取的红包已存入云端账户</div>
    </div>
</div>