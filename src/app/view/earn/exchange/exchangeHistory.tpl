<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    {{if !it1.isScroll}}
    <app-components1-topBar-topBar>{"title":"兑换记录",background:"#3EB4F1" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":"兑换记录"}</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="getMoreList" id="exchangeHistoryContent">
        <div id="exchangeHistoryRecords" w-class="records">
            <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg"/>
            
            <div w-class="topBack">
                <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
                <div style="margin-top: 20px;">共兑换</div>
                <div style="margin-bottom: 90px;"><span style="font-size: 64px;">{{it1.convertNumberShow}}</span>个礼包</div>
            </div>
            <div w-class="bottom">
                {{if it1.recordListShow.length==0}}
                    <div style="text-align: center;">
                        <img src="../../../res/image/exchangeEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;"/>
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">还没有兑换过礼物</div>
                    </div>
                {{else}}
                    <div w-class="tips">过期未被领取的红包已退回云端账户</div>
                    {{for ind,val of it1.recordListShow}}
                    <div on-tap="goDetail({{ind}})">
                        <app-components-fourParaItem-fourParaItem>{ name:{{val.rtypeShow}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},describe:{{val.curNum+"/"+val.totalNum+"个"}} }</app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips}}
                <div w-class="endMess" id="more">到此结束啦^_^</div>
                {{end}}

            </div>
            
        </div>
    </div>
</div>