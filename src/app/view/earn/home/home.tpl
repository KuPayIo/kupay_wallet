<div class="new-page" style="display: flex;flex-direction: column;">
    {{if it1.scroll}}
    {{let opca = it1.scrollHeight/100}}
    <div style="background:rgba(255, 255, 255, {{opca}})" w-class="topBar1">
        <img src="../../../res/image/contact.png" w-class="userHead" on-tap="showMine"/>
    </div>
    {{else}}
    <div w-class="topBar">
        <img src="../../../res/image1/default_avatar.png" w-class="userHead" on-tap="showMine"/>
    </div>
    {{end}}
    <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
    <img src="../../../res/image1/{{it1.scroll?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" on-tap="refreshPage" class="{{it1.refresh ?'refreshing':''}}"/>

    <div w-class="contain" id="contain" on-scroll="scrollPage" >
        <div w-class="topBack">
            
            <div w-class="groupCard">
                <div w-class="titleMode">
                    <img src="../../../res/image1/mine_makmoney.png" w-class="makeMoney"/>
                    <span w-class="totalTitle">{{it1.cfgData.totalTitle}}</span>
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
                        <div>{{it1.cfgData.leftTitle}}</div>
                        <div w-class="otherNum">{{it1.mineLast}}</div>
                    </div>
                    <div w-class="totalTitle">
                        <div>{{it1.cfgData.rightTitle}}</div>
                        <div w-class="otherNum">{{it1.mines}}</div>
                    </div>
                    <div ev-btn-tap="doPadding">
                        <app-components1-btn-btn>{name:{{it1.cfgData.btnName}},"types":"small"}</app-components1-btn-btn>                    
                    </div>
                </div>

                <div w-class="dividLine"></div>

                <div w-class="titleMode" on-tap="goNextPage(0)">
                    <img src="../../../res/image1/mine_top.png" w-class="rankTop"/>
                    <span w-class="miningTitle" style="flex: 1;">{{it1.cfgData.miningTitle}}</span>
                    <span w-class="miningTitle">{{it1.cfgData.tips[0] + it1.rankNum + it1.cfgData.tips[1]}}</span>
                    <img src="../../../res/image1/25_blue.png" w-class="rankList"/>
                </div>
            </div>

            <div w-class="menuCard">
                <div w-class="oneBtn" on-tap="goNextPage(1)">
                    <img src="../../../res/image1/btn_yun_1.png" w-class="btnImg"/>
                    <div w-class="btnMess">{{it1.cfgData.btnMess[0]}}</div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(2)">
                    <img src="../../../res/image1/btn_yun_2.png" w-class="btnImg"/>
                    <div w-class="btnMess">{{it1.cfgData.btnMess[1]}}</div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(3)">
                    <img src="../../../res/image1/btn_yun_3.png" w-class="btnImg"/>
                    <div w-class="btnMess">{{it1.cfgData.btnMess[2]}}</div>
                </div>
                <div w-class="oneBtn" on-tap="goNextPage(4)">
                    <img src="../../../res/image1/btn_yun_4.png" w-class="btnImg"/>
                    <div w-class="btnMess">{{it1.cfgData.btnMess[3]}}</div>
                </div>
            </div>

            <div style="display: flex;align-items: center;">
                <span style="font-size: 36px;font-weight: 600;margin-left: 50px;flex: 1;">{{it1.cfgData.welfare}}</span>
                <img src="../../../res/image1/25_gray.png" w-class="welfareImg"/>
            </div>

            <div style="margin: 15px 20px;">
                <img src="../../../res/image1/Card.png" style="height: 250px;width: 100%;"/>
            </div>
        </div>  
    </div>
    <div w-class="bottomMode"></div>
</div>