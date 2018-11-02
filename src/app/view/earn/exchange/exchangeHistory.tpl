<div class="new-page" w-class="new-page">
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
                    <div style="text-align: center;height: 100%;">
                        <img src="../../../res/image/exchangeEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;"/>
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">{{it1.cfgData.tips[2]}}</div>
                    </div>
                {{else}}
                    <div w-class="tips">{{it1.cfgData.tips[3]}}</div>
                    {{for ind,val of it1.recordListShow}}
                    <div on-tap="goDetail({{ind}})">
                        <app-components-fourParaItem-fourParaItem>{ name:{{val.userName}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},showPin:{{val.rtype==1}} }</app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips}}
                <div w-class="endMess" id="more">{{it1.cfgData.tips[5]}}^_^</div>
                {{end}}

            </div>
            
        </div>
    </div>

    {{let opca = it1.scrollHeight/200}}
    <div w-class="ga-top-banner" style="{{it1.scroll?'background:rgba(255, 255, 255, '+ opca +');border-bottom: 1px solid #cccccc;':'background:transparent;'}}">
        <div w-class="left-container">
            <img on-tap="backPrePage" src="../../../res/image/{{it1.scroll ? 'left_arrow_blue.png' : 'left_arrow_white.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{it1.scroll ? '#222':'#fff'}}">{{it1.cfgData.topBarTitle}}</span>
        </div>
        <img on-tap="refreshPage" src="../../../res/image1/{{it1.scroll?'refresh_blue.png':'refresh_white.png'}}" w-class="refreshBtn" class="{{it1.topRefresh?'refreshing':''}}"/>
    </div>
</div>