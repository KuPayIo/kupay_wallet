<div class="ga-new-page" style="background-image: linear-gradient(-180deg, #FFB800 0%, #FFE400 100%);overflow-y: auto;height: 100%;overflow-x: hidden; ">
    <div w-class="">
        <div w-class="ga-top-banner">
            <img src="../../../res/image/btn_back_white.png" w-class="ga-back" on-tap="backPrePage"/>
            <span w-class="ga-banner-title" on-tap="backPrePage">挖矿</span>    
            <span w-class="ga-next" on-tap="goHistory">挖矿历史</span>
        </div>
        <div w-class="groupcard">
            <div w-class="dividend-title">已挖(KT)</div>
            <div w-class="dividend-money">{{it1.holdNum}}</div>
            <div w-class="dividLine"></div>
            <div w-class="dividend-sum" on-tap="goRank">
                <img src="../../../res/image/icon_bonus_ranking.png" style="width: 54px;height: 70px;display: inline-block;vertical-align: middle;"/>
                <span style="display: inline-block;vertical-align: middle;">排名第 {{it1.mineRank}} 位</span>
            </div>    
        </div>      
        
        <div w-class="groupcard">
            <div w-class="twodata">
                <div w-class="data">
                    <div w-class="data-title" style="border-right: 3px solid rgb(227,230,245); ">本次可挖(KT)</div>
                    <div w-class="data-num" style="border-right: 3px solid rgb(227,230,245); ">{{it1.thisNum}}</div>
                </div>
                <div w-class="data">
                    <div w-class="data-title">矿山总量(KT)</div>
                    <div w-class="data-num">{{it1.totalNum}}</div>
                </div>
            </div>   
        </div>
    </div>

    <div style="text-align: center;">
        <img src="../../../res/image/Group 531.png" style="width: 611px;height: 800px;margin-top: -360px;"/>
        <div style="margin-top: -190px;"><div w-class="miningBtn">挖一下</div></div>
    </div>

    <div w-class="addMine" on-tap="goAddMine">去增加储备矿</div>

    <div style="text-align: center;">
        <span w-class="line"></span>
        <span w-class="rule-title">挖矿规则</span>
        <span w-class="line"></span>            
    </div>
    <div w-class="dividend-rule">
        <div w-class="rulemess">1、用户每日可挖取储矿的25%KT，最高10000KT。</div>
        <div w-class="rulemess">2、储矿量小于100KT，则把剩下的一次性挖完。</div>
        <div w-class="rulemess">3、每日只能挖一次，挖矿结算后，挖到的数量将从储矿量中减去。</div>
        <div w-class="rulemess">4、真实用户的标准是曾经达到1000KT。</div>
        <div w-class="rulemess">5、拥有1000KT才具有提现权限。</div>   
    </div>
    
</div>