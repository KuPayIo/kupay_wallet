<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="mainPanel">
        <div w-class="panelTitle">
                理财声明
        </div>
        <div w-class="panelContent">
            {{it1.notice}}
        </div>
        <div w-class="agreeChoose" ev-checkbox-click="checkBoxClick">
            <app-components_level_1-checkbox-checkbox>{itype:"false",text:"我已经认证阅读并同意"}</app-components_level_1-checkbox-checkbox>
        </div>
        <div w-class="agreeBtn {{it1.isAgree ? 'active' : ''}}" on-tap="agreeClicked">
                我已阅读
        </div>
    </div>
</div>