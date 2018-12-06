<div class="new-page" w-class="new-page"  >
    <div w-class="product-list">
        {{for i,v of it.productList}}
        <div on-tap="fmListItemClick(e,{{i}})">
        <app-view-wallet-components-fmListItem>{ product:{{v}} }</app-view-wallet-components-fmListItem>
        </div>
        {{end}}
    </div>
</div>