<div class="new-page" w-class="new-page"  >
    <div w-class="product-list">
        {{for i,v of it.productList}}
        <div on-tap="fmListItemClick(e,{{i}})">
        <app-components1-fmListItem-fmListItem>{ product:{{v}} }</app-components1-fmListItem-fmListItem>
        </div>
        {{end}}
    </div>
</div>