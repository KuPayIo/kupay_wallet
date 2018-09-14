<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset">总资产：￥{{it1.totalAsset}}</div>
    </div>
    <div w-class="asset-list" ev-item-click="itemClick">
        <app-components1-walletAssetList-walletAssetList>{ assetList:{{it1.assetList}} }</app-components1-walletAssetList-walletAssetList>
    </div>
    <div w-class="fm-container">
        <div w-class="fm-title" ><div>优选理财</div><img src="../../../res/image/right_arrow_gray.png" on-tap="optimalClick"/></div>
        
        <div w-class="fm-list">
            {{for i,v of it1.productList}}
            <div on-tap="fmItemClick(e,{{i}})">
            <app-view-wallet-components-fmListItem>{ product:{{v}} }</app-view-wallet-components-fmListItem>
            </div>
            {{end}}
        </div>
    </div>
</div>