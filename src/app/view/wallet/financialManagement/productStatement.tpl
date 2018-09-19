<div class="new-page" w-class="new-page" on-tap="closePage">
    <div w-class="body" on-tap="no">
        <div w-class="title">理财声明</div>
        <div w-class="statement"><div>{{it1.statement}}</div></div>
        <div w-class="agree-choose" ev-checkbox-click="checkBoxClick">
            <app-components1-checkbox-checkbox>{itype:"false",text:"我已经认证阅读并同意"}</app-components1-checkbox-checkbox>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":"我已阅读","types":"big","color":"white"}</app-components1-btn-btn></div>
    </div>
</div>