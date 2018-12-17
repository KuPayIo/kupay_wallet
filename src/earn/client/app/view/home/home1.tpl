<div class="new-page" style="display: flex;flex-direction: column;" ev-refresh-click="refreshPage">
    
    <div w-class="contain" on-scroll="scrollPage" id="earn-home">
        <div w-class="topBack">
            <div w-class="stone-card" on-tap="diggingStoneClick">
                <div w-class="holded-hoes">
                    <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:120,img:"../../../res/image/gold_hoe.png" }</earn-client-app-view-activity-components-holdedHoe>
                    <earn-client-app-view-activity-components-holdedHoe style="margin:0 15px;">{ holdedNumber:6,img:"../../../res/image/gold_hoe.png" }</earn-client-app-view-activity-components-holdedHoe>
                    <earn-client-app-view-activity-components-holdedHoe>{ holdedNumber:20,img:"../../../res/image/gold_hoe.png" }</earn-client-app-view-activity-components-holdedHoe>
                    <div w-class="gift-box">
                        <img src="../../res/image1/gift.png"/>
                    </div>
                </div>
                <div w-class="explanation-box">
                    <div w-class="explanation" on-tap="miningInstructionsClick"><span>采矿说明</span><img src="../../res/image1/explanation.png" w-class="explanation-icon"/></div>
                    <div w-class="action">看广告得锄头</div>
                </div>
                <div w-class="stone"></div>
                <div w-class="holded-stone">我的矿星</div>
                <div w-class="medals">
                    <div w-class="medal-tip">我的勋章</div>
                    {{for i of [0,0,0,0,0,0,0,0]}}
                    <img src="../../res/image1/btn_yun_1.png" w-class="medal"/>
                    {{end}}
                </div>
            </div>
            <div w-class="menuCard">
                <div w-class="oneBtn" on-tap="goNextPage(1)">
                    <img src="../../res/image1/btn_yun_1.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"领分红","zh_Hant":"領分紅","en":""}</pi-ui-lang></div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(2)">
                    <img src="../../res/image1/btn_yun_2.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"发红包","zh_Hant":"發紅包","en":""}</pi-ui-lang></div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(3)">
                    <img src="../../res/image1/btn_yun_3.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"兑换码","zh_Hant":"兌換碼","en":""}</pi-ui-lang></div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(4)">
                    <img src="../../res/image1/btn_yun_4.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"做任务","zh_Hant":"做任務","en":""}</pi-ui-lang></div>
                </div>
            </div>

            <div style="display: flex;align-items: center;">
                <span w-class="welfare"><pi-ui-lang>{"zh_Hans":"福利活动","zh_Hant":"福利活動","en":""}</pi-ui-lang></span>
            </div>

            <div w-class="welfare-container">
                {{for item of it.welfareActivities}}
                <div w-class="welfare-activities-item" class="welfare-activities-item">
                    <img src="../../res/image1/{{item.img}}"/>
                    <div w-class="welfare-box">
                        <div w-class="welfare-title">{{item.title}}</div>
                        <div w-class="welfare-desc">{{item.desc}}</div>
                    </div>
                </div>
                {{end}}
            </div>
        </div>  
    </div>
    
    <app-components1-topBar-topBar1>{avatar:{{it.avatar}},scrollHeight:{{it.scrollHeight}} }</app-components1-topBar-topBar1>
    <div w-class="bottomMode"></div>
</div>