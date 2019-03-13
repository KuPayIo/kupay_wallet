<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-import-success="importSuccess">
    {{: topBarTitle = {"zh_Hans":"导入","zh_Hant":"導入","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <app-components-tabs-tabs>{list:{{it.tabList}}}</app-components-tabs-tabs>
</div>