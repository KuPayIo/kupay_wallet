<div class="new-page" ev-back-click="backPrePage" ev-radioList-change="changeSelect">
    {{if it.flag === 0 }}
        {{: topBarTitle = {"zh_Hans":"语言","zh_Hant":"語言","en":""} }}
    {{else}}
        {{: topBarTitle = {"zh_Hans":it.title,"zh_Hant":it.title,"en":""} }}    
    {{end}}

    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    
    <app-components-radioList-radioList>{list:{{it.list1}},selected:{{it.selectedIndex}} }</app-components-radioList-radioList>
</div>