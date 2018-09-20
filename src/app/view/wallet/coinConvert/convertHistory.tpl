<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{title:"币币兑换"}</app-components1-topBar-topBar>
    <div w-class="content" on-scroll="">
        {{for ind,item of it1.txsShow}}
        <div w-class="item">
            <div w-class="itemRow status">
                <span w-class="{{item.status_class}}" style="flex: 1 0 0;">{{item.status_show}}</span>
                <span>{{item.inputCurrency}}<img src="../../../res/image/rightArrow.png" w-class="arrow"/>{{item.outputCurrency}}</span>
            </div>
            <div w-class="itemRow rate">
                <span style="flex: 1 0 0;">汇率:&nbsp;{{item.shiftRate}}</span>
                <span>{{item.timestamp_show}}</span>
            </div>
            <div w-class="dividLine"></div>
            <div w-class="itemRow outmess" on-tap="inHashClick(e,{{ind}})">
                <span style="color: #3790E6;flex: 1 0 0;">{{item.inputTXID_show}}</span>
                <span>-{{item.inputAmount}}</span>
            </div>
            {{if item.status === 'complete'}}
            <div w-class="itemRow outmess" on-tap="outHashClick(e,{{ind}})">
                <span style="color: #3790E6;flex: 1 0 0;">{{item.outputTXID_show}}</span>
                <span>+{{item.outputAmount}}</span>
            </div>
            {{end}}
        </div>
        {{end}}

        {{if it1.txsShow.length==0}}
        <div w-class="historyNone">
            <img src="../../../res/image/dividend_history_none.png" style="width: 200px;height: 200px;margin-bottom: 20px;"/>
            <div>还没有记录哦</div>
        </div>
        {{end}}
    </div>
</div>