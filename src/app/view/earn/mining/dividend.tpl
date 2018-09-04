<div class="new-page" style="background: linear-gradient(#F94E4D, #F6A050);" ev-back-click="backPrePage" ev-next-click="goDetail">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":"领分红",nextImg:"../../res/image/41_white.png",background:"#F94E4D" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":"领分红",nextImg:"../../res/image/41_blue.png"}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" id="content" on-scroll="scroll">
        <div w-class="groupcard">
            <div w-class="dividend-title">累计分红(ETH)</div>
            <div w-class="dividend-money">0.00</div>
            <div w-class="dividLine"></div>
            <div w-class="dividend-sum">
                <span style="display: inline-block;vertical-align: middle;">持有 0 KT</span>
            </div>    
        </div>      
        
        <div style="margin-top: 10px;">
            <app-components-threeParaCard-threeParaCard>{"name":["年华收益","本次分红","已分红天数"],"data":["8%","0","1"]}</app-components-threeParaCard-threeParaCard>
        </div>
        <div style="text-align: center;" id="miningBtn">
            <img src="../../../res/image/dividend_background.png" style="width: 611px;height: 800px;margin-top: -360px;"/>
            <div style="margin-top: -240px;height: 200px;"><div w-class="miningBtn" class="miningBtnClick" on-tap="doMining" style="animation:{{it1.isAbleBtn?'change 0.2s':''}}" >领分红</div></div>
        </div>
        <div class="miningNum" style="animation:{{it1.doMining?'move 0.5s':''}}">
            <span>+0</span>
        </div>
    
        <div w-class="history">
            <div w-class="historyTitle">分红记录</div>
            <div w-class="historyNone">
                <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;"/>
                <div>还没有记录哦</div>
            </div>
            <div w-class="historyContent">
                
            </div>
        </div>

        <div style="height: 118px;"></div>
    </div>
    
</div>