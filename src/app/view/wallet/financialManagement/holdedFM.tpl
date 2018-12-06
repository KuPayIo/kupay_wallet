<div class="new-page" w-class="new-page">
    {{if it.purchaseRecord.length === 0}}
    <div w-class="no-recode">
        <img src="../../../res/image/dividend_history_none.png" w-class="no-recode-icon"/>
        <div w-class="no-recode-text"><pi-ui-lang>{"zh_Hans":"还没有购买过理财","zh_Hant":"還沒有買過理財","en":""}</pi-ui-lang></div>
    </div>
    {{else}}
    <div w-class="list">
        {{for i,v of it.purchaseRecord}}
        <app-view-wallet-components-holdedProductItem>{product:{{v}},index:{{i}} }</app-view-wallet-components-holdedProductItem>
        {{end}}
    </div>
    {{end}}
</div>