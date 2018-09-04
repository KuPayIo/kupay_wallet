<div class="new-page" ev-back-click="backPrePage" style="background-color: #F2F2F2;">
    <app-components1-topBar-topBar>{title:"挖矿记录" }</app-components1-topBar-topBar>
    <div style="height: 100%;overflow-x: hidden;overflow-y: auto;" id="historylist" on-scroll="getMoreList">

        <div w-class="history">
            {{for ind,val of it1.data}}
            <app-components-fourParaItem-fourParaItem>{"name":"挖矿","data":{{val.num+' ETH'}},"time":{{val.time}} }</app-components-fourParaItem-fourParaItem>
            {{end}}

            <div w-class="endMess">到此结束啦^_^</div>
        </div>
        
        {{if it1.data.length==0}}
        <div w-class="historyNone">
            <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;"/>
            <div>还没有记录哦</div>
        </div>
        {{end}}
        
        {{% <div w-class="loadmore">加载中，请稍后~~~</div>}}
        <div style="height: 118px;" id="more"></div>
    </div>
</div>