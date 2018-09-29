<div class="new-page" w-class="new-page">
    <div w-class="top-bar">
        <div w-class="top-bar-container">
            <img on-tap="backPrePage" src="../../../res/image/left_arrow_blue.png" w-class="ga-back" />
            <div w-class="input-father" ev-input-change="searchTextChange" ev-input-clear="searchTextClear"><app-components-input-suffixInput>{placeHolder:"Search",clearable:{{true}},style:"background-color:#f3f6f9;"}</app-components-input-suffixInput></div>
            <div on-tap="searchClick">{{it1.cfgData.search}}</div>
        </div>
    </div>
    <div w-class="body">
        {{if it1.showAssetList.length <= 0}}
        <div w-class="no-record">
            <img src="../../../res/image/search_no.png" w-class="no-record-icon"/>
            <div>{{it1.cfgData.noneRes}}</div>
        </div>
        {{else}}
        <div w-class="asset-list">
            {{for i,v of it1.showAssetList}}
            <div w-class="list-item">
                <app-components-threeParaItem-threeParaItem>{img:"{{v.currencyName}}.png",title:{{v.currencyName}},desc:{{v.description}}}</app-components-threeParaItem-threeParaItem>
                {{if v.canSwtiched}}
                <div w-class="swtich-btn" ev-switch-click="onSwitchChange(e,{{i}})"><app-components-switch-switch>{types:{{v.added}}}</app-components-switch-switch></div>
                {{end}}
            </div>
            {{end}}
        </div>
        {{end}}
    </div>
</div>