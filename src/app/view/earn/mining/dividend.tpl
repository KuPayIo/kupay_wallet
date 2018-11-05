<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goDetail" ev-refresh-click="refreshPage">
    
    <div w-class="content" on-scroll="getMoreList" id="historylist">
        <div id="history">
            <div style="text-align: center;position: fixed;width: 100%;top: 330px;" >
                <img src="../../../res/image/dividend_background.png" style="width: 611px;height: 800px;"/>
            </div>

            <div w-class="groupcard">
                <div w-class="dividend-title">{{it1.cfgData.dividendTitle}}</div>
                <div w-class="dividend-money">{{it1.totalDivid}}</div>
                <div w-class="dividLine"></div>
                <div w-class="dividend-sum">
                    <span style="display: inline-block;vertical-align: middle;">{{it1.cfgData.tips[0]}}&nbsp;{{it1.ktBalance}}&nbsp;KT</span>
                </div>    
            </div>      
            
            <div style="margin-top: 10px;transform: translateZ(-1px);">
                <app-components-threeParaCard-threeParaCard>{"name":{{it1.cfgData.threeCard}},"data":[{{it1.yearIncome}},{{it1.thisDivid}},{{it1.totalDays}}] }</app-components-threeParaCard-threeParaCard>
            </div>

            <div id="dividendBtn" style="text-align: center;margin-top: 180px;height: 200px;">
                <div w-class="miningBtn" on-tap="doMining" style="color: #fff;animation:{{it1.isAbleBtn?'dividendChange 0.2s':''}}" >{{it1.cfgData.btnName}}</div>
                <div class="dividendNum" style="animation:{{it1.doMining?'dividendMove 1s':''}}">
                    <span>+{{it1.thisDivid}}</span>
                </div>  
            </div> 
        
            <div w-class="history">
                <div w-class="historyTitle">{{it1.cfgData.history}}</div>
                {{if it1.data.length==0}}
                <div w-class="historyNone">
                    <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;"/>
                    <div>{{it1.cfgData.tips[1]}}</div>
                </div>
                {{end}}

                <div w-class="historyContent" >
                    {{for ind,val of it1.data}}
                    <div w-class="historyItem">
                        <span style="flex: 1;">{{val.time}}</span>
                        <span>{{val.num + " ETH"}}</span>
                    </div>
                    {{end}}
                    
                    {{if it1.data.length>0 && !it1.hasMore}}
                    <div w-class="endMess">{{it1.cfgData.tips[2]}}^_^</div>
                    {{end}}
                </div>

            </div>
        </div>
    </div>
   
    <app-components1-topBar-topBar2>{scrollHeight:{{it1.scrollHeight}},text:{{it1.cfgData.topBarTitle}},nextImg:{{it1.scrollHeight>0?"../../res/image/41_blue.png":"../../res/image/41_white.png"}} }</app-components1-topBar-topBar2>
</div>