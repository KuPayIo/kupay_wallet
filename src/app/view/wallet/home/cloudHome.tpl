<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset">总资产：￥{{it1.totalAsset}}</div>
    </div>
    <div w-class="asset-list" ev-item-click="itemClick">
        <app-components1-walletAssetList-walletAssetList>{ assetList:{{it1.assetList}} }</app-components1-walletAssetList-walletAssetList>
    </div>
</div>