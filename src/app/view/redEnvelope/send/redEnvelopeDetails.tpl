<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"红包详情",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
    <div w-class="ga-top">
        <div w-class="ga-head"><div w-class="ga-head-inner"></div></div>
        <div w-class="ga-leave-message">{{it1.lm}}</div>
    </div>
    <div w-class="ga-records-list-box">
        <div w-class="ga-title">已领取{{it1.convertedNumber}}/{{it1.totalNumber}}，共{{it1.totalAmount}}{{it1.currencyName}}</div>
        <div w-class="ga-list">
            {{for index,item of it1.redBagList}}
            <div w-class="ga-item">
                <img src="../../../res/image/img_avatar1.png" w-class="ga-avator"/>
                <div w-class="ga-item-right">
                    <div w-class="ga-box1">
                        <div w-class="ga-name">好友钱包名</div>
                        <div>{{item.amount}}&nbsp;{{it1.currencyName}}</div>
                    </div>
                    <div w-class="ga-box2">
                        <div w-class="ga-time">{{item.timeShow}}</div>
                        <div w-class="ga-best"></div>
                    </div>
                </div>
            </div>
            {{end}}
        </div>
    </div>
</div>