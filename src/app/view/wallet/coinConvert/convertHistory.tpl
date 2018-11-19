<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"币币兑换","zh_Hant":"幣幣兌換","en":""} }}
    <app-components1-topBar-topBar>{title:{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content" on-scroll="">
        {{for ind,item of it1.txsShow}}
        <div w-class="item">
            <div w-class="itemRow status">
                <span w-class="{{item.status_class}}" style="flex: 1 0 0;">{{item.status_show}}</span>
                <span>{{item.inputCurrency}}<img src="../../../res/image/rightArrow.png" w-class="arrow"/>{{item.outputCurrency}}</span>
            </div>
            <div w-class="itemRow rate">
                <span style="flex: 1 0 0;"><pi-ui-lang>{"zh_Hans":"汇率","zh_Hant":"匯率","en":""}</pi-ui-lang>&nbsp;{{item.shiftRate}}</span>
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
            <div><pi-ui-lang>{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</pi-ui-lang></div>
        </div>
        {{end}}
    </div>
</div>