<div class="new-page" w-class="new-page" on-tap="closePage">
    <div w-class="body" on-tap="no">
        <div w-class="title"><pi-ui-lang>{"zh_Hans":"理财声明","zh_Hant":"理財聲明","en":""}</pi-ui-lang></div>
        <div w-class="statement"><div>{{it1.statement}}</div></div>
        <div w-class="agree-choose" ev-checkbox-click="checkBoxClick">
            <app-components1-checkbox-checkbox>{itype:"false",text:{{it1.cfgData.mess}} }</app-components1-checkbox-checkbox>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn">
            {{: btnName = {"zh_Hans":"我已阅读","zh_Hant":"我已閱讀","en":""} }}
            <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"white"}</app-components1-btn-btn>
        </div>
    </div>
</div>