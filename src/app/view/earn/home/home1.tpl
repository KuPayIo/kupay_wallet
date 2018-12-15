<div class="new-page" style="display: flex;flex-direction: column;" ev-refresh-click="refreshPage">
    
    <div w-class="contain" on-scroll="scrollPage" id="earn-home">
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <div w-class="topBack">
            <div w-class="stone-card">
                

            </div>
            <div w-class="menuCard">
                <div w-class="oneBtn" on-tap="goNextPage(1)">
                    <img src="../../../res/image1/btn_yun_1.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"领分红","zh_Hant":"領分紅","en":""}</pi-ui-lang></div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(2)">
                    <img src="../../../res/image1/btn_yun_2.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"发红包","zh_Hant":"發紅包","en":""}</pi-ui-lang></div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(3)">
                    <img src="../../../res/image1/btn_yun_3.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"兑换","zh_Hant":"兌換","en":""}</pi-ui-lang></div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(4)">
                    <img src="../../../res/image1/btn_yun_4.png" w-class="btnImg"/>
                    <div w-class="btnMess"><pi-ui-lang>{"zh_Hans":"做任务","zh_Hant":"做任務","en":""}</pi-ui-lang></div>
                </div>
            </div>

            <div style="display: flex;align-items: center;">
                <span w-class="welfare"><pi-ui-lang>{"zh_Hans":"福利活动","zh_Hant":"福利活動","en":""}</pi-ui-lang></span>
            </div>

            <div style="margin: 15px 20px;">
                <widget w-tag="pi-ui-langImg" style="height: 250px;width: 100%;" on-tap="doActivity(0)">{"zh_Hans":"app/res/image1/activity1_CN.jpg","zh_Hant":"app/res/image1/activity1_TW.jpg","en":""}</widget>
                <widget w-tag="pi-ui-langImg" style="height: 250px;width: 100%;margin-top: 30px;"  on-tap="doActivity(1)">{"zh_Hans":"app/res/image1/activity2_CN.jpg","zh_Hant":"app/res/image1/activity2_TW.jpg","en":""}</widget>
            </div>
        </div>  
    </div>
    
    <app-components1-topBar-topBar1>{avatar:{{it.avatar}},scrollHeight:{{it.scrollHeight}} }</app-components1-topBar-topBar1>
    <div w-class="bottomMode"></div>
</div>