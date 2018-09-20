<div class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image1/default_avatar.png" w-class="userHead" on-tap="showMine"/>
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <div w-class="groupCard">
            <div w-class="titleMode">
                <img src="../../../res/image1/mine_makmoney.png" w-class="makeMoney"/>
                <span w-class="totalTitle">{{_cfg.totalTitle}}</span>
                <img src="../../../res/image1/41_blue.png" w-class="miningDesc" on-tap="miningDesc"/>
            </div>

            <div w-class="totalNum" id="mining">
                {{it1.ktBalance}}
                <span class="miningNum" style="animation:{{it1.doMining?'miningEnlarge 0.3s linear':''}}">
                    +{{it1.mines}}
                </span>  
            </div>

            <div w-class="titleMode">
                <div w-class="totalTitle">
                    <div>{{_cfg.leftTitle}}</div>
                    <div w-class="otherNum">{{it1.mineLast}}</div>
                </div>
                <div w-class="totalTitle">
                    <div>{{_cfg.rightTitle}}</div>
                    <div w-class="otherNum">{{it1.mines}}</div>
                </div>
                <div ev-btn-tap="doPadding">
                    <app-components-btn-btn>{name:{{_cfg.btnName}},"types":"small"}</app-components-btn-btn>
                </div>
            </div>

            <div w-class="dividLine"></div>

            <div w-class="titleMode" on-tap="goNextPage(0)">
                <img src="../../../res/image1/mine_top.png" w-class="rankTop"/>
                <span w-class="miningTitle" style="flex: 1;">{{_cfg.miningTitle}}</span>
                <span w-class="miningTitle">{{_cfg.tips[0] + it1.rankNum + _cfg.tips[1]}}</span>
                <img src="../../../res/image1/25_blue.png" w-class="rankList"/>
            </div>
        </div>

        <div w-class="menuCard">
            <div w-class="oneBtn" on-tap="goNextPage(1)">
                <img src="../../../res/image1/btn_yun_1.png" w-class="btnImg"/>
                <div w-class="btnMess">{{_cfg.btnMess[0]}}</div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(2)">
                <img src="../../../res/image1/btn_yun_2.png" w-class="btnImg"/>
                <div w-class="btnMess">{{_cfg.btnMess[1]}}</div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(3)">
                <img src="../../../res/image1/btn_yun_3.png" w-class="btnImg"/>
                <div w-class="btnMess">{{_cfg.btnMess[2]}}</div>
            </div>
            <div w-class="oneBtn" on-tap="goNextPage(4)">
                <img src="../../../res/image1/btn_yun_4.png" w-class="btnImg"/>
                <div w-class="btnMess">{{_cfg.btnMess[3]}}</div>
            </div>
        </div>

        <div style="display: flex;align-items: center;">
            <span style="font-size: 36px;font-weight: 600;margin-left: 50px;flex: 1;">{{_cfg.welfare}}</span>
            <img src="../../../res/image1/25_gray.png" style="width: 40px;height: 40px;margin-right: 50px;"/>
        </div>

        <div style="margin: 35px 20px;">
            <img src="../../../res/image1/Card.png" style="height: 250px;width: 100%;"/>
        </div>
    </div>    
</div>