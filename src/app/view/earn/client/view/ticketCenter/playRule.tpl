<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"玩法","zh_Hant":"玩法","en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>	

    <div w-class="content">
        <div w-class="body mat flex-col">
            {{% 奖券}}
            <div w-class="top flex-col">
                <widget w-class="title" w-tag="pi-ui-lang">{"zh_Hans":"奖券","zh_Hant":"獎券","en":""}</widget>
                <div w-class="ticket-list">
                    <div w-class="flex-col img-item">
                        <img src="../../res/image/silverTicket1.png" width="150px;" height="114px;" />
                        <widget w-class="img-title" w-tag="pi-ui-lang">{"zh_Hans":"银券","zh_Hant":"銀券","en":""}</widget>
                    </div>
                    <div w-class="flex-col img-item">
                        <img src="../../res/image/goldTicket1.png" width="150px;" height="114px;" />
                        <widget w-class="img-title" w-tag="pi-ui-lang">{"zh_Hans":"金券","zh_Hant":"金券","en":""}</widget>
                    </div>
                    <div w-class="flex-col img-item">
                        <img src="../../res/image/diamondTicket1.png" width="150px;" height="114px;" />
                        <widget w-class="img-title" w-tag="pi-ui-lang">{"zh_Hans":"彩券","zh_Hant":"彩券","en":""}</widget>
                    </div>
                </div>
            </div>

            {{% 奖券的获得}}
            <div w-class="center flex-col">
                <widget w-class="title" w-tag="pi-ui-lang">{"zh_Hans":"奖券的获得","zh_Hant":"獎券的獲得","en":""}</widget>
                <div w-class="list flex-col">
                    <div w-class="item">
                        <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"注册奖励：","zh_Hant":"註冊獎勵：","en":""}</widget>
                        <div>
                            <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"新用户注册即奖券","zh_Hant":"新用戶註冊即獎券","en":""}</widget>&nbsp;&nbsp;
                            <widget w-class="item-go" w-tag="pi-ui-lang">{"zh_Hans":"去注册","zh_Hant":"去註冊","en":""}</widget>
                        </div>
                    </div>

                    <div w-class="item">
                        <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"合成：","zh_Hant":"合成：","en":""}</widget>
                        <div>
                            <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"三张低级券有机会可以合成高级券。","zh_Hant":"三張低級券有機會可以合成高級券。","en":""}</widget>&nbsp;&nbsp;
                        </div>
                    </div>

                    <div w-class="item">
                        <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"提建议：","zh_Hant":"提建議：","en":""}</widget>
                        <div>
                            <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"5字以上的建议，即可获得奖券 有效建议和建议被采纳会触发奖励哦","zh_Hant":"5字以上的建議，即可獲得獎券有效建議和建議被採納會觸發獎勵哦","en":""}</widget>&nbsp;&nbsp;
                            <widget w-class="item-go" w-tag="pi-ui-lang">{"zh_Hans":"去提意见","zh_Hant":"去提意見","en":""}</widget>
                        </div>
                    </div>

                    <div w-class="item">
                        <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"观看广告：","zh_Hant":"觀看廣告：","en":""}</widget>
                        <div>
                            <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"看广告获得奖券，有可能会遇上金券哦。","zh_Hant":"看廣告獲得獎券，有可能會遇上金券哦。","en":""}</widget>&nbsp;&nbsp;
                            <widget w-class="item-go" w-tag="pi-ui-lang">{"zh_Hans":"看广告","zh_Hant":"看廣告","en":""}</widget>
                        </div>
                    </div>
                </div>
            </div>

            {{% 奖券的使用}}
            <div w-class="bottom flex-col">
                <widget w-class="title" w-tag="pi-ui-lang">{"zh_Hans":"奖券的使用","zh_Hant":"獎券的使用","en":""}</widget>
                <div w-class="list flex-col">
                        <div w-class="item">
                            <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"送好友：","zh_Hant":"送好友：","en":""}</widget>
                            <div>
                                <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"彩券可以用于赠送好友","zh_Hant":"彩券可以用於贈送好友","en":""}</widget>&nbsp;&nbsp;
                                <widget w-class="item-go" w-tag="pi-ui-lang">{"zh_Hans":"去送好友","zh_Hant":"去送好友","en":""}</widget>
                            </div>
                        </div>
    
                        <div w-class="item">
                            <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"兑换：","zh_Hant":"兌換：","en":""}</widget>
                            <div>
                                <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"不同物品需要的奖券类型和数量不同。","zh_Hant":"不同物品需要的獎券類型和數量不同。","en":""}</widget>&nbsp;&nbsp;
                                <widget w-class="item-go" w-tag="pi-ui-lang">{"zh_Hans":"去兑换","zh_Hant":"去兌換","en":""}</widget>
                            </div>
                        </div>
    
                        <div w-class="item">
                            <widget w-class="item-title" w-tag="pi-ui-lang">{"zh_Hans":"抽奖：","zh_Hant":"抽獎：","en":""}</widget>
                            <div>
                                <widget w-class="item-text" w-tag="pi-ui-lang">{"zh_Hans":"不同类型的奖券可以参与不同的大转盘。","zh_Hant":"不同類型的獎券可以參與不同的大轉盤。","en":""}</widget>&nbsp;&nbsp;
                                <widget w-class="item-go" w-tag="pi-ui-lang">{"zh_Hans":"去抽奖","zh_Hant":"去抽獎","en":""}</widget>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>  

</div>