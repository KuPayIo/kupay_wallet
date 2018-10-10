<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset">{{it1.cfgData.totalAmount}}￥{{it1.totalAsset}}</div>
    </div>
    <div w-class="container">
        <div w-class="asset-list" ev-item-click="itemClick">
            <app-components1-walletAssetList-walletAssetList>{ assetList:{{it1.assetList}},redUp:{{it1.redUp}} }</app-components1-walletAssetList-walletAssetList>
        </div>
        <div w-class="fm-container">
            <div w-class="fm-title" ><div>{{it1.cfgData.financial}}</div><img src="../../../res/image1/25_blue.png" on-tap="optimalClick" w-class="fmImg"/></div>
            
            <div w-class="fm-list">
                {{for i,v of it1.productList}}
                <div on-tap="fmItemClick(e,{{i}})">
                    <app-view-wallet-components-fmListItem>{ product:{{v}} }</app-view-wallet-components-fmListItem>
                </div>
                {{end}}
            </div>
        </div>
    </div>
</div>