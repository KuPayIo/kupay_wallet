<div class="new-page" w-class="new-page" >
    <div w-class="main" on-scroll="getMoreList">
    {{if it.recordList.length <= 0}}
    <div w-class="no-recode">
        <img src="../../../res/image/dividend_history_none.png" w-class="no-recode-icon"/>
        <div w-class="no-recode-text"><pi-ui-lang>{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</pi-ui-lang></div>
    </div>
    {{end}}
    <div w-class="record-list">
        {{for i,v of it.recordList}}
        <div on-tap="recordListItemClick(e,{{i}})" w-class="item-container">
        {{: behavior ={"zh_Hans":v.behavior,"zh_Hant":v.behavior,"en":""} }}
        <app-components-fourParaImgItem-fourParaImgItem>{"name":{{behavior}},"data":{{v.amountShow}},"time":{{v.timeShow}},img:{{'../../res/image/' + v.iconShow}}}</app-components-fourParaImgItem-fourParaImgItem>
        </div>
        {{end}}
    </div>
    </div>  
</div>