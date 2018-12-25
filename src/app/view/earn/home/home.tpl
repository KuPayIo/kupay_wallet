<div class="new-page" style="display: flex;flex-direction: column;" ev-refresh-click="refreshPage">
    
    <div w-class="contain" on-scroll="scrollPage" id="earn-home">

        <div style="background:linear-gradient(to right,#318DE6,#38CFE7);"><app-components1-topBar-topBar1>{avatar:{{it.avatar}},scrollHeight:{{it.scrollHeight}} }</app-components1-topBar-topBar1></div>
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <div w-class="topBack">
            <div w-class="groupCard">
                <div w-class="titleMode">
                    <img src="../../../res/image1/mine_makmoney.png" w-class="makeMoney"/>
                    <span w-class="totalTitle"><pi-ui-lang>{"zh_Hans":"累计挖矿(KT)","zh_Hant":"累計挖礦(KT)","en":""}</pi-ui-lang></span>
                    <img src="../../../res/image/41_gray.png" w-class="miningDesc" on-tap="miningDesc"/>
                </div>

                <div w-class="totalNum" id="mining">
                    {{it.holdMines}}
                    <span class="miningNum" style="animation:{{it.doMining?'miningEnlarge 0.3s linear':''}}">
                        +{{it.mines}}
                    </span>  
                </div>

                <div w-class="titleMode">
                    <div w-class="totalTitle">
                        <div><pi-ui-lang>{"zh_Hans":"矿山剩余(KT)","zh_Hant":"礦山剩餘(KT)","en":""}</pi-ui-lang></div>
                        <div w-class="otherNum">{{it.mineLast}}</div>
                    </div>
                    <div w-class="totalTitle">
                        <div><pi-ui-lang>{"zh_Hans":"本次可挖(KT)","zh_Hant":"本次可挖(KT)","en":""}</pi-ui-lang></div>
                        <div w-class="otherNum">{{it.mines}}</div>
                    </div>
                    <div ev-btn-tap="doPadding">
                        {{let item = {zh_Hans:"挖一下",zh_Hant:"挖一下",en:""} }}
                        <app-components1-btn-btn>{name:{{item}},"types":"small"}</app-components1-btn-btn>                    
                    </div>
                </div>

                <div w-class="dividLine"></div>

                <div w-class="titleMode" on-tap="goNextPage(0)">
                    <img src="../../../res/image1/mine_top.png" w-class="rankTop"/>
                    <span w-class="miningTitle" style="flex: 1;"><pi-ui-lang>{"zh_Hans":"挖矿排名","zh_Hant":"挖礦排名","en":""}</pi-ui-lang></span>
                    <span w-class="miningTitle"><pi-ui-lang>{"zh_Hans":"第","zh_Hant":"第","en":""}</pi-ui-lang>{{it.rankNum}}<pi-ui-lang>{"zh_Hans":"位","zh_Hant":"位","en":""}</pi-ui-lang></span>
                    <img src="../../../res/image1/25_blue.png" w-class="rankList"/>
                </div>
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
    
    <div w-class="bottomMode"></div>
</div>