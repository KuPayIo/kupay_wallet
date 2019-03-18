<div class="new-page" w-class="new-page">
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    <div w-class="top-bar">
        <div w-class="top-bar-container">
            <img on-tap="backPrePage" src="../../../res/image/left_arrow_blue.png" w-class="ga-back" />
            <div w-class="input-father" ev-input-change="searchTextChange" ev-input-clear="searchTextClear">
                {{: Search = {"zh_Hans":"Search","zh_Hant":"Search","en":""} }}
                <app-components1-input-input>{placeHolder:{{Search}},clearable:"true",style:"background-color:#f3f6f9;",notUnderLine:true}</app-components1-input-input>
            </div>
            <div on-tap="searchClick" style="border: 24px solid transparent;">
                <pi-ui-lang>{"zh_Hans":"搜索","zh_Hant":"搜索","en":""}</pi-ui-lang>
            </div>
        </div>
    </div>
    <div w-class="body">
        {{if it.showAssetList.length <= 0}}
        <div w-class="no-record">
            <img src="../../../res/image/search_no.png" w-class="no-record-icon"/>
            <div>
                <pi-ui-lang>{"zh_Hans":"沒有找到您想要的","zh_Hant":"沒有找到您想要的","en":""}</pi-ui-lang>
            </div>
        </div>
        {{else}}
        <div w-class="asset-list">
            {{for i,v of it.showAssetList}}
            <div w-class="list-item">
                <app-components-threeParaItem-threeParaItem>{img:"{{v.logo}}",title:{{v.currencyName}},desc:{{v.description}}}</app-components-threeParaItem-threeParaItem>
                {{if v.canSwtiched}}
                <div w-class="swtich-btn" ev-switch-click="onSwitchChange(e,{{i}})"><app-components-switch-switch>{types:{{v.added}}}</app-components-switch-switch></div>
                {{end}}
            </div>
            {{end}}
        </div>
        {{end}}
    </div>
</div>