<div class="new-page" ev-back-click="backPrePage" w-class="new-page" ev-next-click="goDetail">
        {{: topBarTitle = {"zh_Hans":"导出私钥","zh_Hant":"導出私鑰","en":""} }}
        <app-components1-topBar-topBar>{title:{{topBarTitle}},nextImg:"../../res/image/41_gray.png"}</app-components1-topBar-topBar>
        <div w-class="container">
            <div w-class="currency-container" ev-collapse-change="collapseChange" ev-collapse-item-click="collapseItemClick">
                <app-components-collapse-collapse>{collapseList:{{it1.collapseList}},accordion:true}</app-components-collapse-collapse>
            </div>
        </div>
    </div>