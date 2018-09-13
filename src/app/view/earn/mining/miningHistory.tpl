<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{title:"挖矿记录" }</app-components1-topBar-topBar>
    <div w-class="historylist" id="historylist" on-scroll="getMoreList">

        <div w-class="history">
            {{for ind,val of it1.data}}
            <div style="{{ind>0?'background: #ffffff;':''}}">
                <app-components-fourParaItem-fourParaItem>{"name":"挖矿","data":{{val.num+' ETH'}},"time":{{val.time}} }</app-components-fourParaItem-fourParaItem>
            </div>
            {{end}}

            {{if it1.data.length>0 && !it1.more}}
            <div w-class="endMess">到此结束啦^_^</div>
            {{end}}

            {{if it1.data.length==0}}
            <div w-class="historyNone">
                <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;margin-bottom: 20px;"/>
                <div>还没有记录哦</div>
            </div>
            {{end}}
        </div>
        
    </div>
</div>