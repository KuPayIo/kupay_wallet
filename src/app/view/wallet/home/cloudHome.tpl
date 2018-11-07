<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset"><pi-ui-lang>{"zh_Hans":"云资产：≈","zh_Hant":"雲資產：≈","en":""}</pi-ui-lang>{{it1.currencyUnitSymbol}}{{it1.totalAsset}}</div>
    </div>
    <div w-class="container">
        <div w-class="asset-list" ev-item-click="itemClick">
            <app-components1-walletAssetList-walletAssetList>{ assetList:{{it1.assetList}},redUp:{{it1.redUp}},currencyUnitSymbol:{{it1.currencyUnitSymbol}} }</app-components1-walletAssetList-walletAssetList>
        </div>
        <div w-class="fm-container">
            <div w-class="fm-title" >
                <div><pi-ui-lang>{"zh_Hans":"优选理财","zh_Hant":"優選理財","en":""}</pi-ui-lang></div>
                <img src="../../../res/image1/25_blue.png" on-tap="optimalClick" w-class="fmImg"/>
            </div>
            
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