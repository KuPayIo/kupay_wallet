<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    <div w-class="content" on-scroll="getMoreList" id="exchangeHistoryContent">
        <div id="exchangeHistoryRecords" w-class="records">
            <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg"/>
            
            <div w-class="topBack">
                <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
                <div style="margin-top: 20px;"><pi-ui-lang>{"zh_Hans":"共兑换","zh_Hant":"共兌換","en":""}</pi-ui-lang></div>
                <div style="margin-bottom: 90px;">
                    <span style="font-size: 64px;">{{it1.convertNumberShow}}</span>
                    <pi-ui-lang>{"zh_Hans":"个礼包","zh_Hant":"個禮包","en":""}</pi-ui-lang>
                </div>
            </div>
            <div w-class="bottom">
                {{if it1.recordListShow.length==0}}
                    <div style="text-align: center;height: 100%;">
                        <img src="../../../res/image/exchangeEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;"/>
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">
                            <pi-ui-lang>{"zh_Hans":"还没有兑换过礼物","zh_Hant":"還沒有兌換過禮物","en":""}</pi-ui-lang>
                        </div>
                    </div>
                {{else}}
                    <div w-class="tips">
                        <pi-ui-lang>{"zh_Hans":"24小时未被领取的红包已退回云账户","zh_Hant":"24小時未被領取的紅包已退回雲賬戶","en":""}</pi-ui-lang>
                    </div>
                    {{for ind,val of it1.recordListShow}}
                    <div on-tap="goDetail({{ind}})">
                        {{: userName = {"zh_Hans":val.userName,"zh_Hant":val.userName,"en":""} }}
                        <app-components-fourParaItem-fourParaItem>{ name:{{userName}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},showPin:{{val.rtype==1}} }</app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips}}
                <div w-class="endMess" id="more"><pi-ui-lang>{"zh_Hans":"到此结束啦","zh_Hant":"到此結束啦","en":""}</pi-ui-lang>^_^</div>
                {{end}}

            </div>
            
        </div>
    </div>

    {{: topBarTitle = {"zh_Hans":"兑换记录","zh_Hant":"兌換記錄","en":""} }}	
<app-components1-topBar-topBar2>{scrollHeight:{{it1.scrollHeight}},text:{{topBarTitle}} }</app-components1-topBar-topBar2>
</div>