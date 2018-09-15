<div class="new-page">
    {{if it1.purchaseRecord.length === 0}}
    <div w-class="no-recode">
        <img src="../../../res/image/dividend_history_none.png" w-class="no-recode-icon"/>
        <div w-class="no-recode-text">还没有买过理财</div>
    </div>
    {{else}}
    <div w-class="list">
        {{for i,v of it1.purchaseRecord}}
        <app-view-wallet-components-holdedProductItem>{product:{{v}}}</app-view-wallet-components-holdedProductItem>
        {{end}}
    </div>
    {{end}}
</div>