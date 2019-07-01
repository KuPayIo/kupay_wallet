<div class="new-page" ev-next-click="share" ev-back-click="backPrePage" w-class="new-page">
    {{: topBarTitle = {"zh_Hans":"帮助","zh_Hant":"幫助","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="content">
        <app-components-collapse-collapse1>{htmlStrList:{{it.htmlStrList}},accordion:true}</app-components-collapse-collapse1>
    </div>
    
</div>
