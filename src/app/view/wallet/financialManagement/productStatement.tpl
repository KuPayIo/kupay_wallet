<div class="new-page" w-class="new-page" on-tap="closePage">
    <div w-class="body" on-tap="no">
        <div w-class="title">{{it1.cfgData.title}}</div>
        <div w-class="statement"><div>{{it1.statement}}</div></div>
        <div w-class="agree-choose" ev-checkbox-click="checkBoxClick">
            <app-components1-checkbox-checkbox>{itype:"false",text:{{it1.cfgData.mess}} }</app-components1-checkbox-checkbox>
        </div>
        <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"white"}</app-components1-btn-btn></div>
    </div>
</div>