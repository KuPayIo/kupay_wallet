<div class="new-page" w-class="new-page" on-tap="closePage">
    <div w-class="body" on-tap="no">
        <div w-class="title"><pi-ui-lang>{"zh_Hans":"理财声明","zh_Hant":"理財聲明","en":""}</pi-ui-lang></div>
        <div w-class="statement"><div>{{it.statement}}</div></div>
        <div w-class="agree-choose" ev-checkbox-click="checkBoxClick">
            {{: mess = {"zh_Hans":"我已经认真阅读并同意","zh_Hant":"我已經認證閱讀並同意","en":""} }}
            <app-components-checkbox-checkbox>{itype:"false",text:{{mess}} }</app-components-checkbox-checkbox>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn">
            {{: btnName = {"zh_Hans":"我已阅读","zh_Hant":"我已閱讀","en":""} }}
            <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue","cannotClick":{{!it.readed}}}</app-components1-btn-btn>
        </div>
    </div>
</div>