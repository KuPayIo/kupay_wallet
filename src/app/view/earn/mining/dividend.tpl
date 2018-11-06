<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goDetail" ev-refresh-click="refreshPage">

    <div w-class="content" on-scroll="getMoreList" id="historylist">
        <div id="history">
            <div style="text-align: center;position: fixed;width: 100%;top: 330px;">
                <img src="../../../res/image/dividend_background.png" style="width: 611px;height: 800px;" />
            </div>

            <div w-class="groupcard">
                <div w-class="dividend-title">
                    <pi-ui-lang>{zh_Hans:"�ۼƷֺ�(ETH)",zh_Hant:"��Ӌ�ּt(ETH)",en:""}</pi-ui-lang>
                </div>
                <div w-class="dividend-money">{{it1.totalDivid}}</div>
                <div w-class="dividLine"></div>
                <div w-class="dividend-sum">
                    <span style="display: inline-block;vertical-align: middle;">
                        <pi-ui-lang>{zh_Hans:"����",zh_Hant:"����",en:""}</pi-ui-lang>&nbsp;{{it1.ktBalance}}&nbsp;KT
                    </span>
                </div>
            </div>

            <div style="margin-top: 10px;transform: translateZ(-1px);">
                {{: threeCard=[{zh_Hans:"�껯����",zh_Hant:"�껯����",en:""},{zh_Hans:"���ηֺ�",zh_Hant:"���ηּt",en:""},{zh_Hans:"�ѷֺ�����",zh_Hant:"�ѷּt�씵",en:""}]}}
                <app-components-threeParaCard-threeParaCard>{"name":{{threeCard}},"data":[{{it1.yearIncome}},{{it1.thisDivid}},{{it1.totalDays}}]
                    }</app-components-threeParaCard-threeParaCard>
            </div>

            <div id="dividendBtn" style="text-align: center;margin-top: 180px;height: 200px;">
                <div w-class="miningBtn" on-tap="doMining" style="color: #fff;animation:{{it1.isAbleBtn?'dividendChange 0.2s':''}}">
                    <pi-ui-lang>{zh_Hans:"��ֺ�",zh_Hant:"�I�ּt",en:""}</pi-ui-lang>
                </div>
                <div class="dividendNum" style="animation:{{it1.doMining?'dividendMove 1s':''}}">
                    <span>+{{it1.thisDivid}}</span>
                </div>
            </div>

            <div w-class="history">
                <div w-class="historyTitle">
                    <pi-ui-lang>{zh_Hans:"�ֺ��¼",zh_Hant:"�ּtӛ�",en:""}</pi-ui-lang>
                </div>
                {{if it1.data.length==0}}
                <div w-class="historyNone">
                    <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;" />
                    <div>
                        <pi-ui-lang>{zh_Hans:"��û�м�¼Ŷ",zh_Hant:"߀�]��ӛ�Ŷ",en:""}</pi-ui-lang>
                    </div>
                </div>
                {{end}}

                <div w-class="historyContent">
                    {{for ind,val of it1.data}}
                    <div w-class="historyItem">
                        <span style="flex: 1;">{{val.time}}</span>
                        <span>{{val.num + " ETH"}}</span>
                    </div>
                    {{end}}

                    {{if it1.data.length>0 && !it1.hasMore}}
                    <div w-class="endMess">
                        <pi-ui-lang>{zh_Hans:"���˽�����",zh_Hant:"���˽Y����",en:""}</pi-ui-lang>^_^
                    </div>
                    {{end}}
                </div>

            </div>
        </div>
    </div>
   {{: topBarTitle = {"zh_Hans":"��ֺ�","zh_Hant":"�I�ּt","en":""} }}	
    <app-components1-topBar-topBar2>{scrollHeight:{{it1.scrollHeight}},text:{{topBarTitle}},nextImg:{{it1.scrollHeight>0?"../../res/image/41_blue.png":"../../res/image/41_white.png"}} }</app-components1-topBar-topBar2>
</div>