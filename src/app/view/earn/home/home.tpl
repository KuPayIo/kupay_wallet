<div class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
        <img src="../../../res/image/topbar_backimg.png" w-class="backImg"/>
        <div w-class="groupCard">
            <div w-class="titleMode">
                <img src="../../../res/image/mine_makmoney.png" w-class="makeMoney"/>
                <span w-class="totalTitle">累计挖矿(KT)</span>
                <img src="../../../res/image/41_blue.png" w-class="miningDetail" on-tap="miningDetail"/>
            </div>

            <div w-class="totalNum">{{it1.ktBalance}}</div>

            <div w-class="titleMode">
                <div w-class="totalTitle">
                    <div>矿山剩余(KT)</div>
                    <div w-class="otherNum">{{it1.mineLast}}</div>
                </div>
                <div w-class="totalTitle">
                    <div>本次可挖(KT)</div>
                    <div w-class="otherNum">{{it1.mines}}</div>
                </div>
                <div ev-btn-tap="doPadding">
                    <app-components-btn-btn>{name:"挖一下","types":"small"}</app-components-btn-btn>
                </div>
            </div>

            <div w-class="dividLine"></div>

            <div w-class="titleMode" on-tap="goNextPage(0)">
                <img src="../../../res/image/mine_top.png" w-class="rankTop"/>
                <span w-class="miningTitle" style="flex: 1;">挖矿排名</span>
                <span w-class="miningTitle">第{{it1.rankNum}}位</span>
                <img src="../../../res/image/25_blue.png" w-class="rankList"/>
            </div>
        </div>

        <div w-class="menuCard">
            <div w-class="oneBtn" on-tap="goNextPage(1)">
                <img src="../../../res/image/btn_yun_1.png" w-class="btnImg"/>
                <div w-class="btnMess">领分红</div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(2)">
                <img src="../../../res/image/btn_yun_2.png" w-class="btnImg"/>
                <div w-class="btnMess">发红包</div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(3)">
                <img src="../../../res/image/btn_yun_3.png" w-class="btnImg"/>
                <div w-class="btnMess">兑换</div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(4)">
                <img src="../../../res/image/btn_yun_4.png" w-class="btnImg"/>
                <div w-class="btnMess">做任务</div>
            </div>
        </div>

        <div style="display: flex;align-items: center;">
            <span style="font-size: 36px;font-weight: 600;margin-left: 50px;flex: 1;">福利活动</span>
            <img src="../../../res/image/25_gray.png" style="width: 40px;height: 40px;margin-right: 50px;"/>
        </div>

        <img src="../../../res/image/Card.png" style="height: 250px;margin: 35px 20px;"/>
    </div>    
</div>