<div class="new-page" w-class="new-page">
    <div w-class="main">
    {{if it1.recordList.length <= 0}}
    <div w-class="no-recode">
        <img src="../../../res/image/dividend_history_none.png" w-class="no-recode-icon"/>
        <div w-class="no-recode-text">还没有记录哦</div>
    </div>
    {{end}}
    <div w-class="record-list">
        {{for i,v of it1.recordList}}
        <div on-tap="recordListItemClick(e,{{i}})" w-class="item-container">
        <app-components-fourParaImgItem-fourParaImgItem>{"name":{{v.behavior}},"data":{{v.amountShow}},"time":{{v.timeShow}},img:{{'../../res/image/' + v.iconShow}}}</app-components-fourParaImgItem-fourParaImgItem>
        </div>
        {{end}}
    </div>
    </div>  
</div>