<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goDetail">
    {{if !it1.scroll}}
    <app-components1-topBar-topBar>{"title":"领分红",nextImg:"../../res/image/41_white.png",background:"#F94E4D" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":"领分红",nextImg:"../../res/image/41_blue.png"}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" id="content" on-scroll="pageScroll">
        <div style="text-align: center;position: fixed;width: 100%;top: 330px;" >
            <img src="../../../res/image/dividend_background.png" style="width: 611px;height: 800px;"/>
        </div>

        <div w-class="groupcard">
            <div w-class="dividend-title">累计分红(ETH)</div>
            <div w-class="dividend-money">{{it1.totalDivid}}</div>
            <div w-class="dividLine"></div>
            <div w-class="dividend-sum">
                <span style="display: inline-block;vertical-align: middle;">持有 {{" "+it1.ktBalance+" "}} KT</span>
            </div>    
        </div>      
        
        <div style="margin-top: 10px;transform: translateZ(-1px);">
            <app-components-threeParaCard-threeParaCard>{"name":["年华收益","本次分红","已分红天数"],"data":[{{it1.yearIncome}},{{it1.thisDivid}},{{it1.totalDays}}] }</app-components-threeParaCard-threeParaCard>
        </div>

        <div id="dividendBtn" style="text-align: center;margin-top: 180px;height: 200px;">
            <div w-class="miningBtn" on-tap="doMining" style="color: #fff;animation:{{it1.isAbleBtn?'dividendChange 0.2s':''}}" >领分红</div>
            <div class="dividendNum" style="animation:{{it1.doMining?'dividendMove 1s':''}}">
                <span>+{{it1.thisDivid}}</span>
            </div>  
        </div> 
    
        <div w-class="history">
            <div w-class="historyTitle">分红记录</div>
            {{if it1.dividHistory.length==0}}
            <div w-class="historyNone">
                <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;"/>
                <div>还没有记录哦</div>
            </div>
            {{end}}

            <div w-class="historyContent">
                {{for ind,val of it1.dividHistory}}
                <div w-class="historyItem">
                    <span style="flex: 1;">{{val.time}}</span>
                    <span>{{val.num + " ETH"}}</span>
                </div>
                {{end}}
                
                {{if it1.dividHistory.length>0}}
                <div w-class="endMess">到此结束啦^_^</div>
                {{end}}
            </div>
        </div>

    </div>
    
</div>