<div class="new-page" ev-back-click="backPrePage" w-class="new-page">
        <app-components1-topBar-topBar>{title:{{it1.cfgData.topBarTitle}},nextImg:"../../res/image/41_blue.png"}</app-components1-topBar-topBar>
        <div w-class="container">
            <div w-class="currency-container" ev-collapse-change="collapseChange" ev-collapse-item-click="collapseItemClick">
                <app-components-collapse-collapse>{collapseList:{{it1.collapseList}},accordion:true}</app-components-collapse-collapse>
            </div>
        </div>
    </div>