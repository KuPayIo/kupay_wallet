<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset"><pi-ui-lang>{"zh_Hans":"云资产：≈","zh_Hant":"雲資產：≈","en":""}</pi-ui-lang>{{it.currencyUnitSymbol}}{{it.totalAsset}}</div>
    </div>
    <div w-class="container">
        <div w-class="asset-list" ev-item-click="itemClick">
            <app-components1-walletAssetList-walletAssetList>{ assetList:{{it.assetList}},redUp:{{it.redUp}},currencyUnitSymbol:{{it.currencyUnitSymbol}} }</app-components1-walletAssetList-walletAssetList>
        </div>
        {{if it.financialModulIsShow}}
        <div w-class="space"></div>
        <div w-class="fm-container">
            <div w-class="fm-title" >
                <div><pi-ui-lang>{"zh_Hans":"优选理财","zh_Hant":"優選理財","en":""}</pi-ui-lang></div>
                <img src="../../../res/image1/25_blue.png" on-tap="optimalClick" w-class="fmImg"/>
            </div>
            
            <div w-class="fm-list">
                {{for i,v of it.productList}}
                <div on-tap="fmItemClick(e,{{i}})">
                    <app-components1-fmListItem-fmListItem>{ product:{{v}} }</app-components1-fmListItem-fmListItem>
                </div>
                {{end}}
            </div>
        </div>
        {{end}}
    </div>
</div>