<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #f9f9f9;">
    <app-components-topBar-topBar>{title:"语言设置"}</app-components-topBar-topBar>
    <div  w-class="language-radio-group" ev-radio-change="radioChangeListener">
        {{for ind,val of it1.data}}
            <languageItem$>{{val}}</languageItem$>
        {{end}}   
    </div>
</div>
