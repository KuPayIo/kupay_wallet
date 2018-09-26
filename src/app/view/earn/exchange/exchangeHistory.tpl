<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
    {{if !it1.isScroll}}
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},background:"#3EB4F1" }</app-components1-topBar-topBar>
    {{else}}
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    {{end}}
    <div w-class="content" on-scroll="getMoreList" id="exchangeHistoryContent">
        <div id="exchangeHistoryRecords" w-class="records">
            <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg"/>
            
            <div w-class="topBack">
                <img src="../../../res/image/default_avater_big.png" w-class="userHead"/>
                <div style="margin-top: 20px;">{{it1.cfgData.tips[0]}}</div>
                <div style="margin-bottom: 90px;"><span style="font-size: 64px;">{{it1.convertNumberShow}}</span>{{it1.cfgData.tips[1]}}</div>
            </div>
            <div w-class="bottom">
                {{if it1.recordListShow.length==0}}
                    <div style="text-align: center;">
                        <img src="../../../res/image/exchangeEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;"/>
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">{{it1.cfgData.tips[2]}}</div>
                    </div>
                {{else}}
                    <div w-class="tips">{{it1.cfgData.tips[3]}}</div>
                    {{for ind,val of it1.recordListShow}}
                    <div on-tap="goDetail({{ind}})">
                        {{let desc=val.totalNum?val.curNum + "/" + val.totalNum + it1.cfgData.tips[4]:""}}
                        <app-components-fourParaItem-fourParaItem>{ name:{{val.rtypeShow}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},describe:{{desc}} }</app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips}}
                <div w-class="endMess" id="more">{{it1.cfgData.tips[5]}}^_^</div>
                {{end}}

            </div>
            
        </div>
    </div>
</div>