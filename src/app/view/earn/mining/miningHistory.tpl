<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    <app-components1-topBar-topBar>{title:{{it1.cfgData.topBarTitle}},refreshImg:"../../res/image1/refresh_blue.png" }</app-components1-topBar-topBar>
    <div w-class="historylist" id="historylist" on-scroll="getMoreList">

        <div w-class="history" id="history">
            {{for ind,val of it1.data}}
            <div style="{{ind>0?'background: #ffffff;':''}}">
                <app-components-fourParaItem-fourParaItem>{"name":{{it1.cfgData.itemName}},"data":{{val.num+' KT'}},"time":{{val.time}} }</app-components-fourParaItem-fourParaItem>
            </div>
            {{end}}

            {{if it1.data.length>0 && !it1.hasMore}}
            <div w-class="endMess">{{it1.cfgData.tips[0]}}^_^</div>
            {{end}}

            {{if it1.data.length==0}}
            <div w-class="historyNone">
                <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;margin-bottom: 20px;"/>
                <div>{{it1.cfgData.tips[1]}}</div>
            </div>
            {{end}}
        </div>
        
    </div>
</div>