<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"奖券中心","zh_Hant":"獎券中心","en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>	

    <div w-class="content">
        {{% 顶部标题}}
        <div w-class="top-title">
            <widget w-class="top-btn" w-tag="pi-ui-lang">{"zh_Hans":"合成奖券","zh_Hant":"合成獎券","en":""}</widget>
            <widget w-class="getTicket-title-name" w-tag="pi-ui-lang">{"zh_Hans":"我的奖券","zh_Hant":"我的獎券","en":""}</widget>
            <widget w-class="top-btn" on-tap="goRule" w-tag="pi-ui-lang">{"zh_Hans":"玩法","zh_Hant":"玩法","en":""}</widget>
        </div>
        <div w-class="body">

            {{% 拥有券数}}
            <div w-class="hasTicket mat">

            </div>

            {{% 活动}}
            <div w-class="activity">
                <div w-class="activity-box mat">
                    <img src="../../res/image1/btn_yun_7.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"开宝箱","zh_Hant":"開寶箱","en":""}</widget>
                </div>
                    
                <div w-class="activity-box mat">
                    <img src="../../res/image1/btn_yun_8.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""}</widget>
                </div>
                <div w-class="activity-box mat">
                    <img src="../../res/image1/btn_yun_5.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"发给好友","zh_Hant":"發給好友","en":""}</widget> 
                </div>
                <div w-class="activity-box mat">
                    <img src="../../res/image1/btn_yun_10.png" width="100px" />
                    <widget w-class="activity-text" w-tag="pi-ui-lang">{"zh_Hans":"兑换物品","zh_Hant":"兌換物品","en":""}</widget> 
                </div>
            </div>

            {{% 领券标题}}
            <div w-class="getTicket-title">
                <widget w-class="getTicket-title-name" w-tag="pi-ui-lang">{"zh_Hans":"领奖券","zh_Hant":"領獎券","en":""}</widget>
                <widget w-class="getTicket-title-dsc" w-tag="pi-ui-lang">{"zh_Hans":"根据持有KT，可以领取不同数量类型的奖券","zh_Hant":"根據持有KT，可以領取不同數量類型的獎券","en":""}</widget>
            </div>

            {{% 拥有KT}}
            <div w-class="hasKT mat">
                <div style="text-align: center;font-size: 72px;font-weight: 500;line-height: 110px;">500</div>
                <widget style="font-size:24px;color:#222222;" w-tag="pi-ui-lang">{"zh_Hans":"剩余可领(KT)","zh_Hant":"剩餘可領(KT)","en":""}</widget>
            </div>

            {{% 领券}}
            <div w-class="getTicket">
                <div w-class="getTicket-item">
                    <div w-class="ticket-show mat">
                        <div w-class="ticket-KT">500KT</div>
                        <img src="../../res/image/silverTicket.png" width="100%" />
                    </div>
                    <div w-class="getTicket-btn">领取</div>
                </div>
                <div w-class="getTicket-item" style="margin:0 10px;">
                    <div w-class="ticket-show mat">
                        <div w-class="ticket-KT">1000KT</div>
                        <img src="../../res/image/goldTicket.png" width="100%" />
                    </div>
                    <div w-class="getTicket-btn">领取</div>
                </div>
                <div w-class="getTicket-item">
                    <div w-class="ticket-show mat">
                        <div w-class="ticket-KT">2000KT</div>
                        <img src="../../res/image/diamondTicket.png" width="100%" />
                    </div>
                    <div w-class="getTicket-btn">领取</div>
                </div>
            </div>

            {{% 结束}}
            <div w-class="end">
                <pi-ui-lang>{"zh_Hans":"领奖券不会真的消耗KT","zh_Hant":"領獎券不會真的消耗KT","en":""}</pi-ui-lang>
            </div>
        </div>
    </div>

</div>