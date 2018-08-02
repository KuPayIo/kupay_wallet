<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"红包详情",iconColor:"white",style:"color:#fff;backgroundColor:#DF5E5E;"}</app-components-topBar-topBar>
    <div w-class="ga-main">
        <div w-class="ga-scroll-container">
            <div w-class="ga-top">
                <div w-class="ga-head"><img src="../../../res/image/application_icon_active.png" w-class="ga-big-head"/></div>
                <div w-class="ga-leave-message">恭喜发财 大吉大利</div>
                <div w-class="ga-amount"><span>100</span><span w-class="ga-currency-name">ETH</span></div>
                <div w-class="ga-input-father">
                    <div w-class="input-father"><app-components-input-input>{}</app-components-input-input></div>
                    <div w-class="ga-copy-btn">复制红包码</div>
                </div>
                <div w-class="ga-receive">立即领取红包金额</div>
            </div>
            <div w-class="ga-bottom">
                <div w-class="ga-receive-details">
                    <div w-class="ga-title">已领取1/4，共10MPT</div>
                    <div w-class="ga-list">
                        <div w-class="ga-item">
                            <img src="../../../res/image/BTC.png" w-class="ga-avator"/>
                            <div w-class="ga-item-right">
                                <div w-class="ga-box1">
                                    <div w-class="ga-name">好友钱包名</div>
                                    <div>15 MPT</div>
                                </div>
                                <div w-class="ga-box2">
                                    <div w-class="ga-time">04-12  14:32:00</div>
                                    <div w-class="ga-best">手气最佳</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div w-class="ga-rule">
                <div w-class="ga-rule-title">红包领取规则</div>
                <div w-class="ga-rule-list">
                    {{for index,item of it1.rules}}
                    <div w-class="ga-rule-item">{{item}}</div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>
</div>