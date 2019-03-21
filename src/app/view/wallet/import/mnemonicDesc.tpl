<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"什么是助记词","zh_Hant":"什麼是助記詞","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: title = {"zh_Hans":"什么是助记词？","zh_Hant":"什麼是助記詞？","en":""} }}
        <div w-class="title"><pi-ui-lang>{{title}}</pi-ui-lang></div>
        <div w-class="desc">
        {{for index,item of it.mnemonicDesc}}
            <div w-class="desc-item"><pi-ui-lang>{{ item }}</pi-ui-lang></div>
        {{end}}
        </div>
    </div>
</div>