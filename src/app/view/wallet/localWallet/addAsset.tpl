<div class="new-page" w-class="new-page">
    <div w-class="top-bar">
        <div w-class="top-bar-container">
            <img on-tap="backPrePage" src="../../../res/image/left_arrow_blue.png" w-class="ga-back" />
            <div>搜索</div>
        </div>
    </div>
    <div w-class="body">
        <div w-class="asset-list">
            {{for i,v of it1.assetList}}
            <div w-class="list-item">
                <app-components-threeParaItem-threeParaItem>{img:"{{v.currencyName}}.png",title:{{v.currencyName}},desc:{{v.description}}}</app-components-threeParaItem-threeParaItem>
                {{if v.canSwtiched}}
                <div w-class="swtich-btn" ev-switch-click="onSwitchChange(e,{{i}})"><app-components-switch-switch>{types:{{v.added}}}</app-components-switch-switch></div>
                {{end}}
            </div>
            {{end}}
        </div>
    </div>
</div>