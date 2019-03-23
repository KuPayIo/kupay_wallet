<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goDetail" ev-refresh-click="refreshPage">
    {{: topBarTitle = {"zh_Hans":"领分红","zh_Hant":"領分紅","en":""} }}	
    <app-components-topBar-topBar2>{scrollHeight:{{it.scrollHeight}},text:{{topBarTitle}},nextImg:{{it.scrollHeight>0?"../../res/image/41_blue.png":"../../res/image/41_white.png"}} }</app-components-topBar-topBar2>
    <div style="text-align: center;position: absolute;width: 100%;top: 150px;z-index: 0;">
        <img src="../../../res/image/dividend_background.png" style="width: 570px;" />
    </div>
    <div w-class="content" on-scroll="getMoreList" id="historylist">
        <div id="history">

            <div w-class="groupcard">
                <div w-class="dividend-title">
                    <pi-ui-lang>{zh_Hans:"累计分红(ETH)",zh_Hant:"累計分紅(ETH)",en:""}</pi-ui-lang>
                </div>
                <div w-class="dividend-money">{{it.totalDivid}}</div>
                <div w-class="dividLine"></div>
                <div w-class="dividend-sum">
                    <span style="display: inline-block;vertical-align: middle;">
                        <pi-ui-lang>{zh_Hans:"持有",zh_Hant:"持有",en:""}</pi-ui-lang>&nbsp;{{it.ktBalance}}&nbsp;{{it.KTShow}}
                    </span>
                </div>
            </div>

            <div style="margin-top: 10px;transform: translateZ(-1px);">
                {{: threeCard=[{zh_Hans:"年化收益",zh_Hant:"年化收益",en:""},{zh_Hans:"本次分红",zh_Hant:"本次分紅",en:""},{zh_Hans:"已分红天数",zh_Hant:"已分紅天數",en:""}]}}
                <app-components-threeParaCard-threeParaCard>{"name":{{threeCard}},"data":[{{it.yearIncome}},{{it.thisDivid}},{{it.totalDays}}]
                    }</app-components-threeParaCard-threeParaCard>
            </div>

            <div id="dividendBtn" style="text-align: center;margin-top: 180px;height: 200px;">
                <div w-class="miningBtn" on-tap="doMining" style="color: #fff;animation:{{it.isAbleBtn?'dividendChange 0.2s':''}}">
                    <pi-ui-lang>{zh_Hans:"领分红",zh_Hant:"領分紅",en:""}</pi-ui-lang>
                </div>
                <div class="dividendNum" style="animation:{{it.doMining?'dividendMove 1s':''}}">
                    <span>+{{it.thisDivid}}</span>
                </div>
            </div>

            <div w-class="history">
                <div w-class="historyTitle">
                    <pi-ui-lang>{zh_Hans:"分红记录",zh_Hant:"分紅記錄",en:""}</pi-ui-lang>
                </div>
                {{if it.data.length==0}}
                <div w-class="historyNone">
                    <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;" />
                    <div>
                        <pi-ui-lang>{zh_Hans:"还没有记录哦",zh_Hant:"還沒有記錄哦",en:""}</pi-ui-lang>
                    </div>
                </div>
                {{end}}

                <div w-class="historyContent">
                    {{for ind,val of it.data}}
                    <div w-class="historyItem">
                        <span style="flex: 1;">{{val.time}}</span>
                        <span>{{val.num + " ETH"}}</span>
                    </div>
                    {{end}}

                    {{if it.data.length>0 && !it.hasMore}}
                    <div w-class="endMess">
                        <pi-ui-lang>{zh_Hans:"到此结束啦",zh_Hant:"到此結束啦",en:""}</pi-ui-lang>^_^
                    </div>
                    {{end}}
                </div>

            </div>
        </div>
    </div>
</div>