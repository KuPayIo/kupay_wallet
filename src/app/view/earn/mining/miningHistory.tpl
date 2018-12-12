<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    {{: topBarTitle = {"zh_Hans":"挖矿记录","zh_Hant":"挖礦記錄","en":""} }}
    <app-components1-topBar-topBar>{title:{{topBarTitle}},refreshImg:"../../res/image1/refresh_blue.png" }</app-components1-topBar-topBar>
    <div w-class="historylist" id="historylist" on-scroll="getMoreList">

        <div w-class="history" id="history">
            {{: itemName = {"zh_Hans":"挖矿","zh_Hant":"挖礦","en":""} }}
            {{for ind,val of it.data}}
            <div style="{{ind>0?'background: #ffffff;':''}}">
                <app-components-fourParaItem-fourParaItem>{"name":{{itemName}},"data":{{val.num+' KT'}},"time":{{val.time}} }</app-components-fourParaItem-fourParaItem>
            </div>
            {{end}}

            {{if it.data.length>0 && !it.hasMore}}
            <div w-class="endMess">
                <pi-ui-lang>{"zh_Hans":"到此结束啦","zh_Hant":"到此結束啦","en":""}</pi-ui-lang>^_^
            </div>
            {{end}}

            {{if it.data.length==0}}
            <div w-class="historyNone">
                <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;margin-bottom: 20px;" />
                <div>
                    <pi-ui-lang>{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</pi-ui-lang>
                </div>
            </div>
            {{end}}
        </div>

    </div>
</div>